pragma solidity ^0.5.0;

import "./RBAC.sol";
import "./File.sol";

contract FileFactory is RBAC {
    File[] public filesList;
    uint public fileIndex;
    address public owner;
    
    mapping (uint => address) addressFromIndex;
    mapping (address => address) createrAddress;
    mapping(address => string) nameFromAddress;
    mapping(string => address) addressFromName;
    
    string constant ROLE_OWNER = "owner";
    
    function createFileContract(string memory _hash, string memory _name) public {
        File newFile = new File(_hash, msg.sender, _name);
        filesList.push(newFile);
        fileIndex += 1;
        addressFromIndex[fileIndex] = address(newFile);
        createrAddress[address(newFile)] = msg.sender;
        nameFromAddress[address(newFile)] = _name;
        addressFromName[_name] = address(newFile);
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        checkRole(msg.sender, ROLE_OWNER);
        _;
    }
    
    function getDeployedFileContract() public view returns(File[] memory) {
        return filesList;
    }
    
    function getCreater(address _contractAddress) public view returns(address) {
        return createrAddress[_contractAddress];
    }

    function getFileName(address _contractAddress) public view returns(string memory) {
        return nameFromAddress[_contractAddress];
    }
    
    function destory() onlyOwner public {
        selfdestruct(msg.sender);
    }
    
}