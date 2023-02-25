const path = require('path');
const fs = require('fs-extra');
const solc = require('solc')

const buildPath = path.resolve(__dirname, 'contracts', 'build');
const contractPath = path.resolve(__dirname, 'contracts', 'Campaign.sol'); 
const source = fs.readFileSync(contractPath, 'utf8');

fs.removeSync(buildPath); // delete the build folder if it exist

const input = {
    language:'Solidity',
    sources: {
        'Campaign.sol': {
            content: source
        }
    },
    settings: {
        optimizer:
        {
            enabled: true
        },
        outputSelection: {
            '*' : {
                '*': ['*']
            }
        }
    }
}

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts['Campaign.sol']; // get the compiled aoutput
fs.ensureDirSync(buildPath); // create the build folder

for(let contract in output){

    fs.outputJSONSync(
        path.resolve(buildPath, `${contract}.json`),
        output[contract]
    )

}


// const contract = JSON.parse(solc.compile(JSON.stringify(input))).contracts['Campaign.sol'].Lottery;

// const { abi, evm } = contract;
// const { bytecode, deployedBytecode, gasEstimates } = evm;

// module.exports = { abi, bytecode, deployedBytecode, gasEstimates };