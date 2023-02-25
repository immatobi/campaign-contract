import React, { Component } from 'react';
import Layout from '../../../src/components/Layout'
import Campaign from '../../../src/campaign'
import { Card, Grid, Button, Form, Input, Message } from 'semantic-ui-react'
import { Link, Router } from '../../../routes'
import web3 from '../../../src/web3'

class NewRequest extends Component {

    static async getInitialProps(props){
        
        return { 
            address: props.query.address
         }

    }

    constructor(props){
        super(props);

        this.state = {
            errorMessage: '',
            description: '',
            value: '',
            recipient: '',
            loading: false
        }
    }

    createRequest = async (e) => {

        if(e) { e.preventDefault() }

        const contract = Campaign(this.props.address);
        const { description, value, recipient } = this.state;

        try {

            this.setState({ loading: true, errorMessage: '' })

            const accounts = await web3.eth.getAccounts();
            await contract.methods.createRequest(description, web3.utils.toWei(value, 'ether'), recipient).send({
                from: accounts[0]
            });

            this.setState({ loading: false });
            Router.pushRoute(`/campaigns/${this.props.address}/requests`); // redirect to requests

            
        } catch (err) {

            this.setState({ loading: false, errorMessage: err.message })
            
        }

    }

    render(){

        return (
            <Layout>

                <Link route={`/campaigns/${this.props.address}/requests`}><a>Back</a></Link>

                <h3>New Request</h3>

                <Form onSubmit={(e) => { e.preventDefault() }} error={!!this.state.errorMessage}>
                
                    <Form.Field>
                        <label>Description</label>
                        <Input 
                        value={this.state.description}
                        onChange={(e) => this.setState({ description: e.target.value })} 
                        type="text" />
                    </Form.Field>

                    <Form.Field>
                        <label>Value in ether</label>
                        <Input 
                        value={this.state.value}
                        onChange={(e) => this.setState({ value: e.target.value })} 
                        type="number" label="ether" labelPosition='right' />
                    </Form.Field>

                    <Form.Field>
                        <label>Recipient address</label>
                        <Input 
                        value={this.state.recipient}
                        onChange={(e) => this.setState({ recipient: e.target.value })} 
                        type="text" />
                    </Form.Field>

                    <Message error header="Oops!" content={this.state.errorMessage} />

                    <Button loading={this.state.loading} onClick={(e) => this.createRequest(e)} content="Create" primary />
                
                </Form>

            </Layout>
        )

    }

}

export default NewRequest;