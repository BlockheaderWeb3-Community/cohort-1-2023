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
    });

    
  // Before each test, deploy a new Mappings contract and get the owner
    describe("Deployment", async () => {
        it("should set the right owner", async function () {
            expect(await mappingContract.owner()).to.equal(owner.address);
        })
    })

    // Test adding and retrirving 
    it("should add and retrieve retrieve multiple students", async function () {
        // Add a new student
        const id = 1;
        const name = "Isaac";
        await mappingContract.addStudent(id, name);

        // Retrieve the student's name
        const studentName = await mappingContract.viewSutudent(id);

        // Check that name is correct
        expect(studentName).to.equal(name);
    });

    // Test add
})