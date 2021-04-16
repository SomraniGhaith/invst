import React from 'react';
import GatewayJS from "@renproject/gateway";
import Web3 from "web3";
import "./BitcoinWallet.css";
import ABI from "../ABI.json";
import { Tab, Tabs } from 'react-bootstrap';
import { getBitcoin } from "../api/bitcoin";
// Replace with your contract's address.
const contractAddress = "0x3aa969d343bd6ae66c4027bb61a382dc96e88150";

class BitcoinWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: 0,
      message: "",
      error: "",
      gatewayJS: new GatewayJS("testnet"),
      tokename : "BTC",
      tokenicon : "",
      amountDeposit : null ,
      account : ""

    }
  }

  componentDidMount = async () => {
    let web3Provider;

    // Initialize web3 (https://medium.com/coinmonks/web3-js-ethereum-javascript-api-72f7b22e2f0a)
    // Modern dApp browsers...
    if (window.ethereum) {
      web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        this.logError("Please allow access to your Web3 wallet.");
        return;
      }
    }
    // Legacy dApp browsers...
    else if (window.web3) {
      web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      this.logError("Please install MetaMask!");
      return;
    }

    const web3 = new Web3(web3Provider);

    const networkID = await web3.eth.net.getId();
    
    if (networkID !== 42) {
     
      this.logError("Please set your network to Kovan.");
      return;
    }
    const accounts = await web3.eth.getAccounts();
    if(accounts) {
      this.setState({account : accounts[0]})
    }


    this.setState({ web3 }, () => {

      // Update balances immediately and every 10 seconds
      this.updateBalance();
      setInterval(() => {
        this.updateBalance();
      }, 10 * 1000);
    });

    this.recoverTransfers().catch(this.logError);
  }
  handlerAmountDeposit = event => {
    this.setState({amountDeposit : event.target.value})
  }
   formAccount(x) {
    var str = x;
    var res1 = str.substring(0, 6);
    var res2 = str.substring(str.length - 4, str.length);
    var res = (res1.concat('...', res2)); 
    return (res)
}
 
  render = () => {
    const { balance, message, error } = this.state;
    return (
      <div className="main-layout inner_page bitcoinWallet" >

      <div className="bitcoinwallet ">
      
          <Tabs defaultActiveKey="mint" id="uncontrolled-tab-example">
             
              <Tab eventKey="mint" title="Mint" className="mint" >
                  <input value={this.state.amountDeposit} onChange={this.handlerAmountDeposit} placeholder={"0.00"+this.state.tokename} className="input-mint" style={{maxWidth:'100%'}} />
                  <div className="infobitcoin">
                      <p className="info-text-bitcoin fontText" >Asset</p>
                  <div className="dropdown dropdownSwaptoken" >
                 
                 <button className="btn btn-secondary dropdown-toggle dropdownbitcoinbutton" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                 <img src={this.state.tokenicon} width="20%" /> {this.state.tokename}
                 </button>
            
               <div className="dropdown-menu dropdownMenu" aria-labelledby="dropdownMenuButton" >

                 { getBitcoin().map((e , index ) =>
                 <button className="dropdown-item-swaptoken" onClick={()=> {this.setState({tokename : e.name});this.setState({tokenicon : e.icon});}}>
               
                <img src={e.icon} width="20%" style={{marginRight:"5px"}} />

                 {e.name}
                
                </button>
                  
                  )}
                   
               </div>
               </div>
             </div>
                  <div className="infobitcoin">
                      <p className="info-text-bitcoin fontText" >Destination</p>
                      <p className="info-text-bitcoin fontText">{this.formAccount(this.state.account)}</p>
                  </div>
                  <div className="infobitcoin">
                      <p className="info-text-bitcoin fontText" >You will receive</p>
                      <p className="info-text-bitcoin fontText">0.996500 renBTC</p>
                  </div>
                  <div style={{textAlign:"center"}}>
                  <button style={{padding:"1rem 10rem",backgroundColor:"#006fe8",margin:"10px"}} onClick={() => this.deposit().catch(this.logError)}>Deposit</button>
                  </div>
              </Tab>
              <Tab eventKey="release" title="Release" className="mint">
                  <div className="infobitcoin" style={{padding:"2rem 0 0",border:"0"}}>
                      <p className="info-text-bitcoin fontText" >{"ren"+this.state.tokename+" Balance"}</p>
                      <p className="info-text-bitcoin fontText">00000000000renBTC</p>
                  </div>
                  <div className="infobitcoin">
                      <p className="info-text-bitcoin fontText" >Asset</p>
                  <div className="dropdown dropdownSwaptoken" >
                 
                 <button className="btn btn-secondary dropdown-toggle dropdownbitcoinbutton" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                 <img src={this.state.tokenicon} width="20%" /> {this.state.tokename}
                 </button>
            
               <div className="dropdown-menu dropdownMenu" aria-labelledby="dropdownMenuButton" >

                 { getBitcoin().map((e , index ) =>
                 <button className="dropdown-item-swaptoken" onClick={()=> {this.setState({tokename : e.name});this.setState({tokenicon : e.icon});}}>
               
                <img src={e.icon} width="20%" style={{marginRight:"5px"}} />

                 {e.name}
                
                </button>
                  
                  )}
                   
               </div>
               </div>
             </div>

             <div className="infobitcoin">
                      <p className="info-text-bitcoin fontText" >Destination</p>
                     <input placeholder={"Enter "+this.state.tokename+" Adress "} style={{border:0}} />
                  </div>
             <div className="infobitcoin">
                      <p className="info-text-bitcoin fontText" >You will receive</p>
                      <p className="info-text-bitcoin fontText">0.996500 renBTC</p>
                  </div>
                  <div style={{textAlign:"center"}}>
                  <button style={{padding:"1rem 10rem",backgroundColor:"#006fe8",margin:"10px"}} onClick={() => this.withdraw().catch(this.logError)}>Withdraw {balance} BTC</button>
                  </div>
              </Tab>
              <p>{message}</p>
                    {error ? <p style={{ color: "red" }}>{error}</p> : null}
          </Tabs>
              
      </div>
  </div>
    );
  }

  updateBalance = async () => {
    const { web3 } = this.state;
    const contract = new web3.eth.Contract(ABI, contractAddress);
    const balance = await contract.methods.balance().call();
    this.setState({ balance: parseInt(balance.toString()) / 10 ** 8 });
  }

  logError = (error) => {
    console.error(error);
    this.setState({ error: String((error || {}).message || error) });
  }

  log = (message) => {
    this.setState({ message });
  }

  deposit = async () => {
    const { web3, gatewayJS , amountDeposit } = this.state;
    if(amountDeposit){
    var amount = amountDeposit; // BTC
    


    try {
      await gatewayJS.open({
        // Send BTC from the Bitcoin blockchain to the Ethereum blockchain.
        sendToken: GatewayJS.Tokens.BTC.Btc2Eth,

        // Amount of BTC we are sending (in Satoshis)
        suggestedAmount: Math.floor(amount * (10 ** 8)), // Convert to Satoshis

        // The contract we want to interact with
        sendTo: contractAddress,

        // The name of the function we want to call
        contractFn: "deposit",

        // The nonce is used to guarantee a unique deposit address
        nonce: GatewayJS.utils.randomNonce(),

        // Arguments expected for calling `deposit`
        contractParams: [
          {
            name: "_msg",
            type: "bytes",
            value: web3.utils.fromAscii(`Depositing ${amount} BTC`),
          }
        ],

        // Web3 provider for submitting mint to Ethereum
        web3Provider: web3.currentProvider,
      }).result();
      this.log(`Deposited ${amount} BTC.`);
    } catch (error) {
      // Handle error
      this.logError(error);
    }
  }
  }

  withdraw = async () => {
    const { web3, gatewayJS, balance } = this.state;
    const amount = balance
  
    alert("we comming")
    alert(amount)
    const recipient = prompt("Enter BTC recipient:");

    // You can surround shiftOut with a try/catch to handle errors.

    await gatewayJS.open({
      // Send BTC from the Ethereum blockchain to the Bitcoin blockchain.
      // This is the reverse of shitIn.
      sendToken: GatewayJS.Tokens.BTC.Eth2Btc,

      // The contract we want to interact with
      sendTo: contractAddress,

      // The name of the function we want to call
      contractFn: "withdraw",

      // Arguments expected for calling `deposit`
      contractParams: [
        { name: "_msg", type: "bytes", value: web3.utils.fromAscii(`Withdrawing ${amount} BTC`) },
        { name: "_to", type: "bytes", value: "0x" + Buffer.from(recipient).toString("hex") },
        { name: "_amount", type: "uint256", value: Math.floor(amount * (10 ** 8)) },
      ],

      // Web3 provider for submitting burn to Ethereum
      web3Provider: web3.currentProvider,
    }).result();

    this.log(`Withdrew ${amount} BTC to ${recipient}.`);
  }

  recoverTransfers = async () => {
    const { web3, gatewayJS } = this.state;
    // Load previous transfers from local storage
    const previousGateways = await gatewayJS.getGateways();
    // Resume each transfer
    for (const transfer of Array.from(previousGateways.values())) {
      gatewayJS
        .recoverTransfer(web3.currentProvider, transfer)
        .pause()
        .result()
        .catch(this.logError);
    }
  }
}

export default BitcoinWallet;