import React, { useState, useEffect } from 'react'
import './earn1.css'
import Head from '../components/head'
import ethLogo from "../images/ethLogo.png"
import logo_by from '../images/logo_by.png'
import { unlockAccount, convertEthJoinStrategy, getBalance } from '../api/web3'
import useAsync from "../components/useAsync";
import Web3 from "web3";
import { getCoinsEarn } from "../api/coins"
import { useWeb3Context } from "../contexts/Web3";
import MetaMaskAccount from "../components/metaMaskAccount";
import store from "../redux/store"
function Earn1() {
    const { state: { account  }, updateAccount } = useWeb3Context();
    const [web3, setWeb3] = useState(new Web3());

    const [balances, setBalances] = useState(new Map<string, string>())
 //redux
 const [reseauId , setreseauId] = useState(parseFloat(""+store.getState().connection.networkId)); 


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

    function convertTonEth(balance: string, token: string) {
        convertEthJoinStrategy(web3, balance, token);
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
                <div className="col-2">
                <div className="btn btn-dark btn-icon-split" >
                <MetaMaskAccount showSetting={false} />
                </div>
                
                </div>

            </div>

            {/* ------------------------------ */}
            <div className="content  row">

                <div className="col-lg-8">


                    <div className="carditem1  text-white">


                        <div className="carditemhead">
                            <h2 className="text-white">You currently have:{" " + balancetake(getCoinAddress("Eth"))}{" " + "Eth"} </h2>
                            <div className="carditemdetails">
                                <p className="text-bold"> You can convert these to nEthereum (nEth) which lets you <br /> participate in this strategy and trade in the ntoken markets </p>
                            </div>

                        </div>
                        <div className="carditemconvert">
                            <div className=" mb-3">

                                <a className="btn btn-dark btnconvert" style={{ fontSize: "20px", fontWeight: "bold" }} onClick={() => convertTonEth("" + balancetake(getCoinAddress("Eth")), "Eth")}> Convert to nEth <br /> & join this strategy </a>
                            </div>
                        </div>

                    </div>


                    <div className="carditem1 text-white">
                        <div className="carditemhead1">

                            <h2 className="text-white">You currently have: {" " + balancetake(getCoinAddress("Dai"))}{" " + "Dai"} </h2>

                            <div className="carditemdetails">
                                <h2 className="text-white" > Which allows you to claim </h2>
                                <h2 className="text-white">___ nEth & ___<span className="text-color">NOVA</span> </h2>
                            </div>
                        </div>

                        <div className="carditemconvert1">
                            <div className="box1 mb-3">
                                <a className="btn btn-dark btnconvert" style={{ fontSize: "20px", fontWeight: "bold" }} onClick={() => convertTonEth("" + balancetake(getCoinAddress("Dai")), "Dai")}> Convert back to <br />
                                   Ethereum, claim <br /> rewards & exit this <br /> strategy </a>
                            </div>
                            <div className="box mb-3">
                                <a className="text-bold" href="#/Swap" > Swap to another <br /> startegy </a>

                            </div>
                        </div>



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
export default Earn1
