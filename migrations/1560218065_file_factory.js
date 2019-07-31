const FileFactoryContract = artifacts.require('FileFactory.sol');

module.exports = function(deployer) {
  deployer.deploy(FileFactoryContract);
};