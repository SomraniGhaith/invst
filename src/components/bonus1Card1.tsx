import React, { Component, useState, useEffect, useImperativeHandle , useReducer} from 'react';
import "../pages/bonus1.css";
import { useWeb3Context } from "../contexts/Web3";
import { addLiquidity , approveDoing, getAllowance, unlockAccount, addLiquidityETH,  getBalance , getReserve ,getPairAddress , getBalancePair , createNewPair} from '../api/web3'

import { useLocation } from "react-router-dom";
import {getPaires} from "../api/Bonus"
import useAsync from "../components/useAsync";
import Web3 from "web3";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {getlogo} from '../api/logo'
import {getCoinsEarn} from "../api/coins"
import { useHistory } from 'react-router-dom';
import {configContrat} from "../api/config"
import store from "../redux/store";
let adresses : any = configContrat();
const bn = require("bn.js");
function Bonus1Card1(props:any) {
    const[tolerance , setTolerance] = useState(props.tolerance)
    const[amountMinToken1 , setamountMinToken1] = useState("")
    const[amountMinToken2 , setamountMinToken2] = useState("")
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const [isOpen, setIsOpen] = useState(false);
    const [web3, setWeb3] = useState(new Web3());
    const [loadingCreatePair , setloadingCreatePair] = useState(false)
    const location = useLocation();
    const [coinName1 , setcoinName1 ] = useState(!location.state ? "" :  JSON.parse(JSON.stringify(location.state)).paireOne );
    const [coinName2 , setcoinName2 ] = useState(!location.state ? "" :  JSON.parse(JSON.stringify(location.state)).paireTwo );
    const [loadingsupply,setloadingsupply]= useState(false);
    const [loadingapprove,setloadingapprove]= useState(false);
    const [loadingapprove2,setloadingapprove2]= useState(false);
    const [isOpen1, setIsOpen1] = useState(false);
    const [confirmsuplly, setconfirmsuplly] = useState(false);
    //redux
    const [reseauId , setreseauId] = useState(parseFloat(""+store.getState().connection.networkId)); 
    const [allowances , setAllowance ] = useState(new Map<string,string>())
    const [{reserve1 , reserve2}, updateReserve] = useState({reserve1: "" , reserve2: ""});
    const [balances , setBalances ] = useState(new Map<string,string>())
    const [kovanTx , setkovanTx ] = useState("")
    const [{ token1mustBeApproved,
        token1IsApproved }, setAprov1] = useState({ token1mustBeApproved: false, token1IsApproved: false });
    const [{ token2mustBeApproved,
        token2IsApproved }, setAprov2] = useState({ token2mustBeApproved: false, token2IsApproved: false });
    const { state: { account, netId, balance }, updateAccount } = useWeb3Context();
    const { pending, error, call } = useAsync(unlockAccount);
    const [successApprove1,setsuccessApprove1]= useState(false);
    const [successApprove2,setsuccessApprove2]= useState(false);
    const [input1, setInput1] = useState("");
    const [input2, setInput2] = useState("");

   const [pairBalances , setPairBalances ] = useState(new Map<string,string>())
   const [addressOfPair , setaddressOfPair] = useState(new Map<string,string>())
   const [successCreatePair,setsuccessCreatePair]= useState(false);

     /* ------------*/
    var paireName: any[] = []
    
    getPaires().map((val) => (

        val.pairesName.map((name) =>(
            
            paireName.push(name)          
     ))
    ))
    setTimeout(() => {
        
         paireName.filter((item,index)=>paireName.indexOf(item)===index)
      //  console.log("arr "+arrFiltered)
    }, 1000);
    /* ----- GET COIN NAME & ADDRESS-------*/
    const [succesSupply,setsuccesSupply]= useState(false);
  
    
 
    const getCoinName1 = (address : string) => {
   
        getCoinsEarn(reseauId).map(
            coin => { if(coin.address===address){
                setcoinName1(coin.name)
            }
                 }
        )

    }
    

    const getCoinAddress = (name : string) => {

        for (let coin of   getCoinsEarn(reseauId)) {
            if(coin.name===name){
            return coin.address
            }
        }
        return "default";
        
    }
    const getCoinName2 = (address : string) => {

        getCoinsEarn(reseauId).map(
            coin => { if(coin.address===address){
                setcoinName2(coin.name)
            }
                 }
        )

    }
    /**-------CLOSE ADD LIQUIDITY---------- */
    function closeAddLiquidity(){
   
        
            setInput1("")
            setInput2("")
            setconfirmsuplly(false)
            getReserveLiquidity(web3, selected2, selected1);
            setsuccessApprove1(false)
            setsuccessApprove2(false)
            setsuccesSupply(false)
            setIsOpen(false)
    }
    /*-------SET SELECT -----*/
    const [selected1, setSelected1] =  
    useState(!location.state ? "default" : 
   getCoinAddress(JSON.parse(JSON.stringify(location.state)).paireOne));
  const [selected2, setSelected2] =
   useState(!location.state ? "default" : getCoinAddress(JSON.parse(JSON.stringify(location.state)).paireTwo)); // second currency
/*----------MODAL----------------- */
function toggleModal() {
    setIsOpen(!isOpen);
}

function toggleModal1() {
    setIsOpen1(!isOpen1);
}
/*-------------------------------- */

    function createPair(token1 : string , token2 : string) {
        createNewPair(web3,token1,token2 , "novaswap",  reseauId ,(err , result) => {
            if (err) {
                setloadingCreatePair(false)
                
            
            }
             else {
                setloadingCreatePair(false)
                setsuccessCreatePair(true)
                getReserveLiquidity(web3,selected1,selected2)
             }
        });
        
       
    }
    function inverseInputSelect() {
    
        setSelected1(selected2)
        setSelected2(selected1)
        setInput1(input2)
        setInput2(input1)
        getReserveLiquidity(web3 , selected1 , selected2 )
        setcoinName1(coinName2)
        setcoinName2(coinName1)
     
    }
    const history = useHistory();
    function navigate (nametoken1:any , nametoken2:any){
   
      history.push({
          
          pathname: "/Swap",
          state: { paireOne: nametoken1 , paireTwo : nametoken2 },
      
        })

  }
  /*------------APPROVE ---------- */
  function doApprove1() {
    approveDoing(web3, selected1, input1, "novaswap",  reseauId , (err , result) => {
        if (err) {
          //  alert(JSON.stringify(err));
            setloadingapprove(false)
            setloadingapprove2(false)
        }
         else {
           //  alert(result);
             setsuccessApprove1(true)
             setloadingapprove(false)
             setloadingapprove2(false)

         }
    });
}
function doApprove2() {
    approveDoing(web3, selected2, input2,"novaswap",  reseauId , (err , result) => {
        if (err) {
           
            setloadingapprove(false)
            setloadingapprove2(false)
        }
         else {
            // alert(result);
             setsuccessApprove2(true)
             setloadingapprove(false)
             setloadingapprove2(false)

         }
    });
}


function approveButtonVisible1() {
 
    var condition =  (allowances.get(selected1)) && ( parseFloat("" + allowances.get(selected1)) <  parseFloat(input1));
   ;
   return token1mustBeApproved  && condition

}
function approveButtonVisible2() {
 
    var condition =  (allowances.get(selected2)) && ( parseFloat("" + allowances.get(selected2)) < 
    parseFloat(input2));
   ;
   return token2mustBeApproved  && condition

}
/*-------------SUPPLY ADD LIQUIDITY------------------- */
async function onClickSupply() {
    
    
    if((selected2 != "ETH")&&(selected1 != "ETH")) {
      
    return addLiquidity(web3, selected1, selected2, input1, input2, reseauId,(err , result) => {
        //callbcack its funtion fo what we do then
        if (err) {
           // alert(err)
            setloadingsupply(false)
        }
         else if (result) {
                setkovanTx(JSON.parse(result).tx)
                setsuccesSupply(true)
                }
        setconfirmsuplly(false)
    });
}
else    {
   
    // @ts-ignore
return addLiquidityETH(web3, selected1, selected2, input1, input2, reseauId, (err , result) => {
    
    //callbcack its funtion fo what we do then
    if (err) {
      
        setloadingsupply(false);
      //  alert(err)
       
    }
     else {
         if (result)
        
            setkovanTx(JSON.parse(result).tx)
            setsuccesSupply(true)
     }
     setconfirmsuplly(false)
});
}

}
/*------------GET RESERVE ------------------------ */
function getReserveLiquidity(web3: Web3 , token1 : string , token2: string) {
    //   alert(token1);
     //  alert(token2);
       updateReserve({reserve1: "loading .." , reserve2: "loading .."});
       
       getReserve(web3, token1, token2, "novaswap",  reseauId , (err , result) => {
           //callbcack its funtion fo what we do then
           if (err) {
               updateReserve({reserve1: "--" , reserve2: "--"});
           }
           else {
               var reserves =result ?  JSON.parse(result) : {};
               if (reserves["0"] && reserves["1"]) {
                  
                   var val = new bn(reserves["0"] , 16);
                 
                   var val2 = new bn(reserves["1"] , 16);

           //       if(token1.toLowerCase()<token2.toLowerCase()){
                   updateReserve({reserve1: toHumanReadableBalance(val , "") , reserve2:  toHumanReadableBalance(val2 , "") });
            //   }
            //       else {
             //      updateReserve({reserve1: toHumanReadableBalance(val2 , "") , reserve2:  toHumanReadableBalance(val , "") });
             //  }
               } else {
                   updateReserve({reserve1: "--" , reserve2: "--"});
               }
                 
           }
           });
   }
   /*--------BALANCE GET--------------------------- */
   const balancetake =  (selected: string) => {
       
    //  var b = await getBalance(web3, slected );

     // return toHumanReadableBalance(b , "");

     if (balances.has(selected)) {
      
        
         return balances.get(selected);
     }
      return "";
     

  }
  /*------BALANCE PAIR GET ---------*/

    /*-----------FUNCTION CONNECT WALLET UPDATER----------------*/ 
    async function onClickConnect() {
        const { error, data } = await call(null);
        let newBalances = new Map<string, string>();
    //    let newAllownces = new Map<string, string>();
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
                   
                    getBalance(data.web3, coin.address, reseauId, (error, b) => {
                        if (error) {
                          return;
                        }
                        if (b) {
                          newBalances.set(coin.address, toHumanReadableBalance(b.toString(), ""));
                          forceUpdate()
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
                                        forceUpdate()
                                  }
                            });
                            }

                        if (location.state) {
                            getReserveLiquidity(data.web3,
                                
                                getCoinAddress( JSON.parse(JSON.stringify(location.state)).paireOne ) ,
                                getCoinAddress(JSON.parse(JSON.stringify(location.state)).paireTwo));
                           // alert("haha here there is state, youuupiii" + JSON.stringify(location.state));
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
            setBalances(newBalances)
            //setAllowance(newAllownces)
            updateAccount(data);
        }
    }

    useEffect(() => {
        onClickConnect();
         setTolerance(!(props.tolerance) ? "1.1" : props.tolerance )
    },  [input1, reserve1 ,reserve2, input2, tolerance, props.tolerance , selected1 , selected2 , confirmsuplly]);;


    /*-------------FORMAT OF BALANCE -------------- */
    const toHumanReadableBalance = (balance: string, unit: string) => {
        var getBalanceFloat = parseFloat(balance);
        return (getBalanceFloat / 1000000000000000000).toFixed(3) + " " + unit;
      };
    /*--------FORMAT ACCOUNT SHOW --------------- */
    function formAccount(x: String) {
        var str = x;
        var res1 = str.substring(0, 6);
        var res2 = str.substring(str.length - 4, str.length);
        var res = (res1.concat('...', res2));
        return (res)
    }
    /*---STORE INPUTS----- */
    
    function handerValue1(e: React.ChangeEvent<HTMLInputElement>) {
         
        setInput1(e.target.value);
      
      /*   var x1 = parseFloat(reserve1);
        var x2 = parseFloat(reserve2);
        var y = parseFloat(e.target.value);

        if ((x1>0) && (x2>0) && (y>0) ) {
            setInput2("" + (x2 * y / x1));
           
        }   */
    }
    function handerValue2(e: React.ChangeEvent<HTMLInputElement>) {

        setInput2(e.target.value);
  
  /*     
        var x1 = parseFloat(reserve1);
        var x2 = parseFloat(reserve2);
        var y = parseFloat(e.target.value);

        if ((x1>0) && (x2>0) && (y>0) ) { 
          setInput1("" + (x1 * y / x2));
        }   */
         
    }
    /*-----BALANCE CONDITION CHECK---------- */
    function checkbalance(input1: string, testBalance: string) {
        
        var x = parseFloat(input1);
        // @ts-ignore
       var  b = parseFloat(balancetake(testBalance))
  
        if ((x > b) || (b===0)) {
            return true
        } else {

            return false
        }
     }
     
 
     /*-----Calcul Min of tokens */ 
     function calculMin(){
        if(input1) {
            var amount1 = parseFloat(input1)
            var t= parseFloat(tolerance)/100
            var cof = amount1 * t
            var res = amount1-cof
            setamountMinToken1(res.toString()) 
        }
        if(input2) {
            var amount2 = parseFloat(input2)
            var t= parseFloat(tolerance)/100
            var cof = amount2 * t
            var res = amount2-cof
            setamountMinToken2(res.toString())    
        }
     }
     /*------ Confirm Supply ------ */
     function supplyClick(){
        calculMin();
        onClickSupply();
        setconfirmsuplly(true);
        setloadingsupply(true);
     }

     useEffect(() => {
      
    }, [input1])

    useEffect(() => {
     
    }, [input2])


      useEffect(() => {

     }, [selected1])
     useEffect(() => {

     }, [selected2]);
     useEffect(() => {
  
     }, [ kovanTx])
    return (
       <div>

           
        <Modal
        isOpen={isOpen}
        onRequestClose={toggleModal}
          contentLabel="My dialog" > 
          {!succesSupply?(
           <div className="modalbody" style={{color:"white"}}>
           
            <div className="modaltitle">
                <div style={{fontSize: "30px",fontWeight: "bold"}}>Confirm Add liquidity</div>
                 <button onClick={toggleModal} style={{backgroundColor:"transparent",fontSize:"32px"}}><i className="fa fa-times" aria-hidden="true"></i>
                   </button>

            </div>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize: "24px",fontWeight: 500,margin:"2rem",fontFamily:"Open Sans"}}>{
              input1.includes(".") ? input1.substring(0,input1.indexOf(".")+4) : input1
              }</span>
              <span style={{fontSize: "24px",fontWeight: 500,margin:"2rem",fontFamily:"Open Sans"}}>{coinName1}</span>

           </div>

            <div style={{display:"flex",justifyContent:"center"}}>
            <i className="fa fa-arrow-down" aria-hidden="true"></i>
            </div>
              <div style={{display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize: "24px",fontWeight: 500,margin:"2rem",fontFamily:"Open Sans"}}>{
                input2.includes(".") ? input2.substring(0,input2.indexOf(".")+4) : input2}
                </span>
              <span style={{fontSize: "24px",fontWeight: 500,margin:"2rem",fontFamily:"Open Sans"}}>{coinName2}</span>

           </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop:"3rem" }}>
                        <span style={{ fontSize: "24px", fontWeight: 500,  fontFamily: "Open Sans" }}>Price </span>
                        <span style={{ fontSize: "20px", fontWeight: 500, fontFamily: "Open Sans" }}>{     
      input2.includes(".") ? input2.substring(0,input2.indexOf(".")+4) : input2} {coinName2}/
      {      input1.includes(".") ? input1.substring(0,input1.indexOf(".")+4) : input1}{coinName1}</span>

             </div>

             <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "24px", fontWeight: 500,  fontFamily: "Open Sans" }}>Minimum received </span>
                <span style={{ fontSize: "24px", fontWeight: 500, fontFamily: "Open Sans" }}>109.7 {coinName2}</span>

             </div>

                  <div style={{ display: "flex", justifyContent: "space-between"}}>
                        <span style={{ fontSize: "24px", fontWeight: 500,  fontFamily: "Open Sans" }}>Price Impact </span>
                       <span style={{ fontSize: "24px", fontWeight: 500, fontFamily: "Open Sans" }}>0.21%</span>

                    </div>
                 <div style={{ display: "flex", justifyContent: "space-between"}}>
                        <span style={{ fontSize: "24px", fontWeight: 500,  fontFamily: "Open Sans" }}>Liquidity Provider Fee </span>
         <span style={{ fontSize: "24px", fontWeight: 500, fontFamily: "Open Sans" }}>0.003 {coinName1}</span>

                 </div>


            { !confirmsuplly ?(
            <button className="approvebtnmodal" onClick={() =>{ supplyClick() } }>
                Confirm Add Liquidity 
                
            </button>):
             loadingsupply ?( 
                <button  className="approveedbtnmodal">  Loading <i className="fa fa-spinner fa-spin"></i> </button>
            ) : null}


        </div>)
        :(<div  className="modalbody" style={{ backgroundColor: "#353434" }}>
           <div className="modaltitle" style={{ backgroundColor: "#353434" }}>
                <div style={{fontSize: "30px",fontWeight: "bold"}}></div>
                 <button onClick={toggleModal} style={{backgroundColor:"#353434"}}><i className="fa fa-times" aria-hidden="true" style={{ fontSize:"30px",color:"white" }}></i>
                   </button>

            </div>
            <div className="transactionsub">
             <p>Transaction Submitted</p>
             <a href={'https://kovan.etherscan.io/tx/'+kovanTx} target="_blank">View on Etherscan</a>
             <button 
              style={{ backgroundColor: "#ce4ed2" }}
             className="closebtn" onClick={()=>{ 
                closeAddLiquidity()
            }
                 }>Close</button>

         
            </div>


        </div>) }
        

           </Modal>

           <div className="carditemliquidity ">
                    
                    <div className="balencefrom">

                        <div>
                            <p style={{ fontWeight: "bold", fontSize: "16px", color: "rgb(206 208 212)" }}>Input </p>
                            <input className="addbalence"   type="text" pattern="^[0-9]*[.,]?[0-9]*$" placeholder="0.0" value={input1} onChange={handerValue1} />
                            <p style={{ fontSize: "10px", color: "red" }}>
                    {" "}
                    { 
                    parseFloat(""+allowances.get(selected1))>0
                      ? allowances.get(selected1) + ""
                      : ""}{" "}
                  </p>
                        </div>

                        <div>
                            <p style={{ fontWeight: "bold", fontSize: "14px",color :"gray" }}>Balance: {balancetake(selected1)}</p>

                            <div className="select-sim" id="select-color">

                                <select className="select-sim" id="select-color" value={selected1} onChange={(
                                    ev: React.ChangeEvent<HTMLSelectElement>,
                                ): void => {


                                    setSelected1(ev.target.value);
                                    getCoinName1(ev.target.value);


                                    if (ev.target.value !== "ETH") {
                                        setAprov1({ token1mustBeApproved: true, token1IsApproved: false });
                                    }
                                    else
                                        setAprov2({ token2mustBeApproved: true, token2IsApproved: false })

                                    balancetake(ev.target.value.toString())
                                    if((ev.target.value != selected2)&&(selected2!=="default"))
                                    {getReserveLiquidity(web3 , ev.target.value  , selected2 );}
                                              ///////////////
                                            /*   if(input1.length){
                                                setInput1(input1);
 
                                                var x1 = parseFloat(reserve1); // reserva 1 
                                                var x2 = parseFloat(reserve2); // reserve 2 
                                                var y = parseFloat(input1); // input amount1
                                        
                                                if ((x1>0) && (x2>0) && (y>0) ) {
                                                    setInput2("" + (x2 * y / x1)); // result of amount 2 
                                                   
                                                } 
                                            } */
                                           

                                }
                                }>
                                     <option className="options" value="default">Select a token</option>

                                    {
                                        getCoinsEarn(reseauId).map(
                                            (t,i) => <> <option key={i} className="options" value={t.address}>{t.name} {t.ticker}</option> </>
                                        )
                                    }

                                </select>
                            </div>
                        </div>

                    </div>

                    {((selected2!=="default") && (selected1 !==" default") )? (
                        <div style={{ color: "blue", display: "flex", justifyContent: "center", padding: 5, marginTop: "5%" }}>
                            <button onClick = {()=> inverseInputSelect()}  style={{backgroundColor:'transparent',color:"#0960e2"}}   >   
                                <i className="fa fa-arrow-down" aria-hidden="true"></i> </button> 
                        </div> ) :
                        (  <div style={{ color: "blue", display: "flex", justifyContent: "center", padding: 5, marginTop: "5%" }}>
                        <button disabled   style={{backgroundColor:'transparent',color:"#0960e2"}}>       <i className="fa fa-arrow-down" aria-hidden="true"></i> </button> 
                    </div>  )
                        }

                    <div className="balencefrom">
                        <div>
                    <p style={{ fontWeight: "bold", fontSize: "16px", color: "rgb(206 208 212)" }}>Input</p>
                            <input className="addbalence" type="text" pattern="^[0-9]*[.,]?[0-9]*$" placeholder="0.0" value={input2} onChange={handerValue2} />
                            <p style={{ fontSize: "10px", color: "red" }}>
                    {" "}
                    { 
                    parseFloat(""+allowances.get(selected2))>0
                      ? allowances.get(selected2) + ""
                      : ""}{" "}
                  </p>
                        </div>

                        <div>
                            <p><span style={{ fontWeight: "bold", fontSize: "14px", color :"gray"  }}>Balance:{balancetake(selected2)}</span></p>
                            <div className="select-sim" id="select-color">

                                <select className="select-sim" id="select-color" value={selected2} onChange={(
                                    ev: React.ChangeEvent<HTMLSelectElement>,
                                ): void => {
                                    setSelected2(ev.target.value);
                                    getCoinName2(ev.target.value);
                                    if (ev.target.value !== "ETH") {
                                        setAprov2({ token2mustBeApproved: true, token2IsApproved: false });
                                    }
                                    else
                                        setAprov1({ token1mustBeApproved: true, token1IsApproved: false })

                                    balancetake(ev.target.value.toString());
                                    if(ev.target.value != selected1) {
                                        getReserveLiquidity(web3, ev.target.value  , selected1); }
                                                  ///////////////
                                           /*        if(input1.length){
                                                    setInput1(input1);
     
                                                    var x1 = parseFloat(reserve1); // reserva 1 
                                                    var x2 = parseFloat(reserve2); // reserve 2 
                                                    var y = parseFloat(input1); // input amount1
                                            
                                                    if ((x1>0) && (x2>0) && (y>0) ) {
                                                        setInput2("" + (x2 * y / x1)); // result of amount 2 
                                                       
                                                    } 
                                                } */
                                               
                                    

                                }
                                }>

                                    <option className="options" value="default">Select a token</option>
                                    {
                                        getCoinsEarn(reseauId).map(
                                            (t,i) => <> <option key={i} className="options" value={t.address}>{t.name} {t.ticker}</option> </>
                                        )
                                    }

                                </select>
                            </div>
                        </div>

                    </div>
                    <div style={{ color: "white", display: "flex", justifyContent: "space-between", padding: 10 }}>
                                    <p style={{ fontWeight: "bold", fontSize: "16px", color: "rgb(206 208 212)" }}>Slippage Tolerance </p>
                                    <p style={{ fontSize: "20px", fontWeight: 500, fontFamily: "Open Sans" }}>{tolerance}%</p>
                     </div>
                    <div style={{ color: "white", display: "flex", justifyContent: "space-between", padding: 10 }}>
                        <p style={{ fontWeight: "bold", fontSize: "16px", color: "rgb(206 208 212)" }}>Reserve {coinName1} </p>
                        <p style={{ fontWeight: "bold", fontSize: "16px", color: "rgb(206 208 212)" }}>{reserve1}</p>
                    </div>
                    <div style={{ color: "white", display: "flex", justifyContent: "space-between", padding: 10 }}>
                        <p style={{ fontWeight: "bold", fontSize: "16px", color: "rgb(206 208 212)" }}>Reserve {coinName2} </p>
                        <p style={{ fontWeight: "bold", fontSize: "16px", color: "rgb(206 208 212)" }}>{reserve2}</p>
                    </div>



                    {              // Reserve is null go create Pair
                         /*----------------------------------------------------------------------*/
                                 (selected2 == "default" ) ?
                                (<div className="amount" >Select a token</div>)
                                : (selected2==selected1) ?
                                (<div className="amount" >Select different token </div>):
                                 (reserve1==="--")&&(reserve2 === "--")?(
                                 (!loadingCreatePair) ?(
                                    <button className="amount" onClick={()=> {createPair(selected1 , selected2);setloadingCreatePair(true)} }> Create New Pair </button>):
                                    (<div className="amount">loading <i className="fa fa-spinner fa-spin"></i></div>)
                                   
                                ): 

                       /*----------------------------------------------------------------------*/

                       ((!input1.length) || (parseFloat(input1) <=0)) || ((!input2.length) || (parseFloat(input2) <=0))? 
                     (<div className="amount" >
                        Enter an amount </div>)
                        : (selected2 == "default")?
                            (<div className="amount" >Select a token</div>)
                            : (selected2==selected1) ?
                                 (<div className="amount" >Select different token </div>)
                                 : (checkbalance(input1, selected1)) ?
                                (<div className="amount"> Insufficient  {coinName1} balance </div>)
                                : (checkbalance(input2, selected2)) ?
                                    (<div className="amount"> Insufficient  {coinName2} balance </div>)
                                 
                                        
                                     : (selected1 !== "ETH") && (selected2 === "ETH") ? (
                                        approveButtonVisible1() ?  ( 
                                            <div style={{ display: "flex",   justifyContent: "space-around" }}>
                                            {!loadingapprove? 
                                 ( 
                                      (successApprove1) ? 
                                      <button className="appovedbtn " disabled > Approved {coinName1} </button> 
                                       :
                                       <button className="approvebtn col-6" onClick={() =>{ doApprove1();setloadingapprove(true);}}  >
                                       Approve {coinName1}
                                  </button>)
                                  :(<div className="approvebtn ">Loading <i className="fa fa-spinner fa-spin"></i></div>)}

                                      {(((!successApprove1))) ?
                                          (<> 
                                              <button disabled className="swapbtn " >
                                                  Supply
                                          </button>
                                          </>)
                                         : (<button onClick={toggleModal} className="swapbtnapprov" >Supply</button>)}



                                  </div>
                                       
                                        ) : (<div style={{  display: "flex", justifyContent: "center" }}>
                                        <button onClick={toggleModal}  className="swapbtnapproveth col-10" >Supply</button></div>)


                                    )
                                        : (selected1 === "ETH") && (selected2 !== "ETH") ? (
                                            approveButtonVisible2() ? (
                                                <div style={{ display: "flex",   justifyContent: "space-around" }}>
                                                {!loadingapprove? 
                                     ( 
                                          (successApprove2) ? 
                                          <button className="appovedbtn " disabled > Approved {coinName2} </button> 
                                           :<button className="approvebtn" onClick={() =>{ doApprove2();setloadingapprove(true);}}  >
                                            Approve {coinName2}
                                      </button>)
                                      :(<div className="approvebtn ">Loading <i className="fa fa-spinner fa-spin"></i></div>)}

                                          {(((!successApprove2))) ?
                                              (<> 
                                                  <button disabled className="swapbtn " >
                                                      Supply
                                              </button>
                                              </>)
                                               : (<button onClick={toggleModal} className="swapbtnapprov" >Supply</button>)}



                                      </div>


                                            ) :
                                             (<div style={{  display: "flex", justifyContent: "center" }}>
                                            <button onClick={toggleModal}  className="swapbtnapproveth" >Supply</button></div>)


                                        ) 

                                            : (selected1!=="ETH")&&(selected2!="ETH") ?
                                            (  approveButtonVisible1()  && ! approveButtonVisible2() ?
                                            (
                                                <div style={{ display: "flex",   justifyContent: "space-around" }}>
                                                {!loadingapprove? 

                                     ( 
                                          (successApprove1) ? 
                                          <button className="appovedbtn" disabled > Approved {coinName1} </button>  
                                          : <button className="approvebtn " onClick={() =>{ doApprove1();setloadingapprove(true);}}  >
                                          Approve {coinName1}  
                                      </button>):
                                      (<div className="approvebtn ">Loading <i className="fa fa-spinner fa-spin"></i></div>)}

                                          {(((!successApprove1))) ?
                                              (<> 
                                                  <button disabled className="swapbtn " >
                                                      Supply
                                              </button>
                                              </>) : (<button onClick={toggleModal} className="swapbtnapprov " >Supply</button>)}



                                      </div>
                                            ) : 
                                             !approveButtonVisible1()  &&  approveButtonVisible2() ?
                                             ( 
                                                <div style={{ display: "flex",   justifyContent: "space-around" }}>
                                                {!loadingapprove? 
                                     ( <button className="approvebtn " onClick={() =>{ doApprove2();setloadingapprove(true);}}  >
                                          {(successApprove2) ? 
                                          <button className="appovedbtn " disabled > Approved {coinName2} </button>  : "Approve " + coinName2  }
                                      </button>):(<div className="approvebtn ">Loading <i className="fa fa-spinner fa-spin"></i></div>)}

                                          {(((!successApprove2))) ?
                                              (<> 
                                                  <button disabled className="swapbtn " >
                                                      Supply
                                              </button>
                                              </>) : (<button onClick={toggleModal} className="swapbtnapprov" >Supply</button>)}



                                      </div>
                                             )
                                             : approveButtonVisible1()  &&  approveButtonVisible2() ? (
                                                (<div style={{ display: "flex", justifyContent: "space-around" }}>
                                                {!loadingapprove? 
                                    ( 
                                         (successApprove1) ? 
                                         <button className="appovedbtn " disabled > Approved {coinName1}  </button>  :
                                         <button className="approvebtn " onClick={() =>{ doApprove1();setloadingapprove(true);}}  >
                                         Approve {coinName1}
                                     </button>):
                                     (<div className="approvebtn ">Loading <i className="fa fa-spinner fa-spin"></i></div>)}
                                     {!loadingapprove2? 
                                    ( 
                                         (successApprove2) ? 
                                         <button className="appovedbtn " disabled > Approved  {coinName2} </button>  
                                         :
                                         <button className="approvebtn" onClick={() =>{ doApprove2();setloadingapprove2(true);}}  >
                            
                                         Approve {coinName2}
                                     </button>)
                                     :(<div className="approvebtn ">Loading <i className="fa fa-spinner fa-spin"></i></div>)}
                                             {(((!successApprove1)) || (!successApprove2)) ?
                                                 (<> 

                                                 </>) : (<button className="swapbtnapprov" onClick={() => toggleModal()}>
                                                     Supply
                                                 </button>)}


                                         </div>) 
                                      
                                             )
                                             : (<div style={{  display: "flex", justifyContent: "center" }}>
                                             <button onClick={toggleModal}  className="swapbtnapproveth" >Supply</button></div>)



                                            )
                                            /* ----------------- */
                                                : (<div style={{  display: "flex", justifyContent: "center" }}>
                                                <button onClick={toggleModal}  className="swapbtnapproveth" >Supply</button></div>)
                    }

                </div>
        </div>
    );


}
export default Bonus1Card1