import React, { Component, useState, useEffect, useImperativeHandle , useReducer} from 'react';
import {getPaires} from "../api/Bonus"
import { useHistory } from 'react-router-dom';
import Web3 from "web3"
import { addLiquidity , approveDoing, getAllowance, unlockAccount, addLiquidityETH,  getBalance , getReserve ,getPairAddress , getBalancePair , createNewPair} from '../api/web3'
import "../pages/bonus1.css";
import { useWeb3Context } from "../contexts/Web3";
import useAsync from "../components/useAsync";
import { useLocation } from "react-router-dom";
import {configContrat} from "../api/config"
import {getCoinsEarn} from "../api/coins"
import store from "../redux/store";
import {setPairs} from "../redux/actions"

let adresses : any = configContrat();
function Bonus1Card2(){
   /*------NAVIGATE TO SWAP--------- */ 
   const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
   const [web3, setWeb3] = useState(new Web3());
   const [balances , setBalances ] = useState(new Map<string,string>())
   //redux
   const [reseauId , setreseauId] = useState(parseFloat(""+store.getState().connection.networkId)); 
   const [isOpen1, setIsOpen1] = useState(false);
   const [pairBalances , setPairBalances ] = useState(new Map<string,string>())
   const [addressOfPair , setaddressOfPair] = useState(new Map<string,string>())
   const [removetoken1, setremovetoken1] = useState("");
   const [removetoken2, setremovetoken2] = useState("");
   const [balanceRemove , setbalanceRemove] = useState("");
   const [isslected,setisslected]=useState(false);
   const [indexButton,setIndexButton]=useState(-1);
   const [allowances , setAllowance ] = useState(new Map<string,string>())
   const { state: { account, netId, balance }, updateAccount } = useWeb3Context();
   const { pending, error, call } = useAsync(unlockAccount);
   const location = useLocation();
   /* -----UPDATE FUNCTION CONNECT---------*/
   
   async function onClickConnect() {
       const { error, data } = await call(null);

       if (error) {
           
       }
       if (data) {
           
           setWeb3(data.web3);
           if( adresses[0][reseauId].novaswap.vaultProxy) {
               getBalance(data.web3 , adresses[0][reseauId].novaswap.vaultProxy ,  reseauId ,
                   (error , b) => {
                       if (error) {
                       
                           return;
                       }
                     
                       if (b) {
                       
                        balances.set(adresses[0][42].novaswap.vaultProxy ,  toHumanReadableBalance(b.toString() , ""))
                       // console.log("Proxy" + " Balance :" +   toHumanReadableBalance(b.toString() , "") )
                       
                     }
                   });
           }
           getCoinsEarn(reseauId).map(
               coin => {
                  
                   getBalance(data.web3 , coin.address ,  reseauId ,
                       (error , b) => {
                           if (error) {
                               return;
                           }
                    
                           if (b) {
                            balances.set(coin.address ,  toHumanReadableBalance(b.toString() , ""))   
                           }
                       });
                       if (coin.address !== "ETH") {
                           getAllowance(data.web3 , coin.address, "novaswap" ,  reseauId ,
                               (error , b) => {
                                   if (error) {
                                   
                                       return;
                                   }
                                 
                                   if (b) {
                                    allowances.set(coin.address ,  toHumanReadableBalance(b.toString() , ""))   
                                 }
                           });
                           }

                
                      { 
                          
                       getPaires().map((pair) => (

                         getPairAddress(data.web3, getCoinAddress(pair.pairesName[0]), getCoinAddress(pair.pairesName[1]), "novaswap", reseauId , (err , pairaddress) => {
                               if (err) {                                
                                  
                               }
                                else {
                                    console.log(pair.pairesName[0].toUpperCase()+pair.pairesName[1].toUpperCase()+pairaddress+"karimaaaaaaaaa")
                                    const pairs={"nameToken0":pair.pairesName[0].toUpperCase(),"nameToken1":pair.pairesName[1].toUpperCase(),"adressPair":pairaddress};
                                 //   store.dispatch(setPairs(pairs));
                                   addressOfPair.set(pair.pairesName[0]+pair.pairesName[1] , ""+pairaddress)
                                   
                                  // @ts-ignore  
                                   getBalancePair(data.web3 , ""+pairaddress , (err , balance) => {
                                       if (!err) {
                                         //  alert(balance);
                                          // @ts-ignore
                                           
                                           pairBalances.set(pair.pairesName[0]+pair.pairesName[1], toHumanReadableBalance(balance.toString() , ""))
                                         
                                           setPairBalances(pairBalances);
                                           forceUpdate()
                                           
                   
                                           
                                       } else {
                                           
                                          return ;
                                       }
                                   });  
                                   }
                               }
                           ) 
                       )
                       )
                    }             
               }
           )
           //    setAccount({account: data.account , balance: balance });
           updateAccount(data);
       }
   }

   useEffect(() => {
       onClickConnect();
   }, [pairBalances]);
       /*-------------FORMAT OF BALANCE -------------- */
       const toHumanReadableBalance = (balance: string, unit: string) => {
        var getBalanceFloat = parseFloat(balance);
        return (getBalanceFloat / 1000000000000000000).toFixed(3) + " " + unit;
      };
/*-----NAVIGATE TO SWAP----------- */

   const history = useHistory();
   function navigate (nametoken1:any , nametoken2:any){
  
     history.push({
         
         pathname: "/Swap",
         state: { paireOne: nametoken1 , paireTwo : nametoken2 },
     
       })

 }
    async function bonusCard2Transaction1( pair : string) {

        navigate(pair , "nDollar")
        

    }
 
/*-----GET BALANCE OF PAIR  ----------- */
    const balancePairtake =  (token: string) => {
       
        //  var b = await getBalance(web3, slected );
  
         // return toHumanReadableBalance(b , "");
       
         if (pairBalances.has(token)) {
          

           
             return pairBalances.get(token);
         }
          return "no value";
     
  
      }
           /*---------GET COIN ADDRESS BY NAME---------- */
           const getCoinAddress = (name : string) => {

            for (let coin of   getCoinsEarn(reseauId)) {
                if(coin.name===name){
                return coin.address
                }
            }
            return "default";
            
        }
    return(
        
             <div className="col-12 card bg-theme h-100 mb-3 p-2" style={{backgroundColor:"#393e46"}}>

<div className="">
    <div className="card-title justify-content-center ">
        <h1 className="text-center text-white">
            2. Stake LP token
    </h1>

    </div>
    <div className="cardbody justify-content-center ">
        <p className="text-bold text-center text-white">
            LP tokens represent your share in the pool, now assign it to our reward contract</p>
      {/*   <h3 className="no-margin text-light text-bold text-center mt-5"  onClick={() => bonusCard2Alert()}> Fonction 1 </h3> */}
       
        <div className="pairmlist">
        <h3 className="no-margin text-light text-bold text-center mt-3 mb-5"> <span className="text-color">NOVA </span> / </h3>
     
        {getPaires().map(
        
        (e,i) => {
                                           
            //console.log(e.pairesName[0]+e.pairesName[1]+ " addres "+ JSON.stringify(addressOfPair))

        let balance = parseFloat("" +balancePairtake(e.pairesName[0]+e.pairesName[1]));
       
        if (balance){
           
        return (
         

    
        <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",cursor: "default"}}>
            
<div className="">     <h2 className="text-color" style={{fontSize:"18px",cursor: "default"}}>{e.pairesName[0]} /{e.pairesName[1]}  </h2>  </div> 
<div  className="">      <h2 className="text-color"  style={{fontSize:"18px",cursor: "default"}}>{balancePairtake(e.pairesName[0]+e.pairesName[1]) } </h2> </div>

<div className="">       <button type="button" className="btn btn-dark btn-lg btn-block mb-3" style={{width:"100%"}} onClick={() => bonusCard2Transaction1(""+e.pairesName[0]+e.pairesName[1])}>Assign </button></div>
      </div>
    
    ) }
            else return (<>  </>)
})

    }
        
        
        </div>

 
 
 
 
     </div>


   {/*  <div className="card-footer justify-content-center mt-12 ">


        <button type="button" className="btn btn-dark btn-lg btn-block mb-3" onClick={() => bonusCard2Transaction1()}> <p className="text-bold">Assign LP tokens </p></button>

    </div> */}
</div>
</div>
        
    )
}
export default Bonus1Card2