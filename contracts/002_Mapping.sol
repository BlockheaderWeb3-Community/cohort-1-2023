// SPDX-License-Identifier: MIT
// Indicates the license under which the contract is released.
pragma solidity ^0.8.17;

// Declare the contract
contract Mapping{

    // Declare a mapping that associates uint keys with string values.
    mapping(uint => string) students;

    // Add a new student to the mapping
    function addStudent(uint _id, string memory _name) public{
        students[_id] = _name;
    }

    // Retrieve the name of a student based on their ID
    function viewStudent(uint _id) public view returns(string memory){
        string memory studentName  = students[_id];
        return studentName;

    }
}
