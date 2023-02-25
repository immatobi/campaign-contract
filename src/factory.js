import web3 from './web3';
import CampaignFactory from './contracts/build/Factory.json';

const contract = new web3.eth.Contract(CampaignFactory.abi, '0x980a703A65CD04592949D48a54327c5e9F1feBcB');

export default contract;