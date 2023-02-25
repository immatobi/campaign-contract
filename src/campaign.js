import web3 from './web3';
import Campaign from './contracts/build/Campaign.json';

const getContract = (address) => {

    const contract = new web3.eth.Contract(Campaign.abi, address);
    return contract;

}


export default getContract;