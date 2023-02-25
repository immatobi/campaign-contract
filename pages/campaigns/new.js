import React, { useEffect, useState } from 'react'
import { Form, Button, Input, Message } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import { Router } from '../../routes'

import Layout from '../../src/components/Layout'
import factory from '../../src/factory';
import web3 from '../../src/web3'

const NewCampaign = () => {

    const [minContribution, setContribution] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {

    }, [])

    const createCampaign = async (e) => {

        if(e) { e.preventDefault() }

        if(!minContribution){
            return;
        }else{

            setLoading(true)
            setErrorMessage('')

            try {

                const accounts = await web3.eth.getAccounts();
                await factory.methods.createCampaign(minContribution).send({
                    from: accounts[0]
                });

                setLoading(false);

                Router.pushRoute('/'); // redirect to home
                
            } catch (err) {

                setErrorMessage(err.message);
                setLoading(false)
                
            }

            

        }

    }

    return (
        <>
            <Layout>

                <h3 style={{ marginBottom: '1.5rem' }}>Create a campaign</h3>

                <Form onSubmit={(e) => { e.preventDefault() }} error={!!errorMessage}>

                    <Form.Field>
                        <label>Minimum contribution</label>
                        <Input 
                        value={minContribution}
                        onChange={(e) => setContribution(e.target.value)} 
                        type="number" label="wei" labelPosition='right' />
                    </Form.Field>

                    <Message error header="Oops!" content={errorMessage} />

                    <Button loading={loading} onClick={(e) => createCampaign(e)} content="Create" primary />

                </Form>
            </Layout>
        
        </>
    )

}

export default NewCampaign;