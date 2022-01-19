const ConvertLib = artifacts.require("ConvertLib");
const MetaCoin = artifacts.require("MetaCoin");
const marketPlaceBoilerPlate = artifacts.require("marketPlaceBoilerPlate");
const NFTMeme = artifacts.require("NFTMeme");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
  deployer.deploy(marketPlaceBoilerPlate);
  deployer.deploy(NFTMeme);
};
