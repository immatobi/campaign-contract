import React, { Component } from 'react';
import Layout from '../../src/components/Layout'
import Campaign from '../../src/campaign'
import { Card, Grid, Button } from 'semantic-ui-react'
import web3 from '../../src/web3'
import ContributeForm from '../../src/components/Contribute'
import { Link } from '../../routes'

class CampaignShow extends Component {

    static async getInitialProps(props){

        const contract = Campaign(props.query.address);
        const summary = await contract.methods.getSummary().call();
        
        return { 

            minContribution: summary[0], 
            balance: summary[1], 
            requests: summary[2],
            approvers: summary[3],
            manager: summary[4],
            campaignAddress: props.query.address

         }

    }

    renderCards = () => {

        const { balance, minContribution, requests, approvers, manager } = this.props;

        const items = [
            {
                header: manager,
                meta: 'Manager\'s address',
                description: 'Manager created the campaign and can make requests for money',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: minContribution,
                meta: 'Minimum contribution (wei)',
                description: 'You must contribute this much (wei) to be an approver',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: requests,
                meta: 'All requests',
                description: 'Requests made by manager to withdraw money. Requests must be approved by approvers.',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: approvers,
                meta: 'Number of approvers',
                description: 'Number of people who have already donated to this campaign',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance (ether)',
                description: 'This is how much money this campaign have left',
                style: { overflowWrap: 'break-word' }
            }
        ]

        return <Card.Group items={items} />

    }

    render(){

        return (
            <Layout>

                <h3>Campaign Details</h3>

                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>

                            { this.renderCards() }
                            
                        </Grid.Column>

                        <Grid.Column width={6}>
                            <ContributeForm address={this.props.campaignAddress} />
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.campaignAddress}/requests`}>
                                <a><Button primary>View Requests</Button></a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>

                </Grid>

            </Layout>
        )

    }

}

export default CampaignShow;