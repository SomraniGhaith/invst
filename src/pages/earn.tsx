import React, { useState, useEffect,useReducer} from "react";
import Head from '../components/head'
import './earn.css'
import Image_2 from "../images/Image_2.png"
import ethLogo from '../images/ethLogo.png'
import { getCoins } from "../api/coins";
import logoCoin from "../images/logoCoin.png"
import { unlockAccount, getBalance, Withdraw_nToken, deposit_Token, getAllowance, approveNnova } from '../api/web3'
import useAsync from "../components/useAsync";
import { getStrategy } from "../api/earn";
import { Accordion } from 'react-bootstrap';
import Web3 from "web3"
import { getCoinsEarn } from "../api/coins"
import { useWeb3Context } from "../contexts/Web3";
import { configContrat } from "../api/config";
import Countdown from "react-countdown";
import MetaMaskAccount from "../components/metaMaskAccount"
import store from "../redux/store"
interface EarnStartegy { 
    strategy: string;
    deposit: string;
    recieve: string[];
    apy: string[];
    novarating: string;
}

function Earn() {
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const [logocoin, setlogocoin] = useState("");
    const [dataTime, setData] = useState("");
    const [allowances, setAllowance] = useState(new Map<string, string>())
    const [input1, setInput1] = useState(""); // first amount balance
    const [input2, setInput2] = useState(""); // second amount balance 
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("")
    const [loadingapprove1, setloadingapprove1] = useState(false);
    const [successApprove1, setsuccessApprove1] = useState(false);
    const [successApprove2, setsuccessApprove2] = useState(false);
    const [loadingdeposit, setloadingdeposit] = useState(false);
    const [loadingwithdraw, setloadingwithdraw] = useState(false);
    const [tokendeposit, settokendeposit] = useState("");
    const [btnfilterindex,setbtnfilterindex]= useState(-1)
    

    const [swaplink, setswaplink] = useState("novaswap");

    //redux
    const [reseauId, setreseauId] = useState(parseFloat("" + store.getState().connection.networkId));
    const [successwithdraw, setsuccesswithdraw] = useState(false);
   
    function operationDeposit() {
        deposit_Token(web3, input1, reseauId, (err, res) => {
            if (err) {
                setloadingdeposit(false);
            }
            else if (res){
                setloadingdeposit(false)
                initDeposit()

            }
            
        })
       
        
        
    }
    function initDeposit(){
            setInput1("")
            setloadingdeposit(false);
            setsuccessApprove1(false);
            setsuccessApprove1(false)
    }
    let adresses: any = configContrat();
    function doApproveDeposit(address : string) {
        approveNnova(web3, address, input1, reseauId, (err, result) => {
            //callbcack its funtion fo what we do then
            if (err) {
                setloadingapprove1(false)
            }
            else {
                /*  alert(result); */
                setsuccessApprove1(true)
                setloadingapprove1(false)
            }
        });
    }
    const Completionist = () => <span>You are good to go!</span>;
    function operationWithdraw() {
        setloadingwithdraw(true)
        Withdraw_nToken(web3, input2, reseauId, (err, res) => {
            if (err) {
                setloadingwithdraw(false);
                setData("02:00:00")
            }
            else{
            setInput2("")
            setloadingwithdraw(false)
            setsuccesswithdraw(true)
            setData("02:00:00")
            }
            // window.location.reload(false)
        })
    }
    function handerValue2(e: React.ChangeEvent<HTMLInputElement>) {
        setInput2(e.target.value);
    }
    function handerValue1(e: React.ChangeEvent<HTMLInputElement>) {
        setInput1(e.target.value);
      
    }
    const calculPerBalance1 = (persentage: string, balance: string) => {
      
        if (balance !== "") {
            if (persentage === "25%") {
                var b = parseFloat(balance) / 4;
             
                setInput1(b.toString())
            }
            else if (persentage === "50%") {
                var b = parseFloat(balance) / 2;
                setInput1(b.toString());
            }
            else if (persentage === "75%") {
                var b = parseFloat(balance) * (3 / 4);
                setInput1(b.toString());
            }
            else if (persentage === "100%") {
                setInput1(balance);
            }


        }
        else
            setInput1("0.0")
    }
    const calculPerBalance2 = (persentage: string, balance: string) => {
        if (balance !== "") {
            if (persentage === "25%") {
                var b = parseFloat(balance) / 4;
                setInput2(b.toString());
            }
            else if (persentage === "50%") {
                var b = parseFloat(balance) / 2;
                setInput2(b.toString());
            }
            else if (persentage === "75%") {
                var b = parseFloat(balance) * (3 / 4);
                setInput2(b.toString());
            }
            else if (persentage === "100%") {
                var balanceInmax = (parseFloat(balance) * 97) / 100
                setInput2(balanceInmax.toString());
            }
        }
        else
            setInput2("0.00")
    }
    const { state: { account, netId, balance }, updateAccount } = useWeb3Context();
    const [activeEventKey, setActiveEventKey] = useState(0);
    const [showresult, setShowresult] = useState(false)
    const [strategyList, setstrategyList] = useState<EarnStartegy[]>([]);
    let strategy: any[] = [];
    getStrategy().forEach(element => { strategy.push(element) });

    //component didmount
    useEffect(() => {
        setstrategyList(strategy);

    }, [])

    /*function showdiv(id:any){

        alert("herrre")
        //setShowresult(!showresult)
        var elem = document.getElementById(id)

        console.log("vvv "+elem)
        //elem.style.visibility='hidden';
    }*/
    function sortByAssets() {
        strategy.sort(function (a, b) {
            //console.log("qqq"+a.deposit)
            var nameA = a.deposit.toUpperCase(), nameB = b.deposit.toUpperCase()
            if (nameA < nameB) //sort string ascending
                return -1
            if (nameA > nameB)
                return 1
            return 0 //default return value (no sorting)
        })
        setstrategyList(strategy);
    }
    function sortByApy() {
        strategy.sort(function (a, b) {
            //console.log("hhhhh"+a.apy)
            var nameA = a.apy, nameB = b.apy
            if (nameA < nameB) //sort string ascending
                return -1
            if (nameA > nameB)
                return 1
            return 0 //default return value (no sorting)
        })
        setstrategyList(strategy);
    }
    function sortByNovarating(btnindex:any) {
        setbtnfilterindex(btnindex)
        

        strategy.sort(function (a, b) {
            //console.log("ssss"+a.novarating)
            var nameA = a.novarating, nameB = b.novarating
            if (nameA > nameB) //sort string ascending
                return -1
            if (nameA < nameB)
                return 1
            return 0 //default return value (no sorting)
        })
        setstrategyList(strategy);
    }
    function getLogoByAddress(deposit: string) {
        var logo = "";
        //@ts-ignore
        getCoins(reseauId, swaplink).map(coin => {
            if (coin.name === deposit) {
                logo = coin.logo;
                return logo;
            }
        });
        if (logo == "") {
            //@ts-ignore
            getCoins(reseauId, swaplink).map(coin => {
                if (coin.name === deposit.toUpperCase()) {
                    logo = coin.logo;
                    return logo;
                }
            })
        }
        
        return logo;
    }

    const toHumanReadableBalance = (balance: string, unit: string) => {
        var getBalanceFloat = parseFloat(balance);
        return (getBalanceFloat / 1000000000000000000).toFixed(3);
    };
    const balancetake = (selected: string) => {
        //  var b = await getBalance(web3, slected );
        // return toHumanReadableBalance(b , "");
        if (balances.has(selected)) {
            return balances.get(selected);
        }
        return "no value";
    }
    function checkbalance(input1: string, testBalence: string) {
        var x = parseFloat(input1);
        // @ts-ignore
        var b = parseFloat(balancetake(testBalence))
        if (x > b) {
            return true
        } else {
            return false
        }
    }
    const getCoinAddress = (name: string) => {
        //@ts-ignore
        for (let coin of getCoinsEarn(reseauId)) {
            if (coin.name === name) {
                return coin.address
            }
        }
        return "default";

    }
    const [balances, setBalances] = useState(new Map<string, string>())
    const [web3, setWeb3] = useState(new Web3());
    const { pending, error, call } = useAsync(unlockAccount);
    async function onClickConnect() {
        const { error, data } = await call(null);
        let newBalances = new Map<string, string>();
     //   let newAllownces = new Map<string, string>();
        if (error) {
        }
        if (data) {
            setWeb3(data.web3);
            if (adresses[0][reseauId].novaswap.vaultProxy) {
                getBalance(data.web3, adresses[0][reseauId].novaswap.vaultProxy, reseauId,
                    (error, b) => {
                        if (error) {
                            return;
                        }
                        if (b) {
                            newBalances.set(adresses[0][42].novaswap.vaultProxy, toHumanReadableBalance(b.toString(), ""))
                            forceUpdate()
                            // console.log("Proxy" + " Balance :" +   toHumanReadableBalance(b.toString() , "") ) 
                        }
                    }
                );
            }
            //@ts-ignore
            getCoinsEarn(reseauId).map(
                coin => {
                    getBalance(data.web3, coin.address, reseauId,
                        (error, b) => {
                            if (error) {

                                return;
                            }

                            if (b) {

                                newBalances.set(coin.address, toHumanReadableBalance(b.toString(), ""))
                                forceUpdate()
                            }
                        });
                    if (coin.address !== "ETH") {
                        getAllowance(data.web3, coin.address, "novaswap", reseauId,
                            (error, b) => {
                                if (error) {

                                    return;
                                }

                                if (b) {
                                    allowances.set(coin.address, toHumanReadableBalance(b.toString(), ""))
                                   // forceUpdate()
                                }
                            });
                    }
                })
                forceUpdate()
                setBalances(newBalances)
              //  setAllowance(newAllownces)
                 updateAccount(data);
        }
    }
    useEffect(() => {
        onClickConnect();
    }, [input1,input2]);
    function formAccount(x: String) {
        var str = x;
        var res1 = str.substring(0, 6);
        var res2 = str.substring(str.length - 6, str.length);
        var res = (res1.concat('...', res2));
        return (res)
    }
    function approveButtonVisible(token: string) {
        var condition = (allowances.get(token)) && (parseFloat("" + allowances.get(token)) < parseFloat(input1));
        return condition
    }
    const clickHandler = (element: any) => {
        setShowresult(!showresult);
        setloadingdeposit(false);
        setloadingwithdraw(false);
        setsuccessApprove1(false);
        setloadingapprove1(false);
        setInput1("");
        setInput2("");
        setAddress1(getCoinAddress(element.deposit));
        setAddress2(adresses[0][42].novaswap.vaultProxy);
        settokendeposit(element.deposit)
    }
    return (
        <div className="main-layout inner_page">
            <Head />
            <div className="yiled-info">
                <div className="filter-strategies">
                <div className="">
                    <p className="lead text-light">Filter strategies by: </p>
                </div>
                <div className="">
                    <button className="btn btn-dark filter-button" data-filter="Apy" onClick={() => sortByApy()} >APY %</button>
                    <button className="btn btn-dark filter-button" data-filter="Asset" onClick={() => sortByAssets()}>Asset</button>
                    <button className={`btn btn-dark filter-button ${btnfilterindex === 1 ? "active" : ""}`}  data-filter="Nova Rating" onClick={() =>{ sortByNovarating(1)}} >Nova Rating</button>
                </div>
                </div>
              
                <div className="metamask-info">
                    <div className="btn  btn-icon-split" >
                        <MetaMaskAccount  showSetting={false}/>
                    </div>
                </div>
            </div>
            <div className="container">
                <ul className="responsive-table"  >
                    <li className="table-header" >
                        <div className="col accordion-title ">Deposit</div>
                        <div className="col accordion-title ">APY</div>
                        <div className="col accordion-title ">Nova Reward</div>
                        <div className="col accordion-title"><span className="text-color accordion-title"> Nova Rating</span></div>
                    </li>
                    <Accordion >
                        {strategyList.map((element, index) => (
                            <li className="table-row" key={index}  >
                                <div className="earncard">
                                    <div style={{ width: "100%" }}>
                                        <Accordion.Toggle className="earncarddetails" eventKey={String(index)}  onClick={() => { clickHandler(element)}}>
                                            <div className="col-3 text-bold coin">

                                                <img src={getLogoByAddress(element.deposit)} className="styleImageCoin"></img>
                                                <h1 className="accordion-info">{element.strategy}</h1>
                                            </div>
                                            <div className="col-3">
                                                <h3 className="accordion-info"> {element.apy}</h3>
                                            </div>

                                            <div className="col-3">
                                                <h3 className="accordion-info"> {element.apy}</h3>
                                            </div>
                                            <div className="col-3">
                                                <h3 className="accordion-info">{element.novarating}</h3>
                                            </div>
                                        </Accordion.Toggle>
                                    </div>
                                    <div className="earncardexchange">
                                        <Accordion.Collapse eventKey={String(index)}>
                                            <div>
                                                <div className=" titre-el1">
                                                    <div className="titre-el2">
                                                        <h3 style={{ color: "#2c1919d9" }}>Statistics:</h3>
                                                        <ul className="sous-titre2">
                                                            <li id="strategydetails">
                                                                <label className="deposit-lab"> Total Earnings:</label>
                                                                <h3 className="titre2-transparent">0.00 USDC</h3>
                                                            </li>
                                                            <li id="strategydetails">
                                                                <label className="deposit-lab"> Deposits:</label>
                                                                <h3 className="titre2-transparent">0.00 USDC</h3>
                                                            </li>
                                                            <li id="strategydetails">
                                                                <label className="deposit-lab"> WithDrawals:</label>
                                                                <h3 className="titre2-transparent">0.00 USDC</h3>
                                                            </li>
                                                            <li id="strategydetails">
                                                                <label className="deposit-lab"> Transferred In:</label>
                                                                <h3 className="titre2-transparent">0.00 USDC</h3>
                                                            </li>
                                                            <li id="strategydetails">
                                                                <label className="deposit-lab"> Transferred Out:</label>
                                                                <h3 className="titre2-transparent">0.00 USDC</h3>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className='titre-el3'>
                                                    <div className="info-deposit-withdraw">

                                                        <div className="col-6">
                                                            <h3 className="titre-transparent">{balancetake(getCoinAddress(element.deposit))} {tokendeposit}  </h3>
                                                            <input className="deposit" type="text" placeholder="0.00" value={input1} onChange={handerValue1} />
                                                          
                                                            <p style={{ fontSize: "10px", color: "red" }}> {allowances.get(getCoinAddress(element.deposit)) ? (allowances.get(getCoinAddress(element.deposit)) + "allowed") : ""} </p>
                                                            <ul className="sous-titre">
                                                                <button className="btn-pourcentage" onClick={() => calculPerBalance1("25%", balancetake(getCoinAddress(element.deposit)) || "")}>
                                                                    25%
                                                                </button>
                                                                <button className="btn-pourcentage" onClick={() => calculPerBalance1("50%", balancetake(getCoinAddress(element.deposit)) || "")}>
                                                                    50%
                                                                </button>
                                                                <button className="btn-pourcentage" onClick={() => calculPerBalance1("75%", balancetake(getCoinAddress(element.deposit)) || "")}>
                                                                    75%
                                                                </button>
                                                                <button className="btn-pourcentage" onClick={() => calculPerBalance1("100%", balancetake(getCoinAddress(element.deposit)) || "")}>
                                                                    100%
                                                               </button>
                                                            </ul>

                                                            {input1.length ? (

                                                                checkbalance(input1, getCoinAddress(element.deposit)) ? (
                                                                    <div>
                                                                        <button id="bt3" type="button" disabled >Balance Insufficient</button>

                                                                    </div>)
                                                                    : approveButtonVisible(getCoinAddress(element.deposit)) ? (
                                                                        <div>

                                                                            {!loadingapprove1 ? (
                                                                                <button id="bt1" type="button" onClick={() => { doApproveDeposit(getCoinAddress(element.deposit)); setloadingapprove1(true); }}>

                                                                                    {(successApprove1) ?

                                                                                        <button type="button" disabled> Approved </button> : "Approve "}

                                                                                </button>
                                                                            )
                                                                                : (<div className="approveloading1">Loading <i className="fa fa-spinner fa-spin"></i></div>)
                                                                            }

                                                                            {(successApprove1) ?
                                                                                (<div>   {!loadingdeposit ? (
                                                                                    <button id="bt1" type="button" onClick={() => { operationDeposit(); setloadingdeposit(true)}}>


                                                                                        deposit
                                                                                    </button>)



                                                                                    : (<div className="approveloading1">Loading <i className="fa fa-spinner fa-spin"></i></div>)}
                                                                                </div>) : null}
                                                                        </div>





                                                                    ) : <div>   {!loadingdeposit ? (
                                                                        <button id="bt1" type="button" onClick={() => { operationDeposit(); setloadingdeposit(true) }}>


                                                                            Deposit
                                                                        </button>)



                                                                        : (<div className="approveloading1">Loading <i className="fa fa-spinner fa-spin"></i></div>)}
                                                                        </div>
                                                            ) : <button id="bt1" type="button" data-toggle="tooltip" title="enter an amount">  Deposit </button>
                                                            }
                                                        </div>
                                                        <div className="col-6">
                                                            <h3 className="titre-transparent"> {balancetake("" + adresses[0][42].novaswap.vaultProxy)} {tokendeposit} </h3>
                                                            <input className="deposit" type="text" placeholder="0.00" value={input2} onChange={handerValue2} />
                                                            <ul className="sous-titre">

                                                                <button className="btn-pourcentage" onClick={() => calculPerBalance2("25%", balancetake("" + adresses[0][42].novaswap.vaultProxy) || "")}>
                                                                    25%
                                                    </button>

                                                                <button className="btn-pourcentage" onClick={() =>

                                                                    calculPerBalance2("50%", balancetake("" + adresses[0][42].novaswap.vaultProxy) || '')}>
                                                                    50%
                                                    </button>
                                                                <button className="btn-pourcentage" onClick={() => calculPerBalance2("75%", balancetake("" + adresses[0][42].novaswap.vaultProxy) || "")}>
                                                                    75%
                                                    </button>
                                                                <button className="btn-pourcentage" onClick={() => calculPerBalance2("100%", balancetake("" + adresses[0][42].novaswap.vaultProxy) || "")}>
                                                                    100%
                                                    </button>
                                                            </ul>

                                                            {input2.length ? (
                                                                <div>  {!loadingwithdraw ? (
                                                                    <button id="bt1" type="button" onClick={() => { operationWithdraw(); setloadingwithdraw(true) }}>
                                                                        {(successwithdraw) ?

                                                                            <button disabled > Withdraw  </button> : "Withdraw "}


                                                                    </button>)
                                                                    : (<div className="approveloading1">Loading <i className="fa fa-spinner fa-spin"></i></div>)}
                                                                    {successwithdraw && input2.length ?
                                                                        (<div style={{ color: "red" }}>
                                                                            <h4 style={{ color: "red" }}>Withdraw  will be available in: </h4>
                                                                            <Countdown date={Date.now() + 3600000 * 2}>
                                                                                <Completionist />
                                                                            </Countdown></div>


                                                                        ) : (null)

                                                                    }
                                                                </div>
                                                            )
                                                                : <button id="bt1" type="button" data-toggle="tooltip" title="enter an amount"> Withdraw  </button>

                                                            }

                                                            {/*   {!loadingwithdraw   ?(
                                                                   <button id="bt1" type="button" onClick={() =>{ operationWithdraw();setloadingwithdraw(true)}}>
                                                                           {(successwithdraw) ? 

                                                                        <button  disabled > Withdraw  </button>  : "Withdraw "}
                                                                   
                                                                   
                                                                   </button>)
                                                                 :(<div className="approveloading1">Loading <i className="fa fa-spinner fa-spin"></i></div>)}
                                                                 {successwithdraw  &&  input2.length  ?
                                                                 (<div style={{color:"red"}}>
                                                                 <h4 style={{color:"red"}}>Withdraw  will be available in: </h4>
                                                                        <Countdown  date={Date.now() + 3600000*2}>
                                                                        <Completionist />
                                                               </Countdown></div>


                                                                 ):(null)

                                                                 } */}

                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </Accordion.Collapse>
                                    </div>
                                </div>

                            </li>
                        ))}
                    </Accordion>
                </ul>
            </div>
        </div>
    );
}
export default Earn;



/**
 *
  <div className="titre-el2">
    <h3 className="text-color">
        Strategy:
    </h3>
    <ul className="sous-titre1">
        <li id="strategydetails">
            <label className="deposit-lab"> Currently Active:</label>
            <h3 className="titre2-transparent">DForceUSDC</h3>
        </li>
        <li id="strategydetails">
            <label className="deposit-lab"> Yearly Growth:</label>
            <h3 className="titre2-transparent">6.23%</h3>
        </li>
        <li id="strategydetails">
            <label className="deposit-lab"> Monthly Growth:</label>
            <h3 className="titre2-transparent">0.52%</h3>
        </li>
        <li id="strategydetails">
            <label className="deposit-lab"> Weekly Growth:</label>
            <h3 className="titre2-transparent">0.12%</h3>
        </li>
    </ul>
</div>
 */
