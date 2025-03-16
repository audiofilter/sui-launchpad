const About = () => {
  return (
    <div className="rounded-lg ">
      {/* Hero Section */}
      <div className="relative w-full flex flex-col items-center justify-center mb-4 rounded-sm p-3 md:p-8 bg-black md:bg-radial-[at_75%_25%] from-[#7212c7] to-[#000000] to-50%">
        <div className="flex w-full flex-col gap-1 md:gap-2 justify-center items-center md:items-center py-4 md:py-12 bg-gradient-to-r from-[#1f0638] via-[#5A189A] to-black rounded-2xl">
          <p className="text-xl md:text-3xl font-semibold">About Us</p>
          <div className="w-[70%] md:w-[30%]">
            <p className="text-md md:text-lg font-thin text-center">
              Welcome to Memetic Launchpad – Where Memes Meet Blockchain!
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between w-full mt-15">
          <div className="flex flex-col justify-left w-full md:w-[55%]">
            <p className="text-2xl font-semibold">What We Do</p>
            <p className="text-md font-medium bg-gradient-to-r from-[#FFA232] to-[#CC4E02] bg-clip-text text-transparent">
              About Memetic Launchpad
            </p>
            <p className="mt-5">
              The Memetic Launchpad is a decentralized platform that makes it
              easy for anyone to create, trade, and manage memecoins on the X
              blockchain. Whether you’re a crypto enthusiast, a meme lover, or a
              developer, our platform empowers you to:
            </p>
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex gap-2 justify-left items-center">
                <div className="flex justify-center items-center w-8 h-8 rounded-full bg-white">
                  <img src="/assets/create.png" alt="create" width="50%" />
                </div>
                <p>
                  <span className="font-semibold">
                    Create Your Own Memecoin:
                  </span>{" "}
                  No coding skills needed.
                </p>
              </div>
              <div className="flex gap-2 justify-left items-center">
                <div className="flex justify-center items-center w-8 h-8 rounded-full bg-white">
                  <img src="/assets/track.png" alt="create" width="50%" />
                </div>
                <p>
                  <span className="font-semibold">Track Performance:</span>{" "}
                  Monitor your token's price, and liquidity in real-time.
                </p>
              </div>
              <div className="flex gap-2 justify-left items-center">
                <div className="flex justify-center items-center w-8 h-8 rounded-full bg-white">
                  <img src="/assets/create.png" alt="create" width="50%" />
                </div>
                <p>
                  <span className="font-semibold">Trade Seamlessly:</span> Buy
                  and sell memecoins in a secure environment.
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center w-full md:w-[42%]">
            <div className="w-[100%] h-[100%] flex items-center justify-center overflow-hidden rounded-xl">
              <img
                src="/assets/about-us.png"
                alt="About us"
                class="w-full h-full object-cover object-center"
                draggable="false"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-8 my-4 w-full">
        <div className="flex flex-col items-center justify-center w-80% md:w-[50%]">
          <p className="text-2xl font-semibold">
            Who Can Use Memetic Launchpad?
          </p>
          <p className="text-md font-medium bg-gradient-to-r from-[#FFA232] to-[#CC4E02] bg-clip-text text-transparent">
            Who’s It Built For
          </p>
          <p className="mt-5 text-center">
            The Memetic Launchpad is a decentralized platform that makes it easy
            for anyone to create, trade, and manage memecoins on the X
            blockchain. Whether you’re a crypto enthusiast, a meme lover, or a
            developer, our platform empowers you to:
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-5 items-center justify-center w-full md:w-[90%]">
          <div className="relative w-[90%] md:w-90 md:h-90 p-[1px] flex gap-3 bg-black rounded-2xl mr-[1px]">
            <div className="absolute inset-0 bg-gradient-to-r from-[#9033F4] to-[#EC8AEF] hover:bg-transparent rounded-2xl"></div>
            <div className="relative w-full h-full flex flex-col gap-2 py-6 justify-center items-center bg-gradient-to-bl from-[#3c1166] from-5% via-[#1f0638] via-48% to-[#340761] to-98%  transition-all duration-900 text-white rounded-2xl">
              <p className="font-medium">Memecoin Creators</p>
              <div className="w-[70%]">
                <p className="text-center font-thin">
                  Launch your own memecoin with custom tokenomics.
                </p>
              </div>
              <div className="w-45 h-45 flex items-center justify-center overflow-hidden rounded-xl">
                <img
                  src="/assets/creators.png"
                  alt="About us"
                  class="w-full h-full object-contain object-center"
                  draggable="false"
                />
              </div>
            </div>
          </div>

          <div className="relative w-[90%] md:w-90 md:h-90 p-[1px] flex gap-3 bg-black rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-[#9033F4] to-[#EC8AEF] hover:bg-transparent rounded-2xl"></div>
            <div className="relative w-full h-full flex flex-col gap-2 py-6 justify-center items-center bg-gradient-to-bl from-[#3c1166] from-5% via-[#1f0638] via-48% to-[#340761] to-98%  transition-all duration-900 text-white rounded-2xl">
              <p className="font-medium">Traders</p>
              <div className="w-[70%]">
                <p className="text-center font-thin">
                  Buy and sell memecoins with ease
                </p>
              </div>
              <div className="w-45 h-45 flex items-center justify-center overflow-hidden rounded-xl">
                <img
                  src="/assets/traders.png"
                  alt="About us"
                  class="w-full h-full object-contain object-center"
                  draggable="false"
                />
              </div>
            </div>
          </div>

          <div className="relative w-[90%] md:w-90 md:h-90 p-[1px] flex gap-3 bg-black rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-[#9033F4] to-[#EC8AEF] hover:bg-transparent rounded-2xl"></div>
            <div className="relative w-full h-full flex flex-col gap-2 py-6 justify-center items-center bg-gradient-to-bl from-[#3c1166] from-5% via-[#1f0638] via-48% to-[#340761] to-98%  transition-all duration-900 text-white rounded-2xl">
              <p className="font-medium">Liquidity Providers</p>
              <div className="w-[70%]">
                <p className="text-center font-thin">
                  Earn rewards by adding liquidity to memecoin pools.
                </p>
              </div>
              <div className="w-45 h-45 flex items-center justify-center overflow-hidden rounded-xl">
                <img
                  src="/assets/liquidity.png"
                  alt="About us"
                  class="w-full h-full object-contain object-center"
                  draggable="false"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
