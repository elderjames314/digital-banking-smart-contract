const DigitalBankingFarm = artifacts.require("DigitalBankingFarm");


//we need to deployed the contract step by step, more reason i added async
module.exports = async function(callabck) {

    //get the deployed smart contract
    let digitalBankingFarm = await DigitalBankingFarm.deployed();
    await digitalBankingFarm.issueReward();



    console.log("Token issued!");

    callabck();

};
