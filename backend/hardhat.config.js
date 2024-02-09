require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");

const PK_DEPLOYER = process.env.PK_DEPLOYER;
const PK_SELLER = process.env.PK_SELLER;
const PK_BUYER = process.env.PK_BUYER;

const SEPOLIA = process.env.SEPOLIA_ENDPOINT;

const HH_PK_DEPLOYER = {
  privateKey: PK_DEPLOYER,
  balance: "2750000000000000000000",
};
const HH_PK_SELLER = {
  privateKey: PK_SELLER,
  balance: "2750000000000000000000",
};
const HH_PK_BUYER = {
  privateKey: PK_BUYER,
  balance: "2750000000000000000000",
};

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      saveDeployments: true,
      accounts: [HH_PK_DEPLOYER, HH_PK_SELLER, HH_PK_BUYER],
    },
    sepolia: {
      chainId: 11155111,
      url: SEPOLIA,
      accounts: [PK_DEPLOYER, PK_SELLER, PK_BUYER],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    seller: {
      default: 1,
    },
    buyer: {
      default: 2,
    },
  },
};
