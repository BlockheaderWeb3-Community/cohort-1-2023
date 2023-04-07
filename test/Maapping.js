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

    // Test adding a student an existing ID
    it("should not allow adding a student with an existing ID", async function () {
        // Add a new student
        const id = 1;
        const name = "Isaac";
        await mappingContract.addStudent(id, name);

        // Try to add another with the same ID
        const name2 = "Bob";
        await expect(mappingContract.addStudent(id, name2)).to.be.revertedWith("Student ID already exist");
    });

    // Test retrieving a student that does not exist
    it("should not allow retrieving a student thta does not exist", async function () {
        // REtrieve a student that hasn't been added
        const id = 1;
        const studentName = await mappingContract.viewSutudent(id);

        await expect(studentName).to.brrrrrre.revertedWith("studdent ID does not exist");
    });
})