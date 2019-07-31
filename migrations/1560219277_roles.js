const RolesContract = artifacts.require('Roles.sol');

module.exports = function(deployer) {
  deployer.deploy(RolesContract);
};