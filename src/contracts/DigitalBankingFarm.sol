// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.5.0;

//since we will be using our RGT and Native token in this our banking farm smart contract
//therefore, we need to import them here

import "./RgtToken.sol";
import "./NativeToken.sol";






// This is like tokenFarm that gives reward for each token staked(deposited) by investor
// the idea is, an investor will stake a multiple of 10 RGT token.
// And for each staken, 0.1 RGT token is reward every 24 hours.
contract DigitalBankingFarm {

    //the name of the contract. it is best practice to give smart contract a name
    string public name = "Dapp Digital Banking Farm";
    //create variable of type RGT token
    RgtToken public rgtToken;
    //create variable of type Native token
    NativeToken public nativeToken;
    //create the variable that will hold the mapping of address to account
    mapping(address => Account) public stakersAccount;
    //Since it is certain that the reward for each is staking is 0.1, therefore it will be okay if declared constant
    uint constant rewardAmount = 100000000000000000; // 0.1 RGT TOKEN
    //Lets manage the state of staking/depositing in our contract, in that case we will know if the user has staked.
    mapping(address => bool) public hasStaked;
    //Lets keep track of all the addresses that ever staked in our contract.
    address[] public stakerAddresses;
    //lets add current staking status;
    mapping(address => bool) public isStaking;
    //keep track all track assets we ever created in this account
    Asset[] public assets;
    //track the last running time
    uint lastRun;


    //EVENT
    event StakingEvent(address owner, uint amount, string message);
    event ClaimRewardEvent(address owner, uint reward, string message);


    //The object that hold the account of each stakers
    struct Account {
        //holding total balance of the amount the account has staked or deposited so far
        uint balance;
        //hold the balance of the reward so far base on the amount he has staked
        uint reward;
        //great to have this, in order to check its existence
        bool exists;
    }


    //The asset object that will be created upon successfully deposited of multiple of 10 RGT token
    struct Asset {
        //an asset should have unique identity, in this case, a unique identifiers can assigned to this
        bytes32 identity;
        //of course an asset should have owner, in this case, we will use address of the owner
        address owner;
        //and asset will have a name, we will just called RGTAsset
        string name;
        //how much does this asset worth
        uint value;
    }




    //create our contruction that run once whenever the smart contract is deployed to the network
    //the contructor takes  the argument of the address that deployed the RGT and Native token to the network
    constructor(RgtToken _rgtToken, NativeToken _nativeToken) public {
        rgtToken = _rgtToken;
        nativeToken = _nativeToken;
    }

    //1. Stake token: this is part where investor we deposit RGT token to our digital banking contract
    //takes amount of RGT token as an argument and it has to be multiple of 10
    function depositToken(uint _amount) public isMultipleOfTen(_amount) {

        // to stake RGT token to our contract, first we will transfer whatever the amount the sender is sending
        // to this contract
        // ofcourse in a real world scenerios, token sent to the app can be used for lending, fund raising, project building etc
        // as reward for each multiple of 10 token RGT stoken, an asset will be generated.
        // asset is something of value such as diamond, gold, but in this case asset === 0.1 RGT token
        rgtToken.transferFrom(msg.sender, address(this), _amount);

        //now the token has been successfully transfer to the contract, lets create an asset for this transactions
        Asset memory asset = Asset({
            //for instance we will hash the timestamp and block number to make identity of this asset unique
            identity: keccak256(abi.encodePacked(block.timestamp, block.number)),
            name: "RGT TOKEN ASSET",
            owner: msg.sender,  //the sender is the owner of this asset
            value: rewardAmount
        });


        //check if this sender has an account with us
        if(stakersAccount[msg.sender].exists) {
            //update the account of this sender
            Account memory account = stakersAccount[msg.sender];
            //Great! this sender has account with us, lets update its balance
            //update the existing balance
            account.balance += _amount;

        }else {
            //it means this is our first time account owner, lets add him up the list of our account owners
            //open account for him
            Account memory newAccount = Account({
            balance: _amount,
            reward: rewardAmount,
            exists: true
            });
            //finally add him up to the list of existing stakers
            stakersAccount[msg.sender] = newAccount;
            //so since this is new account --- first timer stakers, lets also add him to the array of stakers
            stakerAddresses.push(msg.sender);
        }
        //update the asset array;
        assets.push(asset);
        //update current staking status
        isStaking[msg.sender] = true;
        //update staking status
        hasStaked[msg.sender] = true;

        //if every things went well as it should, then emit staking event
        emit StakingEvent(msg.sender, _amount, "Operation was successful");

    }


    //2. Issuing token as a reward : part where 0.1 native token will be issuing for all our investor asset in the
    // in the contract since the our digital banking now have 10,000 of native token to be issued out
    //this function will be called by off-chain server every 24 hours...
    //NOTE: there is not native delay, sleep or anything like that in solidity or EVM bytcode in general
    //becuase of this, we will call the function from off-chain every 24hrs and validate it in solidity like this
    function issueReward() public {
        //first lets validate that is actually being the 24 hours since this operation was ran
       require(block.timestamp - lastRun > 24 hours, 'Need to wait 24 hours');
        //run this only if the last run has been over 24 hours
        for(uint i = 0; i < stakerAddresses.length; i++) {
            address  recipient = stakerAddresses[i];
            Account memory account = stakersAccount[recipient];
            //keep track of the reward received since the user has been staking/depositing
            account.reward += rewardAmount;
        }
        //update the last run
        lastRun = block.timestamp;
    }


    //3. Claim your reward: the method that will be responsible for investor to claim the reward that he received
    // so far base on the asset he/she has with us.
    function claimReward() public {

        //fetch the account detail of the sender
        Account memory account  = stakersAccount[msg.sender];

        //get the total reward
        uint reward = account.reward;

        //check if the reward is greater than zero
        require(reward > 0, "Reward must be greater than zero before it can be claimed, pls stake RGT token and check back again");

        //transfer native token to this sender
        nativeToken.transfer(msg.sender, reward);

        //reset the reward balance
        account.reward = 0;

        //the account is not more staking
        isStaking[msg.sender] = false;

        //emit claimReward event
        emit ClaimRewardEvent(msg.sender, reward, "Operation was successful");


    }





    // HELPER FUNCTIONS
    modifier isMultipleOfTen(uint _amount) {
        require(_amount % 10 == 0, "The RGT amount has to be multiple of 10 eg 10, 20, 30");
        _;
    }



}