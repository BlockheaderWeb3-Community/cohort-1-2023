const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Storage Test Suite", async () => {
    const { parseEther, formatEther } = await ethers.utils;
    let owner, addr1, addr2, storageContract
    beforeEach(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();
        const StorageContract = await ethers.getContractFactory("Storage")
        storageContract = await StorageContract.deploy(owner.address)
        console.log("storage contract address__", storageContract.address)
    })

    describe("Deployment", async () => {
        it("should set the right owner", async function () {
            console.log("owner ___", owner.address)
            expect(await storageContract.owner()).to.equal(owner.address);
            expect(await storageContract.owner()).to.not.equal(addr1.address)
            expect(await storageContract.owner()).to.not.equal(addr2.address)
        });
    })

    describe("Transactions", async () => {
        it("should change number", async function () {
            const num1 = 100
            const num2 = 150
            await storageContract.changeNumber(num1)

            const number = await storageContract.number()
            expect(number).to.eq(num1)
            expect(number).to.not.eq(0)
            expect(number).to.not.eq(5)
            expect(number).to.not.eq(num2)

            await new Promise(resolve => {
                setTimeout(resolve, 2000); // 2s delay
            })
            await storageContract.changeNumber(num2)
            const number2 = await storageContract.number()

            expect(number2).to.eq(num2)
            expect(number2).to.not.eq(num1)
        });

        it("should return myAddress in Storage contract", async function () {
            const storedMyAddress = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
            expect(await storageContract.viewAddress()).to.eq(storedMyAddress)
            expect(await storageContract.viewAddress()).to.not.eq(addr2.address)
        });
    })


});
