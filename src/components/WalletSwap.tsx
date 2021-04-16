

import React, { useState, useEffect } from "react";
import { getToken } from '../api/token';
import "./WalletSwap.css"
import { connectZilliqa, getZilAccount, getZilNetId, getZilBalance } from "../api/web3"
import balances from "../redux/reducers/balances";
import { AnyARecord } from "dns";
import { Modal } from 'reactstrap';
import zilpay from '../images/zilpay.jpg'
 
function WalletSwap(props: any) {

  const [tokename, settokename] = useState("ETH")

  const [walletConnect, setWallet] = useState("");
  const [tokenicon, settokenicon] = useState("")
  const [zilPayAccount, setZilPayAccount] = useState({ "accountBech32": "", "accountBase16" :"", "balance": "", "netId": "" })
  

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  async function connectionZil(onSetBalance: any) {
    var accountBech32: any = ""
    var accountBase16 : any = ""
    var balances: any = ""
    var netIds: any = ""
  
      await getZilAccount((bech32: any, base16 : any , err: any) => {
        if (bech32 && base16 ) {
          accountBech32 = bech32;
          accountBase16 = base16;
        }
      })
     
      await getZilNetId((net: any, err: any) => {
        if (net) {
          netIds = net

        }
      })

      await getZilBalance((balance: any, err: any) => {
        if (balance) {
          balances = balance
        }
      })
      
    
      onSetBalance(accountBech32,accountBase16, balances, netIds);
    

    }
  
  
  async function transferWallet(wallet: any) {
    setWallet(wallet)
    setWallet(wallet.name);
    props.parentCallback(wallet);
    //Connect to zilPay
    if (wallet.name == "Zilliqa") {
     connectZilliqa((err , connect) => {
        if (err) {
         //alert(error);
         toggle();
        }
        else 
        if (connect) {
         
          //@ts-ignore
      connectionZil((b32, b16, b, n) => props.zilliqaCallback(
        {
          "accountBech32": b32.toString(),
          "accountBase16": b16.toString(),
          "balance": b.toString(),
          "netId": n.toString()
        }
      ));
        }
        else {
          toggle();
        }
      

      })
      
      
      


     // props.zilliqaCallback(zilPayAccount);
    }

   
    
    



  }
  return (
    <div className="dropdown dropdownSwaptoken" >
       <Modal isOpen={modal} toggle={toggle} >
        <div className="modal-zilliqa">
         
         <p className="modal-zilliqa-alert"> ZilPay extension not installed</p> 
        <p className="modal-zilliqa-link"> Download it <a style={{color:"#6f42c1",fontSize:"16px",fontWeight:"bolder"}} href="https://chrome.google.com/webstore/detail/zilpay/klnaejjgbibmhlephnhpmaofohgkpgkd" target="_blank">here!</a> </p>
       <img src={zilpay} />
        </div>
      </Modal>

       


      <button className="btn btn-secondary dropdown-toggle dropdownswaptokenbutton" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <img src={tokenicon} width="20%" /> {tokename}
      </button>

      <div className="dropdown-menu dropdownMenu" aria-labelledby="dropdownMenuButton" >

        {getToken().map((e, index) =>
          <button key= {index} className="dropdown-item-swaptoken" onClick={() => { settokename(e.name); settokenicon(e.icon); transferWallet(e) }}>

            <img src={e.icon} width="20%" style={{ marginRight: "5px" }} />

            {e.name}

          </button>

        )}



      </div>
    </div>
  );
}
export default WalletSwap;