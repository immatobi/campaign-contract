import React, { useEffect, useState } from 'react';
import factory from '../src/factory';
import { Card, Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import Layout from '../src/components/Layout'
import { Link } from '../routes'

const Camp = () => {

    const [loading, setLoading] = useState(false);
    const [campaigns, setCampaigns] = useState([])

    useEffect(async() => {

        await getDeployedCampaigns();

    }, [])

    const getDeployedCampaigns = async () => {

       setLoading(true)
       const campList = await factory.methods.getCampaigns().call();
       await setCampaigns(campList);
       setLoading(false)

    }

    const renderCampaigns = () => {
        const items = campaigns.map((address) => {

            return {
                header: address,
                description: (<Link route={`/campaigns/${address}`}><a>View Campaign</a></Link>),
                fluid: true
            }

        })

        return <Card.Group items={items} />
    }

    return (
        <>

            <Layout>
            
                <div>
                    {
                        loading &&
                        <div>Getting campaigns...</div>
                    }
                    {
                        !loading &&
                        <>

                            {
                                campaigns.length <= 0 &&
                                <>
                                    <div>There are no open campaigns</div>
                                    <Link route="/campaigns/new">
                                        <a><Button floated='right' content="Create Campaign" icon="add circle" primary /></a>
                                    </Link>
                                </>
                                
                            }
                        
                            {
                                campaigns.length > 0 &&
                                <> 
                                    <h3>Open Campaigns</h3>
                                    <Link route="/campaigns/new">
                                        <a><Button floated='right' content="Create Campaign" icon="add circle" primary /></a>
                                    </Link>
                                    
                                    { renderCampaigns() }
                                </>
                            }
                        
                        </>
                    }
                    
                </div>

            </Layout>
        </>
    )

}

export default Camp;