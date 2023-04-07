const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Mapping Test suite", function () {
  let mapping;
  beforeEach(async () => {
    const Mapping = await ethers.getContractFactory("Mapping");
    mapping = await Mapping.deploy();
    await mapping.deployed();
  });

  it("Should add and retrieve a student", async function () {
    const id = 1;
    const name = "Isaac";
    await mapping.addStudent(id, name);
    const studentName = await mapping.viewStudent(id);
    expect(studentName).to.equal(name);
  });

  it("Should add multiple students and retrieve them", async function () {
    const students = [
      { id: 1, name: "Isaac" },
      { id: 2, name: "Pelz" },
      { id: 3, name: "Esther-ego" },
    ];

    for (const student of students) {
      await mapping.addStudent(student.id, student.name);
    }

    for (const student of students) {
      const studentName = await mapping.viewStudent(student.id);
      expect(studentName).to.equal(student.name);
    }
  });
});