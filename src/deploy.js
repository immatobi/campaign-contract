const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');

const compiledFactory = require('../src/contracts/build/Factory.json');

// use Infura
// make sure to increase rate limiting
// Issue Fix: https://github.com/ChainSafe/web3.js/issues/3145

const provider = new HDWalletProvider(
    'sleep jeans eyebrow cover equal cradle tooth dream hour true travel soldier',
    `https://goerli.infura.io/v3/dfde463782fb4397ad5538a5aecad17e`
);

const web3 = new Web3(provider);

let contract;
const deploy = async () => {

    const accounts = await web3.eth.getAccounts();
    console.log('attempting to deploy from account ' + accounts[0]);

    contract = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: '1000000' });

    console.log(JSON.stringify(compiledFactory.abi)) // this is very important (JSON stringify)
    console.log('contract deployed to: ' + contract.options.address);
    provider.engine.stop();

    // Deployed to address: 0x980a703A65CD04592949D48a54327c5e9F1feBcB
    
    // ABI Code
    // [
    //     {
    //        "anonymous":false,
    //        "inputs":[
    //           {
    //              "indexed":true,
    //              "internalType":"uint256",
    //              "name":"date",
    //              "type":"uint256"
    //           },
    //           {
    //              "indexed":false,
    //              "internalType":"address",
    //              "name":"campaign",
    //              "type":"address"
    //           }
    //        ],
    //        "name":"campaignInfo",
    //        "type":"event",
    //        "signature":"0xbc2510bd36a6658be7210d767a949e618e367a8023527321151113ce209c5e4a"
    //     },
    //     {
    //        "inputs":[
    //           {
    //              "internalType":"uint256",
    //              "name":"",
    //              "type":"uint256"
    //           }
    //        ],
    //        "name":"campaigns",
    //        "outputs":[
    //           {
    //              "internalType":"address",
    //              "name":"",
    //              "type":"address"
    //           }
    //        ],
    //        "stateMutability":"view",
    //        "type":"function",
    //        "constant":true,
    //        "signature":"0x141961bc"
    //     },
    //     {
    //        "inputs":[
    //           {
    //              "internalType":"uint256",
    //              "name":"minimum",
    //              "type":"uint256"
    //           }
    //        ],
    //        "name":"createCampaign",
    //        "outputs":[
              
    //        ],
    //        "stateMutability":"nonpayable",
    //        "type":"function",
    //        "signature":"0xa3303a75"
    //     },
    //     {
    //        "inputs":[
    //           {
    //              "internalType":"address",
    //              "name":"camp",
    //              "type":"address"
    //           }
    //        ],
    //        "name":"emitCampaign",
    //        "outputs":[
              
    //        ],
    //        "stateMutability":"nonpayable",
    //        "type":"function",
    //        "signature":"0x805ba43e"
    //     },
    //     {
    //        "inputs":[
              
    //        ],
    //        "name":"getCampaigns",
    //        "outputs":[
    //           {
    //              "internalType":"address[]",
    //              "name":"",
    //              "type":"address[]"
    //           }
    //        ],
    //        "stateMutability":"view",
    //        "type":"function",
    //        "constant":true,
    //        "signature":"0xa6b03633"
    //     }
    //  ]

}

deploy();