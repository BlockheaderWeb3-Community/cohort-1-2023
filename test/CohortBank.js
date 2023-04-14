// Import the necessary modules
const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
  const { ethers } = require("hardhat");
  
  const TEST_AMOUNT = ethers.utils.parseEther("1");
  
  describe("CohortBank", function () {
    async function runEveryTime() {
      const ONE_YEAR_IN_SECONDS = 365 * 24 * 60 * 60;
      const ONE_GWEI = 1000000000;
  
      const lockedAmount = ONE_GWEI;
      const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECONDS;
      const [owner, adr1] = await ethers.getSigners();
  
      const CohortBank = await ethers.getContractFactory("CohortBank");
      const cohortBank = await CohortBank.deploy(unlockTime, {
        value: lockedAmount,
      });
  
      await cohortBank.deployed();
  
      return { cohortBank, owner, adr1, unlockTime, lockedAmount };
    }
  
    // Deployment
    describe("Deployment", function () {
      // Checking Unlockedtime
      it("Should check unlocked time", async () => {
        const { cohortBank, unlockTime } = await loadFixture(runEveryTime);
  
        expect(await cohortBank.unlockTime()).to.equal(unlockTime);
      });
  
      // Checking Owner
      it("Should set the owner", async () => {
        const { cohortBank, owner } = await loadFixture(runEveryTime);
  
        expect(await cohortBank.owner()).to.equal(owner.address);
      });
  
      // Check balance
      it("Should receive    and store the funds to CohortBank", async () => {
        const { cohortBank, lockedAmount } = await loadFixture(runEveryTime);
        // const totalBAl = await ethers.provider.getBalance(cohortBank.address);
        // console.log(totalBAl.toNumber());
        expect(await ethers.provider.getBalance(cohortBank.address)).to.equal(
          lockedAmount
        );
      });
  
      // Condition check
      it("Should fail if the unlockTime is not inthe future", async () => {
        const latestTime = await time.latest();
        const CohortBank = await ethers.getContractFactory("CohortBank");
        await expect(
          CohortBank.deploy(latestTime, { value: 1 })
        ).to.be.revertedWith("Unlock time should be in the future");
      });
    });
  
    // Withdrawals
    describe("Withdrawals", function () {
      describe("Validations", async function () {
        it("Should revert if the owner calls before unlock time", async () => {
          const { cohortBank, unlockTime, adr1 } = await loadFixture(
            runEveryTime
          );
  
          //make deposit of a certain amount, that will be withdrawn
  
          await cohortBank.deposit({ value: TEST_AMOUNT });
          await expect(cohortBank.withdraw(TEST_AMOUNT)).to.be.revertedWith(
            "You can't withdraw yet"
          );
        });
  
        it("Shold fail if not called by the owner", async () => {
          const { cohortBank, unlockTime, adr1 } = await loadFixture(
            runEveryTime
          );
  
          //make deposit of a certain amount, that will be withdrawn
  
          await cohortBank.deposit({ value: TEST_AMOUNT });
          await time.increaseTo(unlockTime);
          await expect(
            cohortBank.connect(adr1).withdraw(TEST_AMOUNT)
          ).to.be.revertedWith("You aren't the owner");
        });
      });
    });
  
    // Events
    describe("Events", function () {
      it("Should emit the event on withdrawals", async () => {
        const { cohortBank, unlockTime } = await loadFixture(runEveryTime);
        await cohortBank.deposit({ value: TEST_AMOUNT });
  
        await time.increaseTo(unlockTime);
  
        await expect(cohortBank.withdraw(TEST_AMOUNT))
          .to.emit(cohortBank, "Withdrawal")
          .withArgs(TEST_AMOUNT, anyValue);
      });
    });
  
    // Transfer
    describe("Transfer", function () {
      it("Should transfer the funds to the owner", async () => {
        const { cohortBank, unlockTime, owner } = await loadFixture(runEveryTime);
  
        await cohortBank.deposit({ value: TEST_AMOUNT });
  
        const ownerBalanceBeforeWithdrawal = await ethers.provider.getBalance(
          owner.address
        );
        await time.increaseTo(unlockTime);
        //withdraw
        await cohortBank.withdraw(TEST_AMOUNT);
        const ownerBalanceAfterWithdrawal = await ethers.provider.getBalance(
          owner.address
        );
        expect(ownerBalanceAfterWithdrawal).to.be.gt(
          ownerBalanceBeforeWithdrawal
        );
      });
    });
    runEveryTime();
  });