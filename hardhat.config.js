/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
module.exports = {
  solidity: "0.7.3",
  // defaultNetwork: 'rinkeby',
  // networks: {
  //   rinkeby: {
  //     url: process.env.INFURA_URL,
  //     accounts: [`${process.env.PRIVATE_KEY}`],
  //   }
  // }
};
