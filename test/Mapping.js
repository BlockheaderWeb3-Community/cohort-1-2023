const { expect } = require("chai");
const { ethers } = require("hardhat")

describe("Test Suite for Mapping Contract",  async() => {
  let deployedMap;
  beforeEach(async () => {
    const MappingStorage = await ethers.getContractFactory("Mappings")
    deployedMap = await MappingStorage.deploy()
})

it("Should add a student", async function () {
  const id = 1;
  const name1 = "Mubarak";
  const name2 = "Aminu"
  await deployedMap.addStudent(id, name1);
  const studentName = await deployedMap.viewStudent(id);

  expect(studentName).to.equal(name1);
  expect(studentName).to.not.eq(name2)
});

it("Should retrieve a student", async function () {
  const id = 1;
  const name1 = "Mubarak";
  const name2 = "Aminu"
  await deployedMap.addStudent(id, name1);
  const studentName = await deployedMap.viewStudent(id);
  expect(studentName).to.equal(name1);
  expect(studentName).to.not.eq(name2)
});

})