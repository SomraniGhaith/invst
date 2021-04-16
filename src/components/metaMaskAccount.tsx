import React, { useState, useEffect } from "react";
import { useWeb3Context } from "../contexts/Web3";
import Web3 from "web3"
import "./metamaskaccount.css"
import store from "../redux/store"
import WalletSwap from "./WalletSwap";
import {connectZilliqa,getZilAccount} from "../api/web3"


function MetaMaskAccount(props: any) {


    /* console.log("hi world ==> "+ (props.walletSelect)) */
    const { state: { account, netId, balance }, updateAccount } = useWeb3Context();
    const [networkName , setnetworkName] = useState("")
    const [web3, setWeb3] = useState(new Web3());
    const [showSetting,setshowSetting]= useState(props.showSetting)
    const [walletName , setWalletName ] = useState("");

       
   //redux
   //const [reseauId , setreseauId] = useState(parseFloat(""+store.getState().connection.networkId));  
    /*-------function get name network */

    //*------- use netId---------- */
    function getNetworkName(netId : number) {
       
       
        switch   ( netId.toString())   { 
           
            case   "1" : setnetworkName("Main"); 
              break ; 
            case   "2" :setnetworkName("Morden") ; 
             break ; 
            case   "3" :setnetworkName("Ropsten") ; 
              break ; 
            case   "4" :setnetworkName("Rinkeby") ; 
              break ; 
            case   "42" :setnetworkName("Kovan") ; 
              break ; 
            default : setnetworkName("Unknown") ; 
          } 
    }
    useEffect(() => {
        console.log("show stting"+showSetting)
        getNetworkName(netId)  
    }, [netId])
    function formAccount(x: String) {
        var str = x;
        var res1 = str.substring(0, 6);
        var res2 = str.substring(str.length - 4, str.length);
        var res = (res1.concat('...', res2)); 
        return (res)
    }
    const [tolerancevalue, settolerancevalue] = useState("1.1");


    
    /*  useEffect(() => {
         if(tolerancevalue) {
           localStorage.setItem("Tolerance" , tolerancevalue);
                       
         }
         
     }, [tolerancevalue] ) */

     function handerChange(e: React.ChangeEvent<HTMLInputElement>){
            settolerancevalue(e.target.value);
            props.transferTolerance(e.target.value)
     }
     
    return (
        <div className="traderbalence ">
           
            
            { props.walletSelect==undefined ||  props.walletSelect.name=="ETH" ? (
          
            <div className="balence">
                
                <span className="netid col-3"> {networkName}  </span>
                <span className="balance2 col-4">{store.getState().balances.value} {" ETH"}  </span>
                <span className="balanceaccount col-5">{formAccount(store.getState().balances.key)}</span>
            </div>
            ) :  props.zilliqa !=undefined && props.zilliqa.account !==null &&  props.walletSelect.name=="Zilliqa" ?
            (
                <div className="balence">
                <span className="netid col-3"> {props.zilliqa.netId}  </span>
                <span className="balance2 col-4">{props.zilliqa.balance} {props.walletSelect.symbol}  </span>
                <span className="balanceaccount col-5">{formAccount(props.zilliqa.accountBech32)}</span>
            </div>
            ) 
            : (
                <div className="balence">
                         <span className="netid col-3"> {networkName}  </span>
                <span className="balance2 col-4">{store.getState().balances.value} {props.walletSelect.symbol}  </span>
                <span className="balanceaccount col-5">{formAccount(props.walletSelect.account)}</span>
            </div>
            )

            }
            {showSetting ?( 
            <div className="settingbalence dropdown show">
                <a className="" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" > 
                <i className="fa fa-cog text-white" aria-hidden="true"></i></a>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuLink" style={{backgroundColor:"#393e46"}}>
                    <h4 style={{color:"white"}}>Transaction Settings</h4>
                    <h5 style={{color:"white"}}>Slippage tolerance</h5>
                    <div style={{ display: "flex", justifyContent: "space-around", margin: "10px" }}>
                        <button style={{ backgroundColor: "white", borderRadius: "5rem", padding: " 5px" }} onClick={() => { props.transferTolerance("0.1"); }}>0.1%</button>
                        <button style={{ backgroundColor: "white", borderRadius: "5rem", padding: " 5px" }} onClick={() => {props.transferTolerance("0.5"); }}>0.5%</button>
                        <button style={{ backgroundColor: "white", borderRadius: "5rem", padding: " 5px" }} onClick={() => { props.transferTolerance("1") }}>1%</button>
                        <input placeholder={tolerancevalue + "%"} type="number" onChange={(e) => { handerChange(e) }} style={{ borderRadius: "30px", width: "30%" }} />

                    </div>
                    
                    <h5 style={{color:"white"}}>Transaction deadline</h5>
                    <div style={{ display: "flex" }}>
                        <input style={{ width: "60px", borderRadius: "5rem", marginRight: "5px" }} />
                        <h5 style={{color:"white"}}>minutes</h5>
                    </div>

                </div>
            </div>):null}
           

        </div>

    );

}
export default MetaMaskAccount
