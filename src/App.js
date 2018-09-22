import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      manage: "",
      players: [],
      balance: "",
      value: "",
      message: ""
    };

    this.myRef = React.createRef();
  }

  async componentDidMount() {
    const manager = await lottery.methods.manager().call(); // data in call not required for metamask provider
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  componentDidUpdate(nextProps, nextState) {
    if (nextState.message !== this.state.message && this.state.message !== "")
      this.notify();
  }

  onSubmit = async event => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success" });
    var isSuccess = true;
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, "ether")
      });
    } catch (ex) {
      this.setState({ message: 'Error: ' + ex.message});
      isSuccess = false;
    }
    if (isSuccess)
      this.setState({ message: "You have been entered!" });
  };

  notify = () => {
    this.myRef.current.classList.add("show");
    setTimeout(() => {
      this.myRef.current.classList.remove("show");
    }, 3500);
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div
              className="alert alert-light alert-dismissible fade"
              role="alert"
              ref={this.myRef}
            >
              {this.state.message}
              <button
                type="button"
                className="close"
                data-dismiss="alert"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 text-center">
            <h1 className="display3 mt-3 mb-0">EtherRaffle</h1>
            <p className="text-muted mt-0 mb-5">
              Ethereum based Lottery smart contract
            </p>
          </div>
        </div>
        <div className="row" />
        <p>This contract is managed by {this.state.manager}</p>
        <p>
          There are currently {this.state.players.length} people entered,
          competing to win {web3.utils.fromWei(this.state.balance, "ether")}
        </p>
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={this.state.value}
              type="number"
              step=".01"
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>
      </div>
    );
  }
}

export default App;
