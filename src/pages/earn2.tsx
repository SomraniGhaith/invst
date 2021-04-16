import React, { useState, useEffect } from 'react'
import './earn2.css'
import Head from '../components/head'
import ethLogo from "../images/ethLogo.png"
import { unlockAccount, getBalance, Withdraw_nToken, deposit_Token, getAllowance, approveNnova } from '../api/web3'
import useAsync from "../components/useAsync";
import Web3 from "web3";
import logo_by from '../images/logo_by.png'
import { getCoinsEarn } from "../api/coins"
import { useWeb3Context } from "../contexts/Web3";
import MetaMaskAccount from "../components/metaMaskAccount"
import { Accordion } from 'react-bootstrap';
import { configContrat } from "../api/config";
import Countdown from "react-countdown";
import store from "../redux/store"
interface EarnStartegy {
    strategy: string;
    deposit: string;
    recieve: string[];
    apy: string[];
    novarating: string;
}

let adresses: any = configContrat();
function Earn2() {


    const { state: { account, netId, balance }, updateAccount } = useWeb3Context();
    const [web3, setWeb3] = useState(new Web3());

    const [balances, setBalances] = useState(new Map<string, string>())
    //redux
    const [reseauId, setreseauId] = useState(parseFloat("" + store.getState().connection.networkId));


    const [strategyList, setstrategyList] = useState<EarnStartegy[]>([]);
    const [tokendeposit, settokendeposit] = useState("ETH");
    const [allowances, setAllowance] = useState(new Map<string, string>())
    const [input1, setInput1] = useState(""); // first amount balance
    const [input2, setInput2] = useState(""); // second amount balance 
    const [loadingapprove1, setloadingapprove1] = useState(false);
    const [successApprove1, setsuccessApprove1] = useState(false);
    const [loadingdeposit, setloadingdeposit] = useState(false);
    const [loadingwithdraw, setloadingwithdraw] = useState(false);
    const [successwithdraw, setsuccesswithdraw] = useState(false);

    const Completionist = () => <span>You are good to go!</span>;

    const calculPerBalance1 = (persentage: string, balance: string) => {
        if (balance !== "") {
            if (persentage === "25%") {
                var b = parseFloat(balance) / 4;
                setInput1(b.toString());

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

                setInput2(balance);


            }


        }
        else
            setInput2("0.00")
    }

    function approveButtonVisible(token: string) {


        var condition = (allowances.get(token)) && (parseFloat("" + allowances.get(token)) <
            parseFloat(input1));
        ;

        return condition



    }
    const [showresult, setShowresult] = useState(false)
    const clickHandler = (element: any) => {
        setShowresult(!showresult);
    }


    function doApproveDeposit() {


        approveNnova(web3, getCoinAddress("Dollar"), input1, reseauId, (err, result) => {

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

    function operationWithdraw() {
        Withdraw_nToken(web3, input2, reseauId, (err, res) => {
            if (err) {

                setloadingwithdraw(false)
            }
            else
                setloadingwithdraw(false)
            setsuccesswithdraw(true)
            // window.location.reload(false)
        })

    }


    function handerValue2(e: React.ChangeEvent<HTMLInputElement>) {
        setInput2(e.target.value);
    }
    function handerValue1(e: React.ChangeEvent<HTMLInputElement>) {
        setInput1(e.target.value);
    }


    const getCoinAddress = (name: string) => {

        for (let coin of getCoinsEarn(reseauId)) {
            if (coin.name === name) {
                return coin.address
            }
        }
        return "default";

    }



    const balancetake = (selected: string) => {

        //  var b = await getBalance(web3, slected );

        // return toHumanReadableBalance(b , "");

        if (balances.has(selected)) {



            return balances.get(selected);
        }
        else {

            return "no value";
        }

    }





    const toHumanReadableBalance = (balance: string, unit: string) => {
        var getBalanceFloat = parseFloat(balance);
        return (getBalanceFloat / 1000000000000000000).toFixed(3);
    };


    const { pending, error, call } = useAsync(unlockAccount);

    async function onClickConnect() {
        const { error, data } = await call(null);

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

                            balances.set(adresses[0][42].novaswap.vaultProxy, toHumanReadableBalance(b.toString(), ""))
                            // console.log("Proxy" + " Balance :" +   toHumanReadableBalance(b.toString() , "") )

                        }
                    });
            }
            getCoinsEarn(reseauId).map(
                coin => {

                    getBalance(data.web3, coin.address, reseauId,
                        (error, b) => {
                            if (error) {

                                return;
                            }

                            if (b) {
                                balances.set(coin.address, toHumanReadableBalance(b.toString(), ""))

                            }
                        });

                }
            )




            updateAccount(data);

        }
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

    function operationDeposit() {

        deposit_Token(web3, input1, reseauId, (err, res) => {
            if (err) {
                setloadingdeposit(false);

            }
            else
                setloadingdeposit(false)
            window.location.reload(false)
        })



    }


    useEffect(() => {
        onClickConnect();
    }, []);
    function formAccount(x: String) {
        var str = x;
        var res1 = str.substring(0, 6);
        var res2 = str.substring(str.length - 6, str.length);
        var res = (res1.concat('...', res2));
        return (res)
    }

    return (
        <div className="main-layout inner_page">
            <div>
                <Head />
            </div>

            <div className="header1">
                <h2 className="text-white">Eth-Dai</h2>
                <div className="">
                    <div className="btn  btn-icon-split" >
                        <MetaMaskAccount />
                    </div>

                </div>

            </div>

            {/* ------------------------------ */}
            <div className="contentearn2  row">

                <div className="col-lg-8">

                    <Accordion key={1}>

                        <Accordion.Toggle className="carditem2  text-white" eventKey={String(1)}>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }} >


                                <div className="carditemhead">
                                    <h2 className="text-white">You currently have:{" " + balancetake(getCoinAddress("Eth"))}{" " + "Eth"} </h2>
                                    <div className="carditemdetails">
                                        <p className="text-bold"> You can convert these to nEthereum (nEth) which lets you <br /> participate in this strategy and trade in the ntoken markets </p>
                                    </div>

                                </div>
                                <div className="carditemconvert">
                                    <div className=" mb-3">

                                        <a className="btn btn-dark" > Convert to nEth <br /> & join this strategy </a>

                                    </div>


                                </div>

                            </div>
                        </Accordion.Toggle>
                        <Accordion.Collapse className="col-12" eventKey={String(1)}>


                            <div className="earncardexchange">
                                <div className=" titre-el1">
                                    <div className="titre-el2">

                                        <h3 className="text-color">
                                            Strategy:</h3>

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
                                    <div className="titre-el2">

                                        <h3 className="text-color">
                                            Statistics:
                                        </h3>

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
                                    <div className="row">

                                        <div className="col-6">
                                            <h3 className="titre-transparent">{balancetake(getCoinAddress("Eth"))} {tokendeposit}  </h3>
                                            <div style={{ textAlign: "center" }}>
                                                <input className="depositearn2" type="text" placeholder="0.00" value={input1} onChange={handerValue1} />
                                            </div>
                                            <p style={{ fontSize: "10px", color: "red" }}> </p>
                                            <ul className="sous-titre">

                                                <button className="btn-pourcentage" onClick={() => calculPerBalance1("25%", balancetake(getCoinAddress("Eth")) || "")}>
                                                    25%
                                                </button>
                                                <button className="btn-pourcentage" onClick={() => calculPerBalance1("50%", balancetake(getCoinAddress("Eth")) || '')}>
                                                    50%
                                                </button>
                                                <button className="btn-pourcentage" onClick={() => calculPerBalance1("75%", balancetake(getCoinAddress("Eth")) || "")}>
                                                    75%
                                                </button>
                                                <button className="btn-pourcentage" onClick={() => calculPerBalance1("100%", balancetake(getCoinAddress("Eth")) || "")}>
                                                    100%
                                                </button>
                                            </ul>

                                            {input1.length ? (

                                                checkbalance(input1, getCoinAddress("Eth")) ? (
                                                    <div>
                                                        <button id="bt3earn2" type="button" disabled >Balance Insufficient</button>

                                                    </div>)
                                                    : approveButtonVisible(getCoinAddress("Eth")) ? (
                                                        <div style={{ textAlign: "center" }}>

                                                            {!loadingapprove1 ? (
                                                                <button id="bt1earn2" type="button" onClick={() => { doApproveDeposit(); setloadingapprove1(true); }}>

                                                                    {(successApprove1) ?

                                                                        <button type="button" disabled> Approved </button> : "Approve "}

                                                                </button>
                                                            )
                                                                : (<div className="approveloading1">Loading <i className="fas fa-spinner fa-spin"></i></div>)
                                                            }

                                                            {(successApprove1) ?
                                                                (<div>                           {!loadingdeposit ? (
                                                                    <button id="bt1earn2" type="button" onClick={() => { operationDeposit(); setloadingdeposit(true) }}>


                                                                        deposit
                                                                    </button>)



                                                                    : (<div className="approveloading1">Loading <i className="fas fa-spinner fa-spin"></i></div>)}
                                                                </div>)
                                                                : null}
                                                        </div>





                                                    ) : <div>   {!loadingdeposit ? (
                                                        <button id="bt1earn2" type="button" onClick={() => { operationDeposit(); setloadingdeposit(true) }}>


                                                            Deposit
                                                        </button>)



                                                        : (<div className="approveloading1">Loading <i className="fas fa-spinner fa-spin"></i></div>)}
                                                        </div>
                                            ) : <button id="bt1earn2" type="button" data-toggle="tooltip" title="enter an amount">  Deposit </button>
                                            }
                                        </div>
                                        <div className="col-6">

                                            <h3 className="titre-transparent"> {balancetake("" + adresses[0][42].novaswap.vaultProxy)} nova{tokendeposit} </h3>
                                            <div style={{ textAlign: "center" }}>
                                                <input className="depositearn2" type="text" placeholder="0.00" value={input2} onChange={handerValue2} />
                                            </div>
                                            <ul className="sous-titre">

                                                <button className="btn-pourcentage" onClick={() => calculPerBalance2("25%", balancetake("" + adresses[0][42].novaswap.vaultProxy) || "")}>
                                                    25%
                                                </button>

                                                <button className="btn-pourcentage" onClick={() => calculPerBalance2("50%", balancetake("" + adresses[0][42].novaswap.vaultProxy) || '')}>
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
                                                    <button id="bt1earn2" type="button" onClick={() => { operationWithdraw(); setloadingwithdraw(true) }}>
                                                        {(successwithdraw) ?

                                                            <button disabled > Withdraw  </button> : "Withdraw "}


                                                    </button>)
                                                    : (<div className="approveloading1">Loading <i className="fas fa-spinner fa-spin"></i></div>)}
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
                                                : <button id="bt1earn2" type="button" data-toggle="tooltip" title="enter an amount"> Withdraw  </button>

                                            }



                                        </div>

                                    </div>
                                </div>
                            </div>




                        </Accordion.Collapse>

                    </Accordion >


                    <div className="carditem1 text-white">
                        <div className="carditemhead1">

                            <h2 className="text-white">You currently have: {" " + balancetake(getCoinAddress("Dai"))}{" " + "Dai"} </h2>

                            <div className="carditemdetails">
                                <h2 className="text-white" > Which allows you to claim </h2>
                                <h2 className="text-white">___ nEth & ___<span className="text-color">NOVA</span> </h2>
                            </div>
                        </div>

                        <div className="carditemconvert1">
                            <div className="box mb-3">
                                <a className="btn btn-dark" > Convert back to <br />
                                  Ethereum, claim <br /> rewards & exit this <br /> strategy </a>
                            </div>
                            <div className="box mb-3">
                                <a className="text-bold" href="#/Earn" > Swap to another <br /> startegy </a>

                            </div>
                        </div>


                        {/* ------------------------------------ */}



                    </div>

                </div>


                <div className="novarating col-lg-4">


                    <div className=" bg-theme mb-4 h-100">


                        <div className="row">
                            <div className="col-sm-12 text-center">
                                <h1 className="text-color mb-5">
                                    NOVA Rating
                  </h1>

                            </div>
                        </div>
                        <div className="row">
                            <table className="table-responsive" id="table-earn">
                                <tbody>
                                    <tr>
                                        <td ><h3 className="text-bold text-white "> Profitability: </h3>
                                        </td>

                                        <td>
                                            <h3 className="text-bold text-white "><img src={ethLogo} className="icon" /> Ethereum</h3> </td>
                                        <td> <h3 className="text-bold  text-white"> 53.5% APY </h3></td></tr>
                                    <tr>
                                        <td></td>
                                        <h3 className="text-bold text-white"><img src={logo_by} className="icon" /> NOVA</h3>

                                        <td>

                                            <h3 className="text-bold text-white">1082 %</h3>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p className="text-bold">Sutainability:</p>
                                            <p className="text-bold">Risk of value</p>
                                            <p className="text-bold">loss:</p>
                                        </td>
                                        <td></td>

                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td className="bg-violet text-bold text-center"> 87</td>
                                    </tr>
                                </tbody>

                            </table>

                        </div>
                        <hr className="text-white" />
                        <h4 className="text-bold text-white">Notes</h4>




                    </div>





                </div>

            </div>


            {/* --------------- */}






        </div>

    );

}
export default Earn2;
