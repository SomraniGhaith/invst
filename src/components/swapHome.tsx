import React, { useState, useEffect } from "react";
import SwapTraderPro from "../pages/swapTraderPro";

import SwapStandardView from "../pages/swapStandardView";
import MetaMaskAccount from "./metaMaskAccount";
import Head from "./head";
import { onClickConnect } from "../lib/Connect";
import { unlockAccount} from "../api/web3";
import useAsync from "../components/useAsync";
import WalletSwap from "./WalletSwap";
import BitcoinWallet from "./BitcoinWallet";
import store from "../redux/store";
import {setPairs} from "../redux/actions"
import "./swapHome.css"

function SwapHome(props: any) {
  const [value, setValue] = useState(false);
  const [tolerance, setTolerance] = useState("1.1");
  const[tokenFrom,setTokenFrom]=useState("")
  const[tokenTo,setTokenTo]=useState("")
  const[NameTokenFrom,setNameTokenFrom]=useState("")
  const[NameTokenTo,setNameTokenTo]=useState("")
  const [walletConnect , setWallet ] = useState()
  const [walletName , setWalletName ] = useState("");
  const [zilliqa , setZilliqa ] = useState();
 

  const transferWallet = (wallet : any ) => { 
    setWallet(wallet)
   
    
  }

  const transferTolerance = (tolerance: any) => {
    setTolerance(tolerance);
  };
  const { pending, error, call } = useAsync(unlockAccount);
  useEffect(() => {
    onClickConnect(call);
    setPairsWithGraph();
  }, []);

  
  const handleCallbac = (wallet : any ) => { 
   
   setWalletName(wallet.name);
   setWallet(wallet)
   
  }
  function setPairsWithGraph(){
    var ret:any=[];
    var querytosend = `{ 
      pairs{
        id
        token0{
          name
        }
        token1{
          name
        }
      }
       
    }`;
   // console.log(querytosend)
    fetch('https://graph.novafinance.app/subgraphs/name/NovaFi/NovaFi', {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        "query": querytosend,

      }),
    })
      .then(response => response.json())
      .then(data => {
       
        //@ts-ignore
        data.data.pairs.map((element)=>{
        
          ret={"nameToken0":element.token0.name.toUpperCase(),"nameToken1":element.token1.name.toUpperCase(),"adressPair":element.id};
        store.dispatch(setPairs(ret))
        })
      })
    
    .catch((error) => {
      console.error('Error:', error);
    });
  }


  function useKey(key:any) {
    // Keep track of key state
    const [pressed, setPressed] = useState(false)

    // Does an event match the key we're watching?
    const match = (event:any) => key.toLowerCase() == event.key.toLowerCase()

    // Event handlers
    const onDown = (event:any) => {
        if (match(event)) setPressed(!pressed)
        
    }

   /*  const onUp = (event:any) => {
        if (match(event)) setPressed(false)
    }
 */
    // Bind and unbind events
    useEffect(() => {
        window.addEventListener("keydown", onDown)
       /*  window.addEventListener("keyup", onUp) */
        return () => {
            window.removeEventListener("keydown", onDown)
           /*  window.removeEventListener("keyup", onUp) */
          
          
        }
      
    }
    
    , [key])

    return pressed
}
 const Shift =useKey("enter")

   
  const handleCallbackZilliqa = (zilliqa : any ) => { 
    setZilliqa(zilliqa)
    
   }
     
 

  return (
    <div className="main-layout inner_page" >
      <div>
        <Head />
      </div>
    

      {!value ? (
        <div>
          <div className="infotrader " style={{justifyContent:"space-between",marginLeft:"10px"}}>

              <div>  
                {
                      Shift && (
        
                        <WalletSwap  parentCallback={handleCallbac} zilliqaCallback={handleCallbackZilliqa} />

                            )
                      } 
           </div>
            <div className="tradertitle ">
             
              <label className="switch">
                <input
                
                  type="checkbox"
                  onChange={() => {
                    setValue(!value);
                  }}
                />
                <span className="slider round"></span>
              </label>
             

                <MetaMaskAccount transferTolerance={transferTolerance} showSetting={true} walletSelect={walletConnect} zilliqa = {zilliqa}/>
                </div>

          </div>
           
                {walletName==="Bitcoin" ? <BitcoinWallet /> 
                :<SwapStandardView tolerance={tolerance} walletName={walletName} zilliqa = {zilliqa} changeTokenFrom={setTokenFrom} changeTokenTo={setTokenTo} />
                }

              </div>
      ) : (
        <div>
          <div className="infotrader ">
            <div className="tradertitle ">
              <p></p>
              <label className="switch">
                <input
                  type="checkbox" checked
                  onChange={() => {
                    setValue(!value);
                  }}
                />
                <span className="slider round"></span>
              </label>
            </div>

            <MetaMaskAccount transferTolerance={transferTolerance}  walletSelect = {walletConnect} />
          </div>
          <SwapTraderPro tolerance={tolerance} tokenFrom={tokenFrom} tokenTo={tokenTo} />
        </div>
      )}
    </div>
  );
}

export default SwapHome;
