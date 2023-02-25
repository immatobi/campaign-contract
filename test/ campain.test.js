const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const comipledCampaign = require('../src/contracts/build/Campaign.json');
const compiledFactory = require('../src/contracts/build/Factory.json');

let accounts, campaign, campaignAddress, factory;
beforeEach( async () => {

    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // Use one of the accounts to deploy the contract
    // calling deploy() only creates the object to be deployed
    // send() does the real work
    factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: '1000000' });

    // create a campaign from the get go
    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    // get the currently deployed campaign (first element only)
    [campaignAddress] = await factory.methods.getCampaigns().call();

    // get an existing contract using the ABI and the address
    campaign = await new web3.eth.Contract(comipledCampaign.abi, campaignAddress); 

})

// test
describe('Campaigns', () => {

    // test if a contract is deployed
    it('deploys a factory and a campaign', async () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    // check if the manager is marked
    it('marks caller as campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    })

    // check if we can contribute and be an approver
    it('contributes money and marks approvers', async () => {

        await campaign.methods.contribute().send({
            from: accounts[1],
            value: '200'
        });

        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);

    })

    // Requires a minimum contribution
    it('requires a minimum contribution', async () => {

        try {

            await campaign.methods.contribute().send({
                from: accounts[1],
                value: '30'
            });
            
        } catch (err) {

            assert(err)
            
        }

    })

    // see if we can make a payment request
    it('allows manager make a payment request', async () => {

        await campaign.methods.createRequest('Buy batteries', '150', accounts[1]).send({
            from: accounts[0],
            gas: '1000000'
        })

        const request = await campaign.methods.requests(0).call();
        assert.equal('Buy batteries', request.description);
        assert.equal(accounts[1], request.recipient);
        
    })

    // end-to end
    it('processes requests', async () => {

        // contribute
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        // create request
        await campaign.methods.createRequest('Buy batteries',  web3.utils.toWei('5', 'ether'), accounts[1]).send({
            from: accounts[0],
            gas: '1000000'
        });

        // approve request
        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        // finalize the request
        await campaign.methods.completeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        // check recipient account
        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        
        assert(balance > 103);
        
    })

})