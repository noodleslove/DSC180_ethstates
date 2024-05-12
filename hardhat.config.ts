import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import "@openzeppelin/hardhat-upgrades";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();

import "./tasks/faucet";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.23",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200, // Adjust the number of runs as needed
      },
    },
  },
  defaultNetwork: "localhost",
  networks: {
    polygonAmoy: {
      url: process.env.ALCHEMY_AMONY_URL,
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_KEY,
    customChains: [
      {
        network: "polygonAmoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com/"
        },
      },
    ],
  },
};

export default config;
