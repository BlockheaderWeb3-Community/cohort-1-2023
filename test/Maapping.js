const {
    time,
    loadFixture,
}= require("@nomicfoundation/hardhat-helpers");
const { anyvalue } =require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Mapping Test Suite", async () => {
    let owner, addr1, addr2, mappingContract
    beforeEach(async () => {
        [owner, addr1, addr2, mappingContract] = await ethers.getSigners();
        const MappingContract = await ethers.getContractFactory("Mapping")
        mappingContract = await MappingContract.deploy(owner.address)
    })

    // Test case for deployment
    describe("Deployment", async () => {
        it("should set the right owner", async function () {
            expect(await mappingContract.owner()).to.equal(owner.address);
        })
    })
})