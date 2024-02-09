module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy } = deployments;
  const { deployer, seller, buyer } = await getNamedAccounts();

  console.log("\n");
  const mock = await deploy("MockERC20", { from: deployer, log: true });
  const signers = await hre.ethers.getSigners();

  const deployer_mock = await hre.ethers.getContractAt(
    "MockERC20",
    mock.address,
    signers[0]
  );
  const seller_mock = await hre.ethers.getContractAt(
    "MockERC20",
    mock.address,
    signers[1]
  );
  const buyer_mock = await hre.ethers.getContractAt(
    "MockERC20",
    mock.address,
    signers[2]
  );

  await deployer_mock.mint();
  await seller_mock.mint();
  await buyer_mock.mint();

  console.log("Balances -> ");
  console.log(await deployer_mock.balanceOf(deployer));
  console.log(await deployer_mock.balanceOf(seller));
  console.log(await deployer_mock.balanceOf(buyer), "\n");
};

module.exports.tags = ["MockERC20"];
