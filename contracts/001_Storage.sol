// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

// A simple contract that demonstrates various Solidity data types and modifiers
contract Storage {
    // The address of the contract deployer, set during contract creation
    address public immutable owner;
    // Initialize some state variables of different types
    uint public number = 10; // unsigned integer initialized to 10
    bool private isNumber = true; // private boolean set to true
    address internal myAddress = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4; // internal address set to a default value
    string myName = "OT"; // string set to a default value
    int32 constant intNumber = -78; // constant integer set to -78

    // Constructor function that sets the contract deployer's address as the owner
    constructor(address _owner) {
        owner = _owner;
    }
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can set the number");
        _;
    }
    
    // Change the value of the number variable
    function changeNumber(uint _number) public onlyOwner {
        number = _number;
    }

    // Return the value of the myAddress variable
    function viewAddress() external view returns (address) {
        return myAddress;
    }
}
