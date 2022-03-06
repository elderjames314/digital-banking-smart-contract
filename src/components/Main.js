import React, { Component } from 'react'


class Main extends Component {
    render() {
        return (
            <div id="content" className="mt-3">
                <table className="table table-borderless text-muted text-center">
                    <thead>
                    <tr>
                        <th scope="col">Staking Balance</th>
                        <th scope="col">Rewards</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{ this.props.stakingBalance == null ? 0 : window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} RGT</td>
                        <td>{ this.props.rewardBalance == null ? 0 : window.web3.utils.fromWei(this.props.rewardBalance, 'Ether')} NAT</td>
                    </tr>
                    </tbody>
                </table>


                <div className="card mb-4" >

                    <div className="card-body">

                        <form className="mb-3" onSubmit={(event) => {
                            event.preventDefault()
                            let amount
                            amount = this.input.value.toString()
                            amount = window.web3.utils.toWei(amount, 'Ether')
                            this.props.stakeTokens(amount)
                        }}>
                            <div>
                                <label className="float-left"><b>Stake Tokens</b></label>
                                <span className="float-right text-muted">
                  Balance: {window.web3.utils.fromWei(this.props.rgtTokenBalance, 'Ether')}
                </span>
                            </div>
                            <div className="input-group mb-4">
                                <input
                                    type="text"
                                    ref={(input) => { this.input = input }}
                                    className="form-control form-control-lg"
                                    placeholder="0"
                                    required />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        {/*<img src={dai} height='32' alt=""/>*/}
                                        &nbsp;&nbsp;&nbsp; RGT
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-success btn-block btn-lg">STAKE / DEPOSIT!</button>
                        </form>
                        <button
                            type="submit"
                            disabled={this.props.rewardBalance <= 0}
                            className="btn btn-link btn-block btn-sm"
                            onClick={(event) => {
                                event.preventDefault()
                                this.props.claimReward()
                            }}>
                            CLAIM REWARD...
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Main;
