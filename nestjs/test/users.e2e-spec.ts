import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { disconnect, connection } from 'mongoose';
import { UsersModule } from '@users/users.module';
import { CreateUserDto } from '@users/dto/create-user.dto';
import { ConfigModule } from '@nestjs/config';
import { HttpExceptionFilter } from '../src/common/filter/http-exception-filter/http-exception-filter.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform/transform.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { MongoError } from 'mongodb';


describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let createdUserId: string;
  const testWalletAddress = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
  const testUser: CreateUserDto = {
    walletAddress: testWalletAddress,
    username: 'testuser',
    bio: 'Test bio'
  };

  beforeAll(async () => {
    
    const uri = 'mongodb://localhost:27017/test-db';
 
    await connection.collection('your-collection').deleteMany({});
    console.log('URI:', uri);
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        MongooseModule.forRoot(uri),
        ConfigModule.forRoot(),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    

    await app.init();
  });

  afterAll(async () => {
    Promise.all([
      connection.collection('test-db').deleteMany({}),
    ])
    await disconnect();
    // await mongod.stop();
    await app.close();
  });

  it('/users (POST) - should create a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(testUser)
      .expect(201);

    console.log(response.body)
    let data = response.body.data;

    expect(data).toHaveProperty('_id');
    expect(data.walletAddress).toBe(testUser.walletAddress);
    expect(data.username).toBe(testUser.username);
    expect(data.bio).toBe(testUser.bio);
    
    createdUserId = data._id;
  });

  it('/users (POST) - should fail with empty wallet address', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({ ...testUser, walletAddress: '' })
      .expect(400);
  });

  it('/users (GET) - should return all users', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(Array.isArray(response.body.data)).toBeTruthy();
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it('/users/by-wallet?address= (GET) - should return user by wallet address', async () => {
    const response = await request(app.getHttpServer())
      .get('/users/by-wallet?address=' + testWalletAddress)
      .expect(200);

    expect(response.body).toHaveProperty('success', true);  
    expect(response.body.data.walletAddress).toBe(testWalletAddress);
  });

  it('/users/by-wallet?address= (GET) - should return user by wallet address', async () => {
    const response = await request(app.getHttpServer())
      .get('/users/by-wallet?address=' + testWalletAddress)
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data.walletAddress).toBe(testWalletAddress);
  });

  it('/users/:id (PATCH) - should update user', async () => {
    const updatedBio = 'Updated bio';
    const response = await request(app.getHttpServer())
      .patch('/users/' + createdUserId)
      .send({ bio: updatedBio })
      .expect(200);

    expect(response.body).toHaveProperty('success', true);  
    expect(response.body.data.bio).toBe(updatedBio);
  });

  it('/users/wallet/:address (PATCH) - should update user by wallet address', async () => {
    const updatedUsername = 'updateduser';
    const response = await request(app.getHttpServer())
      .patch('/users/wallet/' + testWalletAddress)
      .send({ username: updatedUsername })
      .expect(200);

    expect(response.body).toHaveProperty('success', true);  
    expect(response.body.data.username).toBe(updatedUsername);
  });

  it('/users/:id (DELETE) - should delete user', async () => {
    await request(app.getHttpServer())
      .delete('/users/' + createdUserId)
      .expect(200);

    await request(app.getHttpServer())
      .get('/users/' + createdUserId)
      .expect(404);
  });

  it('/users/wallet/:address (DELETE) - should delete user by wallet address', async () => {
    // First create another user to delete
    const newUser = await request(app.getHttpServer())
      .post('/users')
      .send({ walletAddress: '0xAnotherTestAddress' })
      .expect(201);

    await request(app.getHttpServer())
      .delete('/users/wallet/' + newUser.body.walletAddress)
      .expect(200);

    // Verify deletion
    await request(app.getHttpServer())
      .get('/users/by-wallet?address=' + newUser.body.walletAddress)
      .expect(404);
  });

  describe('Duplicate User Handling', () => {
    it('/users (POST) should prevent duplicate wallet addresses', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send(testUser)
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(testUser)
        .expect(409);

      expect(response.body).toEqual({
        statusCode: 409,
        message: 'Wallet address already exists',
        error: 'Conflict',
      });
    });

    it('should prevent duplicate usernames', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({ 
          walletAddress: '0xUniqueAddress1',
          username: 'uniqueuser'
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          walletAddress: '0xUniqueAddress2',
          username: 'uniqueuser' // Same username
        })
        .expect(409);

      expect(response.body).toEqual({
        statusCode: 409,
        message: 'Username already exists',
        error: 'Conflict',
      });
    });
  });
});
