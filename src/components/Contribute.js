import React, { useEffect, useState } from 'react'
import { Form, Button, Input, Message } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import { Router } from '../../routes'

import web3 from '../../src/web3'
import Campaign from '../campaign'

const Contribute = ({ address }) => {

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [amount, setAmount] = useState('');

    useEffect(() => {

    }, [])

    const contribute = async (e) => {

        if(e) { e.preventDefault() }

        if(!amount){

            setErrorMessage('Enter amount');
            setLoading(false)
            return;

        }else{

            const contract = await Campaign(address);
            setLoading(true);
            setErrorMessage('');

            try {

                const accounts = await web3.eth.getAccounts();
                await contract.methods.contribute().send({
                    from: accounts[0],
                    value: web3.utils.toWei(amount, 'ether')
                });

                setLoading(false);
                Router.replaceRoute(`/campaigns/${address}`); // redirect to home
                setAmount('')
                
            } catch (err) {

                setErrorMessage(err.message);
                setLoading(false)
                
            }

        }

    }

    return (
        <>

            <h3>Contribute</h3>

            <Form onSubmit={(e) => { e.preventDefault() }} error={!!errorMessage}>

                <Form.Field>
                    <label>Amount</label>
                    <Input 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number" label="ether" labelPosition='right' />
                </Form.Field>

                <Message error header="Oops!" content={errorMessage} />

                <Button onClick={(e) => contribute(e)} loading={loading} content="Contribute" primary />

            </Form>
        
        </>
    )

}

export default Contribute