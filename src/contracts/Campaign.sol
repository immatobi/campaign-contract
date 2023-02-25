// SPDX-License-Identifier: MIT
pragma solidity >=0.4.12 <0.9.0;

contract Factory{

    address[] public campaigns;
    
    event campaignInfo (
        uint indexed date,
        address campaign
    );

    function emitCampaign (address camp) external {
        emit campaignInfo(block.timestamp, camp);
    }

    function createCampaign(uint minimum) public {
        
        address newCampaign = address (new Campaign(minimum, msg.sender)); // deploys a new contract to the blockchain
        campaigns.push(newCampaign); // save the new deployed campaign

    }

    function getCampaigns() public view returns (address[] memory){
        return campaigns;
    }

}

contract Campaign {

    // https://bscscan.com/address/0x184d97a78aa38721c1ceffbeb0d8af6fa3df6c34#code
    // https://bscscan.com/address/0xa4069eb8f0affc4f384c6fbfd5f798c9d4f0115a#code
    // look for above to understand concepts

    // type definition
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;

    }
    
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    uint numRequests;
    Request[] public requests;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    //constructor
    constructor(uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[payable(msg.sender)] = true;
        approversCount++; // increase the number of contributors (apporvers)
    }


    function createRequest(string memory description, uint value, address payable recipient) public restricted() {

        Request storage newRequest = requests.push();

        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;

    }

    function approveRequest(uint index) public {

        Request storage request = requests[index]; // get the current request

        require(approvers[msg.sender]); // check if approver has contributed [donated]
        require(!request.approvals[msg.sender]); // check if approver have not already voted in the current request

        request.approvals[msg.sender] = true; // mark approver as voted
        request.approvalCount++; // increase approval count

    }

    function completeRequest(uint index) public restricted() {

        Request storage request = requests[index]; // get the current request
        require(!request.complete); // make sure the complete field is false

        // get the average
        uint avg = approversCount / 2;

        // make sure over 50% of approvers have voted yes
        require(request.approvalCount > avg);

        request.recipient.transfer(request.value); // send the money to the recipient
        request.complete = true; // complete request

    }
   
    function getSummary() public view returns (uint, uint, uint, uint, address) {

        return (

            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager

        );

    }

    function getRequestsCount() public view returns (uint){
        return requests.length;
    }

}