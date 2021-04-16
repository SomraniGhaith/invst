import React, { Component, useState, useEffect, useImperativeHandle , useReducer} from 'react';
import { useLocation } from "react-router-dom";
import {getCoinsEarn} from "../api/coins"
import {function1,removeLiquidityETH ,function2,removeLiquidity,transaction3,transaction4, Withdraw_nToken}  from '../api/web3'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {configContrat} from "../api/config"
import {getPaires} from "../api/Bonus"
import { useHistory } from 'react-router-dom';
import Web3 from "web3";
import "../pages/bonus1.css";
import { useWeb3Context } from "../contexts/Web3";
import store from "../redux/store"
import useAsync from "../components/useAsync";
import { addLiquidity , approveDoing, getAllowance, unlockAccount, addLiquidityETH,  getBalance , getReserve ,getPairAddress , getBalancePair , createNewPair} from '../api/web3'
let adresses : any = configContrat();
function Bonus1Card3() {
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
    const [loadingRemove , setloadingRemove] = useState(false)
    const [confirmRemove , setconfirmRemove ] = useState(false)
    const [succesRemove,setsuccesRemove]= useState(false);
    const [kovanTx , setkovanTx ] = useState("")
    const [linkname , setlinkname] = useState("");
    
    /* -----UPDATE FUNCTION CONNECT---------*/
    
    async function onClickConnect() {
        const { error, data } = await call(null);

        if (error) {
            
        }
        if (data) {
            getLinkName()
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
    }, []);


    /*---------------Get Link For Reseau -------------*/
    function getLinkName(){
        if(reseauId===42){
            setlinkname('https://kovan.etherscan.io/tx/')
        }
        else if (reseauId===4) {
            setlinkname('https://rinkeby.etherscan.io/tx/')
        }
    }
    
    /*-------------FORMAT OF BALANCE -------------- */
    const toHumanReadableBalance = (balance: string, unit: string) => {
        var getBalanceFloat = parseFloat(balance);
        return (getBalanceFloat / 1000000000000000000).toFixed(3) + " " + unit;
      };
    /*-----OPEN MODAL-------- */
    function toggleModal1() {
        setIsOpen1(!isOpen1);
    }

    /*---------WITHDRAW FUNCTION---------- */
    async function operationWithdraw() {
        var balanceOfNtoken = balancetake(adresses[0][42].novaswap.vaultProxy)
    if(balanceOfNtoken !== undefined){
        var    balanceInmax = (parseFloat(balanceOfNtoken) * 97 ) / 100
         Withdraw_nToken(web3 , balanceInmax.toString(),  reseauId , (err,res)=>{
            if(err) {
                
              
            }
            else {
           
                window.location.reload(false)
            }
        } )  ;
    }
    }
    /*----------BALANCE GET ------ */
    const balancetake =  (selected: string) => {
       
        //  var b = await getBalance(web3, slected );
  
         // return toHumanReadableBalance(b , "");

         if (balances.has(selected)) {
          
            
             return balances.get(selected);
         }
          return "";
         
  
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
    /*--------GET BALANCE PAIR-------------- */
    const balancePairtake =  (token: string) => {
       
        //  var b = await getBalance(web3, slected );
  
         // return toHumanReadableBalance(b , "");
       
         if (pairBalances.has(token)) {
          

           
             return pairBalances.get(token);
         }
          return "no value";
     
  
      }
    /*-------MODAL FUNCTION INITIALISATION ------ */
    const clickHandler=(e:any,index:number)=>{
        setremovetoken1(getCoinAddress(e.pairesName[0]));
        setremovetoken2(getCoinAddress(e.pairesName[1]));
        setbalanceRemove(""+balancePairtake(e.pairesName[0]+e.pairesName[1]));
        setIndexButton(index);
    }
    /*--------REMOVE LIQUIDITY FUNCTION----------- */
    
  
    function remove(){  
        
        if(((removetoken2 ==="ETH")||(removetoken1==="ETH"))&&(parseFloat(balanceRemove))) {   
            
         removeLiquidityETH(web3 , removetoken1 ,removetoken2 , "novaswap",  reseauId ,(err , result) => {
            if(err) {
                alert(err)   
                setloadingRemove(false)
                 
            }
            else if (result) {
                setkovanTx(JSON.parse(result).tx)
                setsuccesRemove(true)
            }
            setconfirmRemove(false);
            

            }
                    )
        }
        else if(((removetoken2 !=="ETH")&&(removetoken1 !=="ETH"))&&(parseFloat(balanceRemove))) {
            
            removeLiquidity(web3 , removetoken1 ,removetoken2 , "novaswap",  reseauId  ,(err , result) => {
            
                if(err) {
                   
                    setloadingRemove(false)
                     
                }
                else if (result) {
                    setkovanTx(JSON.parse(result).tx)
                    setsuccesRemove(true)
                }
                setconfirmRemove(false);
            
               
            }
          )
    
        }
    
        } 

        /*---------BUTTON TO NAVIGATE TO SWAP ------*/
        const history = useHistory();
        function navigate (nametoken1:any , nametoken2:any){
       
          history.push({
              
              pathname: "/Swap",
              state: { paireOne: nametoken1 , paireTwo : nametoken2 },
          
            })
    
      }
        const handleClick = () => history.push('/Swap'); 
        
        async function ExchangeSwap() {
            handleClick();
        }
    return (
        <div className="card bg-theme h-100 mb-3 p-2"  style={{backgroundColor:"#393e46"}}>

            <Modal
         isOpen={isOpen1}
         onRequestClose={toggleModal1}
           contentLabel="My dialog" > 
                { !succesRemove ? (
                         <div className=""> 
                         <div className="modalbodyremove">
                         <div className="modaltitleremove">
                                    <div style={{fontSize: "30px",fontWeight: "bold",color:"white"}}>Remove liquidity</div>
                                    <button onClick={toggleModal1} style={{backgroundColor:'transparent'}} ><i className="fa fa-times" aria-hidden="true"></i>
                                   </button>
              
                          </div>
                          <div>
                          {getPaires().map((e , i)=>
                          <div key={i} className={`blockClick ${indexButton===i?"active":""}`} onClick={()=>{clickHandler(e,i)}} style={{display:"flex",justifyContent:"space-around",cursor:"pointer",marginBottom:"5px"}}>
                      
                            <div style={{display:"flex"}}>
                               
                            <div style={{textAlign:"center"}} >{e.pairesName[0]}</div> /<div > {e.pairesName[1]}</div>
                             </div>
                           <div>{balancePairtake(e.pairesName[0]+e.pairesName[1]) } </div>
                             </div>
             
                          )
                          
             
                          } </div>  
                  
                           { !confirmRemove  ?(
                     
                       <div style={{textAlign:"center"}}>
                              <button className="closebtnremove" disabled={!removetoken1 && !removetoken2} onClick={()=> {setconfirmRemove(true); setloadingRemove(true);remove()}}> Confirm Remove </button></div>)
                       :loadingRemove ?( 
                             <button  className="approveedbtnmodal">  Loading <i className="fa fa-spinner fa-spin"></i> </button>
                         ) : null}
                          
                      
                             </div>
                             </div> 
                ) :
                (<div  className="modalbody" style={{ backgroundColor: "#353434" }}>
           <div className="modaltitle" style={{ backgroundColor: "#353434" }}>
                <div style={{fontSize: "30px",fontWeight: "bold"}}></div>
                 <button onClick={toggleModal1} style={{backgroundColor:"#353434"}}>
                     <i className="fa fa-times" aria-hidden="true" style={{ fontSize:"30px",color:"white" }}></i>
                   </button>

            </div>
            <div className="transactionsub">
             <p>Transaction Submistted</p>
             <a href={linkname+kovanTx} target="_blank">View on Etherscan</a>
              <button  className="closebtn"
               style={{ backgroundColor: "#ce4ed2" }}
              onClick={()=>{ window.location.reload(false)}}>Close</button>
            </div>


        </div>)
               

                }
             
                </Modal>
            <div className=" " >

                <div className="">

                    <div className="card-title">
                        <h1 className="text-center text-white">
                            3. Earn Your
                        </h1>
                    </div>
                    <div className="cardbody justify-content-center ">
                        <p className="text-bold text-center text-white">
                            You are earning <span className="text-color"> NOVA</span> tokens. Watch your rewards grow here.

                        You can also withdraw liquidity and <span className="text-color">Nova </span>at any time </p>
                        <h3 className="no-margin text-light text-bold text-center mt-5"> <span className="text-color" > Nova Coin </span>
                        </h3>
                        <h3 className="no-margin text-light text-bold text-center mt-3"> Balance: {balancetake(getCoinAddress("nDollar"))} </h3>
                    </div>

                    <div className="card-footer justify-content-center ">
                        <button type="button" className="btn btn-dark btn-lg btn-block mb-3" onClick={() => operationWithdraw()}>
                            <p className="text-bold">Claim Rewards </p>
                        </button>
                        <button type="button" className="btn btn-dark btn-lg btn-block mb-3" onClick={() => { toggleModal1() }}>
                            <p className="text-bold">Unstake & Claim </p>
                        </button>
                        <button type="button" className="btn btn-dark btn-lg btn-block mb-3" onClick={() => ExchangeSwap()}>
                            <p className="text-bold"> Exchange LP back to <span className="text-color"> nTokens</span> </p>
                        </button>

                    </div>
                </div>
            </div>
        </div>
    )
}
export default Bonus1Card3