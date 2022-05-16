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
      url: "http://127.0.0.1:8545/",
      chainId: 1088,
      accounts: [""]  //fill in your account address
    }
  }
};
