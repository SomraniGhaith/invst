import React, { Component } from 'react';
import { unlockAccount, addLiquidity } from '../api/web3'
import Web3 from "web3";
import { useState, useEffect } from "react";
import useAsync from "../components/useAsync";
import { useWeb3Context } from "../contexts/Web3";
import { connectZilliqa, getZilAccount, getZilNetId, getZilBalance } from "../api/web3";

function Invest(props:any) {
  const [modal, setModal] = useState(false);
  const [nameToken,setnameToken]=useState("");
  const [accountETH, setAccountETH] = useState("")
  const [accountZIL, setAccountZIL] = useState("")
  const [stateConnect,setStateConnect]=useState(false);
  
  const [stateConnectZIL,setStateConnectZIL]=useState(false);

  const [balanceZil, setBalanceZil] = useState("0");
  const [balanceETH,setBalanceETH]=useState("0");
  const { state: { account, netId, balance }, updateAccount } = useWeb3Context();
 
  const { pending, error, call } = useAsync(unlockAccount);
   // @ts-ignore
   const { ethereum } = window;
   const web3 = new Web3(ethereum);
  const toggle = () => setModal(!modal);

  const onClickConnect = async () =>  {
    const { error, data } = await call(null);

    if (error) {
      console.log(error);
      return;
    }
    if (data) {
      getConnectedAccount()
      setnameToken("Ethereum")
      //    setAccount({account: data.account , balance: balance });
      updateAccount(data);
      console.log(data.web3);
    }
  }

  const onConnectZil = async(a:any) => {
    setBalanceZil(a.balance);
  }

  const  onClickConnectZil = async (callback: any) => {
    connectZilliqa((err, connect) => {
      if (err) {
        //alert(error);
        toggle();
      }
      else
        if (connect) {
          //setStateConnectZIL(true)
          getConnectedAccountzil()
          //@ts-ignore
          connectionZil((b32, b16, b, n) => onConnectZil(
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
  }

   const  connectionZil = async (onSetBalance: any) =>  {
      var accountBech32: any = ""
      var accountBase16: any = ""
      var balances: any = ""
      var netIds: any = ""

      await getZilAccount((bech32: any, base16: any, err: any) => {
        if (bech32 && base16) {
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

      //setAccountZIL(accountBech32)
      setBalanceZil(balances)
      console.log(accountBech32+balances)
      onSetBalance(accountBech32, accountBase16, balances, netIds);


    }
    async function getConnectedAccountzil(){
      var currentZilliqa;
       //@ts-ignore
    currentZilliqa = window.zilPay;
    const isConnect = await currentZilliqa.wallet.isConnect;
    if(isConnect){
     var account = currentZilliqa.wallet.defaultAccount
      setAccountZIL(formAccountZIL(account.bech32))
      //@ts-ignore
      connectionZil((b32, b16, b, n) => onConnectZil(
        {
          "accountBech32": b32.toString(),
          "accountBase16": b16.toString(),
          "balance": b.toString(),
          "netId": n.toString()
        }
      ));
      setStateConnectZIL(true)
    }
  }
    async function getConnectedAccount(){
      var adress=""
      await web3.eth.getAccounts(function(err:any, accounts:any){
        if (err != null){
          console.error("An error occurred: "+err);
        } 
        else if (accounts.length == 0){
          console.log("User is not logged in to MetaMask");
        } 
        else{
            setAccountETH(formAccount(accounts))
            setStateConnect(true)
            adress=accounts
          
        }
    });
   
    }
    function formAccountZIL(x: String) {
            
      var str = x;
      var res1 = str.substring(0, 6);
     
      
      var res2 = str.substring(str.length - 4, str.length);
      var res = (res1.concat('...', res2));
      return (res)
    }
    
    function formAccount(x: String) {
            
      var str = x[0];
      console.log(x[0])
     
      web3.eth.getBalance(str,(err,res)=>{
        if(err){
          console.log(err);
          return;
        }if(res){
          setBalanceETH(toHumanReadableBalance(res,""))
          console.log(res);
          return;
        }
      });
      var res1 = str.substring(0, 6);
     
      
      var res2 = str.substring(str.length - 4, str.length);
      var res = (res1.concat('...', res2));
      return (res)
  }
    /*-------------FORMAT OF BALANCE -------------- */
    const toHumanReadableBalance = (balance: string, unit: string) => {
      var getBalanceFloat = parseFloat(balance);
      return (getBalanceFloat / 1000000000000000000).toFixed(3) + " " + unit;
    };
  useEffect(() => {
    
    getConnectedAccount();
    getConnectedAccountzil()
}, [accountETH])

    return (
      <div>
        <nav className="navbar navbar-light bg-0d151f justify-content-between" style={{ color: 'azure', fontFamily: 'Google Sans', }}>
          <a className="navbar-brand">   <img
            alt=""
            src="novalogo.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />   Token:HiZil</a>
          <a className="my-sm-0" href="#" style={{ color: 'azure' }}  >WhitePaper</a>
        </nav>
        <div className="container">
          <div className="row">
            <div className="col-sm-6">
              <div style={{ fontFamily: 'Google Sans', fontSize: '150%', }}>
                <div className="card text-white text-center bg-secondary mb-3" >
                  <div className="card-header">Protocol name</div>
                  <div className="card-body">
                    <p className="card-text">  HiZil Swap</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-6">
              <div style={{ fontFamily: 'Google Sans', fontSize: '150%', }}>
                <div className="card text-dark text-center bg-white mb-3" >
                  <div className="card-header">Token name :{nameToken}</div>
                  <div className="card-body">
                    <p className="card-text"><div className="row">
                      <div className="col sm-6">{stateConnect ?(<button className="btn btn-secondary btn-lg btn-block" ><i className="fa fa-circle text-success"></i> {accountETH}</button>):(<button type="button" onClick={onClickConnect} className="btn btn-secondary btn-lg btn-block" > Connect Ethereum</button>)}</div>
                      <div className="col sm-6">{stateConnectZIL ?(<button className="btn btn-secondary btn-lg btn-block" ><i className="fa fa-circle text-success"></i> {accountZIL}</button>):(<button type="button" onClick={onClickConnectZil} className="btn btn-secondary btn-lg btn-block"> Connect Zilliqa</button>)} </div>
                    </div></p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="row">
            <div className="col-sm-6">
              <div style={{ fontFamily: 'Google Sans', fontSize: '150%', }}>
                <div className="card text-white text-center bg-secondary mb-3" >
                  <div className="card-header">MAX Supply</div>
                  <div className="card-body">
                    <p className="card-text">200.000.000 tokens</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-6">
              <div style={{ fontFamily: 'Google Sans', fontSize: '150%', }}>
                <div className="card text-dark text-center bg-white mb-3" >
                {balanceETH!="0"?( <div className="card-header">Balance :{balanceETH} ETH </div>):(null)}
                {balanceZil!="0"?( <div className="card-header">Balance :{balanceZil} Zil </div>):(null)}

                  <div className="card-body">
                    <div className="input-group mb-3">
                      <input type="text" className="form-control"></input>
                      <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button">buy tokens</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div className="row">
            <div className="col-sm-4">
              <div style={{ fontFamily: 'Google Sans', fontSize: '150%', }}>
                <div className="card text-white text-center bg-secondary mb-3" >
                  <div className="card-header">Circulating supply</div>
                  <div className="card-body">
                    <p className="card-text"> 20.000.000</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-4">
              <div style={{ fontFamily: 'Google Sans', fontSize: '150%', }}>
                <div className="card text-white text-center bg-secondary mb-3" >
                  <div className="card-header">Seed sale</div>
                  <div className="card-body">
                    <p className="card-text">           10.000.000
</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-4">
              <div style={{ fontFamily: 'Google Sans', fontSize: '150%', }}>
                <div className="card text-white text-center bg-secondary mb-3" >
                  <div className="card-header">Public sale </div>
                  <div className="card-body">
                    <p className="card-text">           10.000.000
</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
            </div>


          </div>
        </div>


      </div>
    );

  }

  export default Invest;