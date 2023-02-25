import React, { Component } from 'react';
import Layout from '../../../src/components/Layout'
import Campaign from '../../../src/campaign'
import { Card, Grid, Button, Table, Message } from 'semantic-ui-react'
import { Link } from '../../../routes'
import web3 from '../../../src/web3'
import Request from '../../../src/components/Request'

class Requests extends Component {

    state = {
        message: '',
        type: ''
    }

    static async getInitialProps(props){

        const contract = Campaign(props.query.address);
        const requestCount = await contract.methods.getRequestsCount().call();
        const approversCount = await contract.methods.approversCount().call();

        const requests = await Promise.all(
            Array(parseInt(requestCount)).fill().map((e, i) => {

                return contract.methods.requests(i).call()

            })
        )
        
        return { 
            address: props.query.address,
            requests: requests,
            requestCount: requestCount,
            approversCount: approversCount
         }

    }

    setMessage = (e, data) => {

        if(e) { e.preventDefault() }

        if(data){
            this.setState({ message: data.message, type: data.type });
            setTimeout(() => {
                this.setState({ message: '', type: '' });
            }, 3500)
        }

    }

    render(){

        const { requests, approversCount  } = this.props;
        const { Header, Row, HeaderCell, Body } = Table;

        return (
            <Layout>

                <div style={{ display: 'flex', alignItems: 'center', marginTop: '3rem' }}>

                    <h3>Campaign Requests</h3>
                    <Link route={`/campaigns/${this.props.address}/requests/new`}>
                        <a style={{ marginLeft: 'auto' }}>
                            <Button primary>New Request</Button>
                        </a>
                    </Link>

                </div>

                {
                    this.state.type !== '' && this.state.message !== '' &&
                    <Message 
                    error={this.state.type === 'error' ? true: false}
                    success={this.state.type === 'success' ? true: false} 
                    header={this.state.type === 'error' ? 'Oops!' : 'Success'} 
                    content={this.state.message} />
                }

                <Table celled>

                    <Header>
                        <Row>
                            <HeaderCell>Id</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approvers</HeaderCell>
                            <HeaderCell>Approvals</HeaderCell>
                            <HeaderCell>Action</HeaderCell>
                        </Row>
                    </Header>

                    <Body>

                        {
                            requests.length > 0 &&
                            requests.map((r, i) => 
                                <Request 
                                address={this.props.address} 
                                approvers={approversCount} 
                                request={r} 
                                id={i} 
                                message={this.setMessage}
                                />
                            )
                        }

                    </Body>

                </Table>

                <h5>Found { requests.length } request(s)</h5>

            </Layout>
        )

    }

}

export default Requests;