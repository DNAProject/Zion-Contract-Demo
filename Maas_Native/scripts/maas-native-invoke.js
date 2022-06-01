const hre = require("hardhat");
const { RLP } = require("ethers/lib/utils");

async function main() {
  // call maas config
  await callMaasConfig();

  // call node manager
  await callNodeManager();
}

async function callMaasConfig() {
  const signers = await hre.ethers.getSigners();

  // maas config addreess
  const address = '0xD62B67170A6bb645f1c59601FbC6766940ee12e5';
  const blockedAccount = "0x5bCA6B1c89e1f4f77b6ad1A0b9b8362c4b316556";
  const owner = signers[0].address;

  // We get the native contract
  var contract = await hre.ethers.getContractAt("IMaasConfig", address, signers[0]);

  // get contract name and blacklist
  console.log('contract name: ', (await contract.name()).toString());
  console.log('blacklist: ', (await contract.getBlacklist()).toString());

  // owner default is empty address, any account can call the changeOwner method to initialize owner
  // otherwise, need owner as signer
  console.log('owner: ', (await contract.getOwner()).toString());
  var tx = await contract.changeOwner(owner);
  console.log(tx.hash);
  var receipt = await tx.wait();
  console.log(receipt.status);
  console.log('initial owner: ', (await contract.getOwner()).toString());

  // block account, need owner as signer
  tx = await contract.blockAccount(blockedAccount, true);
  console.log(tx.hash);
  receipt = await tx.wait();
  console.log(receipt.status);
  console.log('isBlocked: ', (await contract.isBlocked(blockedAccount)));
  console.log('blacklist: ', (await contract.getBlacklist()));

  // unblock account, need owner as signer
  tx = await contract.blockAccount(blockedAccount, false);
  console.log(tx.hash);
  receipt = await tx.wait();
  console.log(receipt.status);
  console.log('isBlocked: ', (await contract.isBlocked(blockedAccount)));
  console.log('blacklist: ', (await contract.getBlacklist()));

  // enable gas manage
  tx = await contract.enableGasManage(true);
  console.log(tx.hash);
  receipt = await tx.wait();
  console.log(receipt.status);
  console.log('isGasManageEnabled: ', (await contract.isGasManageEnabled()));

  // set gas manage
  tx = await contract.setGasManager(signers[0].address, false);
  console.log(tx.hash);
  receipt = await tx.wait();
  console.log(receipt.status);
  console.log('isGasManager: ', (await contract.isGasManager(signers[0].address)));
  console.log('getGasManagerList: ', (await contract.getGasManagerList()));

  // shoud fail
  try {
    tx = await signers[0].sendTransaction({
      to: signers[1].address,
      value: ethers.utils.parseEther("1") // 1 ether
    })
    receipt = await tx.wait();
    console.log(receipt.status);
  } catch (error) {
    console.log("Transfering eth needs gas manager.")
  }

  tx = await contract.setGasManager(signers[0].address, true);
  console.log(tx.hash);
  receipt = await tx.wait();
  console.log(receipt.status);
  console.log('isGasManager: ', (await contract.isGasManager(signers[0].address)));
  console.log('getGasManagerList: ', (await contract.getGasManagerList()));

  tx = await signers[0].sendTransaction({
    to: signers[1].address,
    value: ethers.utils.parseEther("1") // 1 ether
  })
  receipt = await tx.wait();
  console.log(receipt.status);
}

// Convert a hex string to a byte array
function hexToBytes(hex) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

// Convert a byte array to a hex string
function bytesToHex(bytes) {
  for (var hex = [], i = 0; i < bytes.length; i++) {
    var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
    hex.push((current >>> 4).toString(16));
    hex.push((current & 0xF).toString(16));
  }
  return "0x" + hex.join("");
}

async function callNodeManager() {
  // node manager contract address
  const address = '0xA4Bf827047a08510722B2d62e668a72FCCFa232C';
  const signers = await hre.ethers.getSigners();

  // We get the native contract
  var contract = await hre.ethers.getContractAt("INodeManager", address, signers[0]);

  // call name
  console.log('contract name: ', (await contract.name()).toString());

  // get first epoch info
  const epochID = 1;
  const epoch = await contract.epoch();
  console.log('epoch: ', (await contract.epoch()).toString());
  const decode = RLP.decode(epoch)
  console.log('epoch decode: ', JSON.stringify(decode));
  console.log('getEpochByID: ', (await contract.getEpochByID(epochID)).toString());
  // get epoch hash
  console.log('proof: ', (await contract.proof(epochID)).toString());

  console.log('getEpochListJson: ', (await contract.getEpochListJson(epochID)).toString());
  console.log('getCurrentEpochJson: ', (await contract.getCurrentEpochJson()).toString());
  // console.log('getChangingEpochJson: ', (await contract.getChangingEpochJson()).toString());

  // propose
  // new consensus public key and address list
  const peersObj = [
    [
      [
        // public key string to utf8 hex string
        bytesToHex(new TextEncoder().encode("0x0361c6591a660424c1a0ed727dcc4190b45c593146a768503ef96d80a489522371")),
        '0x2d3913c12aca0e4a2278f829fb78a682123c0125'
      ],
      [
        '0x3078303262356338366638383139636635313932363437393432653237396435333665316663353363333033316433636439646565636636383266366364666239646233',
        '0x45d53a40ea246bb8ecb1417a7f3ce8bf5dccc6e3'
      ],
      [
        '0x3078303337656439316436643030643132626633653765366231666337636461663262383432363365313430333036643036313131623636663662663237653633363036',
        '0x96775aa16b505734c8aca2cac69c5673c514343a'
      ],
      [
        '0x3078303263303766623764343865616335353961323438336532343964323738343163313863376365356462626266323739366136393633636339636566323763616264',
        '0x258af48e28e4a6846e931ddff8e1cdf8579821e5'
      ]
    ]
  ];
  const peersStr = RLP.encode(peersObj);
  console.log(peersStr);
  const height = 100000
  var tx = await contract.propose(height, peersStr);
  console.log(tx.hash);
  var receipt = await tx.wait();
  console.log(receipt.status);

  // vote, need more than 2/3 consensus accounts
  const newEpochID = epochID + 1;
  const epochListJson = (await contract.getEpochListJson(newEpochID)).toString();
  console.log('getEpochListJson: ', epochListJson);
  const epochList = JSON.parse(epochListJson);
  const epochHash = epochList[0].Hash; // get the epochHash from epochListJson
  tx = await contract.vote(newEpochID, epochHash);
  console.log(tx.hash);
  receipt = await tx.wait();
  console.log(receipt.status);

  // other consensus accounts vote
  contract = await hre.ethers.getContractAt("INodeManager", address, (await hre.ethers.getSigners())[1]);
  tx = await contract.vote(newEpochID, epochHash);
  console.log(tx.hash);
  receipt = await tx.wait();
  console.log(receipt.status);
  contract = await hre.ethers.getContractAt("INodeManager", address, (await hre.ethers.getSigners())[2]);
  tx = await contract.vote(newEpochID, epochHash);
  console.log(tx.hash);
  receipt = await tx.wait();
  console.log(receipt.status);

  // when the vote passed and height not reached we can get changing epoch
  console.log('getChangingEpochJson: ', (await contract.getChangingEpochJson()).toString());

  // after the height reached we can find the current epoch changed
  console.log('current epoch: ', (await contract.epoch()).toString());
  console.log('getCurrentEpochJson: ', (await contract.getCurrentEpochJson()).toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
