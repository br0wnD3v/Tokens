// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");
const hre = require("hardhat");
const { expect } = require("chai");

async function main() {
  const token = await hre.ethers.getContractFactory("OwnToken");
  const Name = "Golden Tickets";
  const Symbol = "GLD";

  var [owner] = await ethers.getSigners();
  owner = owner.address;

  const Token = await token.deploy(Name, Symbol);
  await Token.deployed();

  console.log(`Deployed Token At ${Token.address}`);

  const balance = await Token.balanceOf(owner);
  console.log(`Balance of owner ${owner} is ${balance} Tokens`);

  expect(await Token.totalSupply()).to.equal(balance);
}

main()
  .then(() => {})
  .catch((err) => {
    console.error(err);
  });
