require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { execSync } = require('child_process');
const { Transaction } = require('@mysten/sui/transactions');
const toml = require('toml');
const tomlify = require('tomlify-j0.4');
const { SuiClient } = require('@mysten/sui/client');
const { Ed25519Keypair } = require('@mysten/sui/keypairs/ed25519');
const { fromB64 } = require('@mysten/sui/utils');

const DEFAULT_GAS_BUDGET = 30000000;

const moveCoinFolder = (sanitizedName) => {
  const rootPath = process.cwd();
  const sourcePath = path.join(rootPath, sanitizedName);
  const parentDir = path.dirname(rootPath);
  console.log(parentDir);
  const targetPath = path.join(parentDir, 'move_module', sanitizedName);
  
  try {
    fs.mkdirSync(path.join(parentDir, 'move_module'), { recursive: true });
    
    /* 
     * i think this is not desired behaviour. this removes the coin
     *  directory if it already exists in our move_module. we'd have 
     *  to do some validation on our "manager/factory" to ensure
     *  unique tokens …
     * */
    if (fs.existsSync(targetPath)) {
      fs.rmSync(targetPath, { recursive: true, force: true });
    }

    fs.renameSync(sourcePath, targetPath);
    console.log(`Moved ${sanitizedName} to ${parentDir}/move_module successfully`);
  } catch (error) {
    console.error(`Error moving ${sanitizedName} folder:`, error);
    throw error;
  } 
};

const newCoin = async (name, symbol, iconUrl, description, network = 'testnet') => {

  if (!name || !symbol || !description) {
    throw new Error('Name, symbol, and description are required');
  }

  const sanitizedName = name.replace(/\s+/g, '_').toLowerCase();
  const sanitizedSymbol = symbol.toUpperCase();
  const capitalizedName = sanitizedName.charAt(0).toUpperCase() + sanitizedName.slice(1);

  const rootPath = process.cwd();
  const packagePath = path.join(rootPath, `${sanitizedName}/`);

  console.log(packagePath);

  try {
    console.log(`Creating new Sui Move project: ${sanitizedName}`);
    execSync(`sui move new ${sanitizedName}`);
    
    const templatePath = path.join(rootPath, "scripts", "template.txt");
    let fileContent = fs.readFileSync(templatePath, "utf8");

    const replacements = {
      'template_description': description,
      'TEMPLATE': sanitizedSymbol,
      'Template': capitalizedName,
      'template': sanitizedName
    };

    Object.entries(replacements).forEach(([placeholder, replacement]) => {
        fileContent = fileContent.replace(new RegExp(placeholder, 'g'), replacement);
    });

    const sourceFilePath = path.join(packagePath, 'sources', `${sanitizedName}.move`);
    fs.writeFileSync(sourceFilePath, fileContent);

    const moveTomlPath = path.join(packagePath, 'Move.toml');
        
    let moveTomlContent = fs.readFileSync(moveTomlPath, 'utf8');
    const parsedToml = toml.parse(moveTomlContent);

    parsedToml.dependencies = parsedToml.dependencies || {};
    parsedToml.dependencies.Sui = {
      git: "https://github.com/MystenLabs/sui.git", 
      subdir: "crates/sui-framework/packages/sui-framework", 
      rev: "9c04e1840eb5", 
      override: true
    };

    const updatedTomlContent = tomlify.toToml(parsedToml, {
      spaces: 2,
      forceBracketObjects: true
    });

    fs.writeFileSync(moveTomlPath, updatedTomlContent);

    console.log('Building Sui Move package...');
    const { modules, dependencies } = JSON.parse(
      execSync(`sui move build --dump-bytecode-as-base64 --path ${packagePath} --install-dir ${packagePath}`, {
        encoding: 'utf-8',
      })
    );

    const tx = new Transaction();
    const cap = tx.publish({
        modules,
        dependencies,
    });

    // Transfer the upgrade capability to the sender so they can upgrade the package later
    tx.moveCall({
      target: "0x2::package::make_immutable",
      arguments: [
        cap,
      ]
    });

    console.log(`Coin project ${sanitizedName} created successfully!`);
    moveCoinFolder(sanitizedName);

    const keyPair = loadKeypairFromEnv();
    console.log(keyPair);
    console.log(`Publishing ${sanitizedName} token to ${network}...`);
    const publishResult = await publishToNetwork(tx, keyPair, network);
    
    console.log('Publication result:', publishResult);
    return {
      transaction: tx,
      publishResult,
      coinName: sanitizedName,
      symbol: sanitizedSymbol
    };

  } catch (error) {
    console.error('Error creating Sui coin project:', error);
    throw error;
  }
}

const loadKeypairFromEnv = () => {
  try {
  	const privateKeyB64 = process.env.SUI_PRIVATE_KEY;
	if (!privateKeyB64) {
      throw new Error('SUI_PRIVATE_KEY environment variable not set');
    }
    
    const privateKeyBytes = fromB64(privateKeyB64);

    console.log(privateKeyBytes, privateKeyB64);
	return Ed25519Keypair.fromSecretKey(privateKeyBytes.slice(1));
  } catch (error) {
    console.error('Error loading keypair:', error);
    throw error;
  }
};

const publishToNetwork = async (transaction, keyPair, networkType = 'testnet') => {
  try {
    const networks = {
      'mainnet': 'https://fullnode.mainnet.sui.io:443',
      'testnet': 'https://fullnode.testnet.sui.io:443',
      'devnet': 'https://fullnode.devnet.sui.io:443',
    };
    
    const rpcUrl = networks[networkType] || networks.devnet;
    const client = new SuiClient({ url: rpcUrl });
    
    const senderAddress = keyPair.getPublicKey().toSuiAddress();

    transaction.setSender(senderAddress);
    
    transaction.setGasBudget(DEFAULT_GAS_BUDGET);

	const txBlock = await transaction.build({ client });
	const signedTx = await keyPair.signTransaction(txBlock);

	const bytes = txBlock;
	const signature = signedTx.signature;
    console.log(bytes, signature)
    
    const response = await client.executeTransactionBlock({
      transactionBlock: bytes,
      signature,
      options: {
        showEffects: true,
        showEvents: true,
        showObjectChanges: true,
      }
    });
    
    console.log('Transaction executed successfully!');
    console.log('Transaction digest:', response.digest);
    console.log(response);
    
    if (response.effects?.status?.status === 'success') {
      console.log('Package published successfully!');
      
      const createdObjects = response.effects.created || [];
      const packageObject = createdObjects.find(obj => obj.owner === 'Immutable');
      
      if (packageObject) {
        console.log('Package ID:', packageObject.reference.objectId);
        return {
          success: true,
          packageId: packageObject.reference.objectId,
          transactionDigest: response.digest,
          response
        };
      }
      
      return {
        success: true,
        transactionDigest: response.digest,
        response
      };
    } else {
      console.error('Transaction failed:', response.effects?.status);
      return {
        success: false,
        error: response.effects?.status,
        response
      };
    }
  } catch (error) {
    console.error('Error publishing to network:', error);
    throw error;
  }
};


newCoin("lagos", "LAGOS", "http://somewhere.com", "A better version of Naira");
