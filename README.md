##Digital banking smart contract App


### Introduction
Digital banking smart contract application is on chain platform where an investor can stake or deposit our token (RGT)
and get a reward or loan of 0.1 RGT token every 24 hours.
And investor can claim their reward at any point time

### implementation
The backend implementation is done using solidity programming language with help of truffle framework
basically there two public method implemented in the application which are 

* deposit/staking method which take amount of type unisigned integer as argument, this will be called
upon an investor depositing into our app with RGT token. And please note that investor are only allowed to deposit a multiple of 10 RGT token at a time. eg 10, 20, 30 etc
* claimReward/withdrawal method: this transfer all the rewards that the investor has earned over a period of time to his wallet.



### Depencies
* Solidity programming
* Truffle framework
* Ganache : local blochain
* Mocha/Chai
* React
* Ethereum alam clock
* moment

### Report
The architectural diagram report can be found in this part: /report