const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("Setting Up...", function () {
  async function deploymentFixture() {
    const token = await ethers.getContractFactory("Token");
    const [owner, ac1, ac2] = await ethers.getSigners();

    const Token = await token.deploy("GOLD", "GLD");
    await Token.deployed();

    return { Token, owner, ac1, ac2 };
  }

  it("Should set the correct owner.", async function () {
    const { Token, owner } = await loadFixture(deploymentFixture);
    const expectedOwner = await Token.getOwner();
    expect(expectedOwner).to.equal(owner.address);
  });

  it("Should set the balance of the owner same as the total supply.", async function () {
    const { Token, owner } = await loadFixture(deploymentFixture);
    const expectedBalance = await Token.totalSupply();
    expect(await Token.balanceOf(owner.address)).to.be.equal(expectedBalance);
  });

  describe("Vanilla Transfers.", function () {
    it("Should update the balance of both the receiver and sender upon transfer.", async function () {
      const { Token, owner, ac1 } = await loadFixture(deploymentFixture);

      expect(await Token.transfer(ac1.address, 100)).to.changeTokenBalances(
        Token,
        [owner, ac1],
        [-100, 100]
      );
    });

    it("Should emit a 'Transfer' event when transferring tokens.", async function () {
      const { Token, owner, ac1 } = await loadFixture(deploymentFixture);

      expect(await Token.transfer(ac1.address, 100))
        .to.emit(Token, "Transfer")
        .withArgs(owner.address, ac1.address, 100);
    });
    it("Should fail if balance < transfer amount and keep the original balance intact.", async function () {
      const { Token, ac1, ac2 } = await loadFixture(deploymentFixture);

      const initialBalance = await Token.balanceOf(ac1.address);
      await expect(
        Token.connect(ac1).transfer(ac2.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
      const finalBalance = await Token.balanceOf(ac1.address);

      assert(initialBalance.eq(finalBalance));
    });
  });

  describe("Approved Transfers.", function () {
    it("Should emit 'Approval' event when making approvals.", async function () {
      const { Token, owner, ac1 } = await loadFixture(deploymentFixture);

      await expect(Token.approve(ac1.address, 100))
        .to.emit(Token, "Approval")
        .withArgs(owner.address, ac1.address, 100);
    });

    it("Should update the _allowance for a spender when approved.", async function () {
      const { Token, owner, ac1 } = await loadFixture(deploymentFixture);
      await Token.approve(ac1.address, 100);

      const expectedAmount = ethers.BigNumber.from(100);
      const result = await Token.allowance(owner.address, ac1.address);

      assert(expectedAmount.eq(result));
    });

    it("Should allow the approved spender to transfer upto the approved amount and fail above that.", async function () {
      const { Token, owner, ac1, ac2 } = await loadFixture(deploymentFixture);

      const initialBalanceOwner = await Token.balanceOf(owner.address);
      const initialBalanceReceiver = await Token.balanceOf(ac2.address);

      await Token.approve(ac1.address, 100);
      await Token.connect(ac1).transferFrom(owner.address, ac2.address, 50);

      const finalBalanceOwner = await Token.balanceOf(owner.address);
      const finalBalanceReceiver = await Token.balanceOf(ac2.address);

      const ownerDifference = initialBalanceOwner.sub(finalBalanceOwner);
      const receiverDifference = finalBalanceReceiver.sub(
        initialBalanceReceiver
      );
      assert(ownerDifference.eq(receiverDifference));

      await expect(
        Token.connect(ac1).transferFrom(owner.address, ac2.address, 60)
      ).to.be.reverted;
    });
  });
});
