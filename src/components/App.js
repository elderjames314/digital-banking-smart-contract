import React, { Component } from 'react'
import Navbar from './Navbar'
import Web3 from 'web3'
import DigitalBankingToken from '../abis/DigitalBankingFarm.json'
import NativeToken from '../abis/NativeToken.json'
import RgtToken from '../abis/RgtToken.json'
import './App.css'
import Main from "./Main";

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    //setInterval(this.issueToken(), 1000 * 60 * 60 * 24);  //run every 24hrs
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({account: accounts[0]});

    const networkId = await web3.eth.net.getId();


    // Load RGT TOKEN
    const rgtTokenData = RgtToken.networks[networkId]
    if(rgtTokenData) {
      const rgtToken = new web3.eth.Contract(RgtToken.abi, rgtTokenData.address)
      this.setState({ rgtToken })
      let rgtTokenBalance = await rgtToken.methods.balanceOf(this.state.account).call()
      this.setState({ rgtTokenBalance: rgtTokenBalance })
    } else {
      window.alert('RgtToken contract not deployed to detected network.')
    }


    // Load Native TOKEN
    const nativeTokenData = NativeToken.networks[networkId]
    if(nativeTokenData) {
      const nativeToken = new web3.eth.Contract(NativeToken.abi, nativeTokenData.address)
      this.setState({ nativeToken })
      let nativeTokenBalance = await nativeToken.methods.balanceOf(this.state.account).call()
      this.setState({ nativeTokenBalance: nativeTokenBalance })
    } else {
      window.alert('NativeToken contract not deployed to detected network.')
    }



    // Load Digital Banking Farm TOKEN
    const digitalBankingTokenData = DigitalBankingToken.networks[networkId]
    if(digitalBankingTokenData) {
      const digitalBankingFarm = new web3.eth.Contract(DigitalBankingToken.abi, digitalBankingTokenData.address)
      this.setState({ digitalBankingFarm })
      let stakingBalance = await digitalBankingFarm.methods.stakersAccount(this.state.account).call((error, result) => {
        this.setState({ stakingBalance: result.balance, rewardBalance: result.reward })
      })
    } else {
      window.alert('Digital banking farm token contract not deployed to detected network.')
    }


    this.setState({ loading: false })


  }

  //load web3
  //this is function that connect the app to the blockchain...
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }


  stakeTokens = (amount) => {
    if(amount %10 === 0) {
      this.setState({ loading: true })
      this.state.rgtToken.methods.approve(this.state.digitalBankingFarm._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.state.digitalBankingFarm.methods.depositToken(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
          this.setState({ loading: false })
        })
      })

    }else {
      window.alert('Amount must be a multiple of 10 eg 10, 20, 30')
    }


  }

  issueToken = () => {
      this.setState({ loading: true })
      this.state.digitalBankingFarm.methods.issueReward().send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
  }



  claimReward = () => {
    if(this.state.rewardBalance > 0) {
      this.setState({ loading: true })
      this.state.digitalBankingFarm.methods.claimReward().send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    }else {
      window.alert("reward balance must be greater than zero");
    }


  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      rgtToken: {},
      nativeToken: {},
      digitalBankingFarm: {},
      rgtTokenBalance: '0',
      nativeTokenBalance: '0',
      stakingBalance: '0',
      rewardBalance: '0',
      loading: true
    }
  }

  render() {
    let content;
    if(this.state.loading){
      content = <p id="loader" className="text-center">Loading....</p>
    }else {
      content = <Main
          stakingBalance={this.state.stakingBalance}
          rewardBalance={this.state.rewardBalance}
          rgtTokenBalance={this.state.rgtTokenBalance}
          stakeTokens={this.stakeTokens}
          claimReward={this.claimReward}
      />
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                {content}

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
