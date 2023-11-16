var Supply = artifacts.require("./Supply.sol");

module.exports = function(deployer) {
  deployer.deploy(Supply);
};