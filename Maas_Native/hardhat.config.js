require("@nomiclabs/hardhat-waffle");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.4",
  networks: {
    local: {
      url: "http://192.168.11.169:8545", //"http://127.0.0.1:8545/",
      chainId: 1089,
      accounts: ["26cc96a0d256d45e1515bf325bec1925746d796b3637b147f35a01d6c2d6399b", "b02aa6c9ba9aa5ddb972afa4c589c2e3d97154e105e444037e3b08c8a3211e0a",
      "cc44d77432e2810015eb5b67598f73dcb06708d9c6a4b9965fec007912fba3c5","1b0cab6d4ec74ffd0f09b66ac337e8e9b2bd91df2866c65b6372f8400fcd03af"]  //fill in your account
    }
  }
};
