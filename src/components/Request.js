import React, { useState } from 'react';
import { Link, Router } from '../../routes'
import { Table, Button, Label } from 'semantic-ui-react'
import Campaign from '../campaign'
import web3 from '../web3'


const Request = ({ request, id, address, approvers, message }) => {

    const { Row, Cell } = Table;

    const [loading, setLoading] = useState(false)
    const [finalizeLoading, setFinLoading] = useState(false)

    const approve = async (e) => {

        if(e) { e.preventDefault() }

        setLoading(true);

        try {

            const contract = Campaign(address);
            const accounts = await web3.eth.getAccounts();

            await contract.methods.approveRequest(parseInt(id)).send({
                from: accounts[0]
            });

            message(e, { message: 'Request approved successfully', type: 'success' });
            setLoading(false);

            Router.pushRoute(`/campaigns/${address}/requests`); // redirect to requests
            
        } catch (err) {

            message(e, { message: err.message, type: 'error' });
            setLoading(false)
            
        }




    }

    const finalize = async (e) => {

        if(e) { e.preventDefault() }

        setFinLoading(true);

        try {

            const contract = Campaign(address);
            const accounts = await web3.eth.getAccounts();

            await contract.methods.completeRequest(parseInt(id)).send({
                from: accounts[0]
            });

            message(e, { message: 'Request finalized successfully', type: 'success' });
            setFinLoading(false);

            Router.pushRoute(`/campaigns/${address}/requests`); // redirect to requests
            
        } catch (err) {

            message(e, { message: err.message, type: 'error' });
            setFinLoading(false)
            
        }




    }

    return (
        <>

            <Row>
                <Cell>{ id + 1 }</Cell>
                <Cell>{ request.description }</Cell>
                <Cell>{ web3.utils.fromWei(request.value, 'ether') }</Cell>
                <Cell>{ request.recipient }</Cell>
                <Cell>{ approvers }</Cell>
                <Cell>{ request.approvalCount }</Cell>
                <Cell>
                    {
                        request.complete &&
                        <>
                            <Label color='green' horizontal>
                                Completed
                            </Label>
                        </>
                    }
                    {
                        !request.complete &&
                        <>
                            <Button onClick={(e) => approve(e)} loading={loading} color="green" basic>Approve</Button>
                            <Button onClick={(e) => finalize(e)} loading={finalizeLoading} color='blue' basic>Finalize</Button>
                        </>
                    }
                </Cell>
            </Row>
        
        </>
    )

}

export default Request