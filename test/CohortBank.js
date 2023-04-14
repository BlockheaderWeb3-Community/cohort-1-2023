const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
  const {ethers} = require("hardhat");
  const { parseEther } = ethers.utils

  const TEST_ETH = parseEther("2");

  describe("CohortBank Test Suite", function(){
    async function runEveryTime(){
        const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
        const ONE_GWEI = 1000000000;

        const lockedAmount = ONE_GWEI;
        const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;
    
        const [owner, addr1] = await ethers.getSigners();

        const CohortBank = await ethers.getContractFactory("CohortBank");
        const cohortBank = await CohortBank.deploy(unlockTime, {value: lockedAmount});

        return {cohortBank, unlockTime, lockedAmount, owner, addr1};
    
    }
    // Deployment
    describe("Deployment", function(){
        it("Should check unlock time", async function(){
            const {cohortBank, unlockTime} = await loadFixture(runEveryTime);

            expect(await cohortBank.unlockTime()).to.eq(unlockTime)
        });

        it("Should set the right owner", async function(){
            const {cohortBank, owner} = await loadFixture(runEveryTime);

            expect(await cohortBank.owner()).to.eq(owner.address);
        });

        it("should correctly retrieve deployed ETH to CohortBank", async function(){
            const { cohortBank, lockedAmount} = await loadFixture(runEveryTime);

            expect(await ethers.provider.getBalance(cohortBank.address)).to.eq(lockedAmount)

        });

        it("should fail if unlock time is not in the future", async function(){
            const latestTime = await time.latest();

            const CohortBank = await ethers.getContractFactory("CohortBank");

            await expect(CohortBank.deploy(latestTime, {value: 1})).to.be.revertedWith("Unlock time should be in the future")
        });
    });

    // Deposit function
    describe("Deposit", async()=>{
        it("should deposit an amount that is greater than 0", async () =>{
            const {cohortBank, owner} = await loadFixture(runEveryTime);
            
            const ownerBalanceBeforeDeposit = await cohortBank.balances(owner.address);
            expect (ownerBalanceBeforeDeposit).to.eq(0);
            expect(cohortBank.connect(owner).deposit(0)).to.be.revertedWith("cannot deposit 0 amount")
         });
    });


    //  Deposit Event 
    describe("Deposit events", async ()=>{
        it("should emit event on deposit", async()=>{
    
                const{cohortBank, owner} = await loadFixture(runEveryTime)
                await cohortBank.connect(owner).deposit(8);

                const ownerBalanceAfterDeposit = await cohortBank.balances(owner.address);
                expect(ownerBalanceAfterDeposit).to.eq(8);

                const ownerDeposit = await cohortBank.connect(owner).deposit(8);
                await expect(ownerDeposit).to.emit(cohortBank, "Deposit").withArgs(8, anyValue, owner.address);
        });
    });

    // Withdrawal Function
    describe("Withdrawal", function(){
        describe("Validations", function(){
            it("should not be able to withdraw if called too soon", async function(){
                const {cohortBank} = await loadFixture(runEveryTime);

                await expect(cohortBank.withdraw()).to.be.revertedWith("You can't withdraw yet");
            });

            it("should revert the message with right owner", async function(){
                const {cohortBank, unlockTime, addr1} = await loadFixture(
                    runEveryTime
                );
                    
                 await time.increaseTo(unlockTime);
                 await expect(cohortBank.connect(addr1).withdraw()).to.be.revertedWith("You aren't the owner");
            });

            it("should not fail if unlock time has arrived and is called by the owner", async function(){
                const {cohortBank, unlockTime} = await loadFixture(runEveryTime);

                await time.increaseTo(unlockTime);
                await expect(cohortBank.withdraw()).not.to.be.reverted;
            });
        });
    });

    // Witdrawal Event
    describe("Withdrawal events", function(){
        it("should emit the event on withdrawals", async function (){
            const { cohortBank, unlockTime, lockedAmount} = await  loadFixture(
                runEveryTime
            );
            await time.increaseTo(unlockTime);
            await expect(cohortBank.withdraw()).to.emit(cohortBank, "Withdrawal").withArgs(lockedAmount,anyValue);
        });
       
    });

    // Transfer
    describe("Transfer", function () {
        it("Should transfer the funds to the owner", async () => {
          const { cohortBank, unlockTime, owner } = await loadFixture(runEveryTime);
    
          await cohortBank.deposit(3, {value: TEST_ETH});
    
          const ownerBalanceBeforeWithdrawal = await cohortBank.balances(owner.address);
          await time.increaseTo(unlockTime);


          //withdraw balance
          await cohortBank.withdraw();
          const ownerBalanceAfterWithdrawal = await cohortBank.balances(owner.address);
          expect(ownerBalanceAfterWithdrawal).to.be.lt(
            ownerBalanceBeforeWithdrawal
          );
        });
    });
  runEveryTime()
});
