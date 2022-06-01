# Maas Native contract call

This project demonstrates a native call to maas config and node manager.

First, install the dependancy for hardhat:

```shell

npm install --save-dev hardhat
npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers

```

Then, try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat run .\scripts\maas-native-invoke.js --network local
npx hardhat help
```
