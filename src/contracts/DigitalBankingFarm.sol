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


    //create our contruction that run once whenever the smart contract is deployed to the network
    //the contructor takes  the argument of the address that deployed the RGT and Native token to the network
    constructor(RgtToken _rgtToken, NativeToken _nativeToken) public {
        rgtToken = _rgtToken;
        nativeToken = _nativeToken;
    }

}