import React, {  useState, useEffect,  useReducer} from 'react';
import "./bonus1.css";
import Head from '../components/head'
import { useWeb3Context } from "../contexts/Web3";
import {  unlockAccount,} from '../api/web3'
import useAsync from "../components/useAsync";
import Web3 from "web3";
import Bonus1Card1 from "../components/bonus1Card1"
import Bonus1Card2 from "../components/bonus1Card2"
import Bonus1Card3 from "../components/bonus1Card3"
import MetaMaskAccount from "../components/metaMaskAccount"
function Bonus1() {
 
     const [tolerance, setTolerance] = useState("1.1");
    
        const transferTolerance=(tolerance:any)=>{
        setTolerance(tolerance);
     }
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
   


    const [web3, setWeb3] = useState(new Web3());
   

    const { state: { account, netId, balance }, updateAccount } = useWeb3Context();

 

    const { pending, error, call } = useAsync(unlockAccount);
   
  
  
    async function onClickConnect() {
        const { error, data } = await call(null);

        if (error) {
            
        }
        if (data) {
            
            setWeb3(data.web3);
           
            //    setAccount({account: data.account , balance: balance });
            updateAccount(data);

        }


    }
    
    useEffect(() => {
        onClickConnect();
    }, []);
  

     return (


        <div className="main-layout inner_page">

            <Head />

            <div className="container">
                <div className="row mb-3">


                    <div className=" offset-2 col-lg-8 col-sm-12 text-center ">

                        <h1 className="info-page  text-white"> Provide liquidity to <span className="text-color"> nToken </span>market pairs and claim the trading fees alongside <span className="text-color">NOVA </span>reward tokens </h1>

                    </div>
                    <div className="col-lg-2 col-sm-12 text-center">
                    <div className="btn  btn-icon-split" >
                      <MetaMaskAccount showSetting={false} />
                      </div>
                

                    </div>
                </div>
            </div>

        
            {/* ----------------------------- */}

            
            <div className="row justify-content-center">
                <div className="col-12 col-md-6 col-lg-4 mb-3 ">
                    <div className="card bg-theme h-100 mb-3 p-2" style={{backgroundColor:"#393e46"}}>

                        <div className="card-title justify-content-center ">
                            <h1 className="text-white text-center">
                                1. Add Liquidity
                        </h1>




                        </div>
                        <div className="justify-content-center ">
                            <p className="text-bold text-center text-white">
                                <span className="text-color">nToken</span> markets require 50/50 deposit of the asser and base</p>
                        </div>

                     
                    
                         {/* -------------    card ------------------------------ */}
                            <Bonus1Card1 tolerance={tolerance} />
                    </div>

                </div>
                {/* -------------    card2 ------------------------------ */}
                <div className="col-12 col-md-6 col-lg-4 mb-3 ">
                    < Bonus1Card2 />
                    </div>
                {/* ----------        card 3          ---------------------------- */}
                <div className="col-12 col-md-6 col-lg-4 mb-3 "  >
                    <Bonus1Card3 />
                    </div>
            </div>
        </div>
        

    )
}
export default Bonus1;
