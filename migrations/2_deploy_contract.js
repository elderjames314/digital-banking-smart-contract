const RgtToken = artifacts.require("RgtToken");
const NativeToken = artifacts.require("NativeToken");
const DigitalBankingFarm = artifacts.require("DigitalBankingFarm");


//we need to deployed the contract step by step, more reason i added async
module.exports = async function(deployer, network, accounts) {

    //the first deployment that we need to make to deploy RGT token
    await deployer.deploy(RgtToken);

    //then after the deployment, get the address that deployed it
    const rgtToken = await RgtToken.deployed();

    //second deployment, is to deploy our native token smart contract that will be available for rewards
    await deployer.deploy(NativeToken);

    //then get the address
    const nativeToken = await NativeToken.deployed();

    //finally we deploy the digital banking farm by passing the RGT and Native token addresses
    await deployer.deploy(DigitalBankingFarm, rgtToken.address, nativeToken.address);

    //get the address of the smart contract on the network.
    const digitalBankingFarm = await DigitalBankingFarm.deployed();

    //Now we need to transfer all our native token to the digital banking smart contract
    //so that it will be readily avaialble to use for rewards
    //the total token transfer is 10,000
    await nativeToken.transfer(digitalBankingFarm.address, "10000000000000000000000");

    //Now, we would like an investor to use the app by deposing RGT token, because now, once we deployed the RGT token
    //all the token will belong to the contract owner(the person the deployed).
    //Therefore we would like to transfer some to an investors
    //eg transfer 100 RGT token to an this investor
    await rgtToken.transfer(accounts[1], "1000000000000000000000000");
};
