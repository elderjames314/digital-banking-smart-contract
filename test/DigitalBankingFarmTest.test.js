//for our test
//we have got some nice libray in our package.json file for our test
//we use Mochai for testing framework and Chai for assertion library


//require the necessary smart contracts
const RgtToken = artifacts.require("RgtToken");
const NativeToken = artifacts.require("NativeToken");
const DigitalBankingFarm = artifacts.require("DigitalBankingFarm");


//require chai
require('chai')
    .use(require('chai-as-promised'))
    .should()

//helper functions
function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('DigitalBankingFarmTest', ([owner, investor]) => {

    //basically the contract will contain all our tests...

    let rgtToken, nativeToken, digitalBankingFarm;

    //first create before hook, a function that runs first before every test runs
    before(async () => {
        //load this contracts
        rgtToken = await RgtToken.new();
        nativeToken = await NativeToken.new();
        digitalBankingFarm = await DigitalBankingFarm.new(rgtToken.address, nativeToken.address);


       //transfer all native token to our digitalBankingFarm
        await nativeToken.transfer( digitalBankingFarm.address, tokens("10000"));

        //and finally send token to an investor for the purpose of testing
        rgtToken.transfer(investor, tokens("100"), {"from" : owner});
    });

    describe('RGT token deployment', async () => {
        it('has a name', async () => {
            const name = await rgtToken.name();
            assert.equal(name, "Really Great Tech Token");
        });
    });

    describe('Native token deployment', async () => {
        it('has a name', async () => {
            const name = await nativeToken.name();
            assert.equal(name, "Native Token");
        });
    });

    describe('Digital banking farm deployment', async () => {
        it('has a name', async () => {
            const name = await digitalBankingFarm.name();
            assert.equal(name, "Dapp Digital Banking Farm");
        });

        it('contact has token', async () => {
            const balance = await nativeToken.balanceOf(digitalBankingFarm.address);
            assert.equal(balance.toString(), tokens("10000"));
        });
    });

    describe('Staking tokens', async () => {

        it("It rewards investors for staking RGT token", async () => {
            let result;
            //check investor balance for staking
            result =  await rgtToken.balanceOf(investor);
            assert.equal(result.toString(), tokens("100"), "Investor wallet RGT token should be correct before staking");
            //now the investor has the correct amount, lets stake some
            //but before you can stake token, it must first been approved
            await rgtToken.approve(digitalBankingFarm.address, tokens("10"), {from: investor});
            //then now stake it since it has been approve
            await digitalBankingFarm.depositToken(tokens("10"), {from : investor});

            //now lets check the result of the investor balance after staking
            result = await rgtToken.balanceOf(investor);
            assert.equal(result.toString(), tokens("90"), "Investor RGT balance is incorrect");

            //lets check the balance of smart contract, it appears that, 10 RGT token has been deposit
            result = await rgtToken.balanceOf(digitalBankingFarm.address)
            assert.equal(result.toString(), tokens("10"), "Digital banking farm RGT balance is incorrect");

            //check the staking balance of the investor
            result = await digitalBankingFarm.stakersAccount(investor);
            assert.equal(result.balance.toString(), tokens("10"), "Investor RGT balance is incorrect");

            //and lastly let's check if the investor is actually staking as it should
            result = await digitalBankingFarm.isStaking(investor);
            assert.equal(result.toString(), "true", "At this point, investor should be staking, but it appears is not");


            //issue token
            //issue reward token to the stakes
            await digitalBankingFarm.issueReward();
            //confirm the rewards token
            result = await  nativeToken.balanceOf(investor);
            //at this time, native token of investor should be 0.1
            assert.equal(result.toString(), tokens("0"), "Investor rewards correct after the issuing");


            //claim reward
            await digitalBankingFarm.claimReward({from: investor});
            result = await nativeToken.balanceOf(investor);
            assert.equal(result.toString(), tokens("0.1"), "Investor rewards successfully transfered");



        })


    });


  ;


});




