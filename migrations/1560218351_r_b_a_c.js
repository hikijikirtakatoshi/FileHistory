const RBACContract = artifacts.require('RBAC.sol');

module.exports = function(deployer) {
  deployer.deploy(RBACContract);
};