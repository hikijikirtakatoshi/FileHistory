pragma solidity ^0.5.0;

import "./RBAC.sol";

contract File is RBAC {
    
    struct History {
        string hash;
        string name;
        address updater;
        uint updateTime;
        uint id;
    }
    
    History[] histories;
    uint public historyIndex;
    address owner;
    
    mapping (string => uint) indexFromHash;
    
    string public constant ROLE_OWNER = "owner";
    string public constant ROLE_ADMIN = "admin";
    
    modifier onlyOwner() {
        checkRole(msg.sender, ROLE_OWNER);
        _;
    }
    
    modifier onlyAdmin() {
        checkRole(msg.sender, ROLE_ADMIN);
        _;
    }
  
    constructor(string memory _hash, address _creater, string memory _name) public {
        History memory history;
        history.hash = _hash;
        history.name = _name;
        history.updater = _creater;
        history.updateTime = now;
        history.id = historyIndex;
        histories.push(history);
        addRole(msg.sender, ROLE_OWNER);
        addRole(_creater, ROLE_OWNER);
        addRole(msg.sender, ROLE_ADMIN);
        addRole(_creater, ROLE_ADMIN);
    }
    
    function addAdmin(address _addr) onlyOwner public {
        addRole(_addr, ROLE_ADMIN);
    }

    function removeAdmin(address _addr) onlyOwner public {
        removeRole(_addr, ROLE_ADMIN);
    }
    
    function updateFile(string memory _hash) public onlyAdmin {
        historyIndex += 1;
        History memory history;
        history.hash = _hash;
        history.updater = msg.sender;
        history.updateTime = now;
        history.id = historyIndex;
        histories.push(history);
    }
    
    function getFileFromId(uint _id) public view returns(string memory, address, uint) {
        History memory history = histories[_id];
        return (history.hash, history.updater, history.updateTime);
    }
    
    function getLastestFile() public view returns(string memory, address, uint) {
        History memory history = histories[historyIndex];
        return (history.hash, history.updater, history.updateTime);
    }

    function checkFile(string memory _hash) public view returns(bool) {
        return keccak256(abi.encodePacked(histories[historyIndex].hash)) == keccak256(abi.encodePacked(_hash));
    }

    function getFileIndex() public view returns(uint) {
        return historyIndex;
    }
    
    function destory() onlyOwner public {
        selfdestruct(msg.sender);
    }

}