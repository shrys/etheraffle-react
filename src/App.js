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
      this.setState({ message: "Error: " + ex.message });
      console.log(ex);
      isSuccess = false;
    }
    if (isSuccess) this.setState({ message: "You have been entered!" });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success" });
    var isSuccess = true;
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[0]
      });
    } catch (ex) {
      this.setState({ message: "Error: " + ex.message });
      console.log(ex);
      isSuccess = false;
    }
    if (isSuccess) this.setState({ message: "Winner picked!" });
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
        <div className="row mt-5">
          <div className="col-md-12 text-center">
            <h1 className="display3 mb-0">EtherRaffle</h1>
            <p className="text-muted mt-0 mb-5">
              Ethereum based Lottery smart contract
            </p>
          </div>
        </div>
        <div className="card-deck">
          <div className="card shadow p-3 bg-white rounded col-md-6">
            <div className="mb-0">
              <h4>Manager's address</h4>
              <kbd>{this.state.manager}</kbd>
              <hr />
              <div className="container mt-3">
                <div className="row">
                  <div className="col col-7 h3 text-right">Total participants</div>
                  <div className="col h2">
                    <kbd>{this.state.players.length}</kbd>
                  </div>
                  <div className="w-100" />
                  <div className="col col-7 h3 text-right">
                    Prize amount <span className="h6 text-muted">ether</span>
                  </div>
                  <div className="col h2">
                    <kbd>{web3.utils.fromWei(this.state.balance, "ether")}</kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card shadow p-3 bg-white rounded col-md-6">
            <div className="mb-0">
              <form onSubmit={this.onSubmit}>
                <h4>Enter lottery</h4>
                <div className="input-group ml-2">
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    placeholder="amount"
                    onChange={event =>
                      this.setState({ value: event.target.value })
                    }
                  />
                  <div className="input-group-append mr-2">
                    <span className="input-group-text rounded-right">ether</span>
                  </div>
                  <button className="btn btn-dark mr-2">Enter</button>
                </div>
              </form>
              <hr />
              <h4 className="mt-2">Pick a winner</h4>
              <div className="mr-2">
                <button className="btn btn-dark btn-block ml-2" onClick={this.onClick}>Pick</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
