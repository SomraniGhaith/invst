import React, { useState, useEffect } from "react";
import "./home.css"
import useAsync from "../components/useAsync";
import logo from '../images/logo-brand.png'
import loading from '../images/loading.gif'
import { Button, Message, } from "semantic-ui-react";
import { unlockAccount } from '../api/web3'
import { useWeb3Context } from "../contexts/Web3";
import { useHistory } from 'react-router-dom';
import { Modal } from 'reactstrap';
import metamask from '../images/metamask.png';

import trezor from "../assets/trezor.png"
import walletConnectIcon from "../assets/walletConnectIcon.svg"
import portisIcon from "../assets/portisIcon.png";
import fortmaticIcon from "../assets/fortmaticIcon.png"
import trustWallet from "../assets/trustWallet.png"
import squarelink from "../assets/squarelink.png"
import ledger from "../assets/ledger.png"
import torus from "../assets/torus.jpg"

import {
    Web3ReactProvider,
    useWeb3React,
} from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";


import Store from "../stores";
import { stat } from "fs";



function Home() {




    function getLibrary(provider: any) {

        const library = new Web3Provider(provider);
        library.pollingInterval = 8000;
        return library;
    }
    const [nameNetWork, setnameNetWork] = useState("")
    const [btnindex, setbtnindex] = useState(-1)
    /*  const [walletconnect,setwalletconnect]=useState(false) */

    function onConnectionClicked(buttonIndex: any, currentConnector: any, name: any, setActivatingConnector: any, activate: any) {
        setbtnindex(buttonIndex)
        const connectorsByName = store.getStore('connectorsByName')

        setActivatingConnector(currentConnector);

        activate(connectorsByName[name]);
       handleClick()



    }

    const emitter = Store.emitter
    const store = Store.store
    const [activatingConnector, setActivatingConnector] = React.useState();
    const context = useWeb3React();
    const localContext = store.getStore('web3context');
    var localConnector = null;





    if (localContext) {
        localConnector = localContext.connector
    }
    const {
        activate
    } = context;
    var connectorsByName = store.getStore('connectorsByName')
    const currentConnector = connectorsByName[nameNetWork];





    const {
        state: { account, netId },
        updateAccount,
    } = useWeb3Context();
    
    const history = useHistory();
    const handleClick = () => history.push('/Swap');

    const { pending, error, call } = useAsync(unlockAccount);

    async function onClickConnect() {
     
        const { error, data } = await call(null);

        if (error) {
       
        }
        if (data) {
           
            updateAccount(data);
            //navigation page Earn 
            handleClick();
        }
    }
    const [isOpen1, setIsOpen1] = useState(false);
    function toggleModalconnect() {
        setIsOpen1(!isOpen1);
    }

    /* --------------------------- */

    const {
        connector,
        library,
        chainId,


        deactivate,
        active,

    } = context;

    // handle logic to recognize the connector currently being activated

    React.useEffect(() => {
        console.log("running");
        if (activatingConnector && activatingConnector === connector) {
            setActivatingConnector(undefined);
        }
    }, [activatingConnector, connector]);

    // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already


    // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists


    // set up block listener


    // fetch eth balance of the connected account




    /* -------------------------- */





    return (
        <div className="main-layout">

            <Modal
                isOpen={isOpen1}
                onRequestClose={toggleModalconnect}
                contentlabel="My dialog"

               >
                <div  className="modal-content1">
                    <div className="modaltitle1connect">
                        <p style={{ fontSize: "24px", fontWeight: "bold" }}>Connect your wallet </p>
                        <button onClick={toggleModalconnect} style={{ backgroundColor: "transparent" }}><i className="fa fa-times" aria-hidden="true" style={{fontSize:"32px"}}></i>
                        </button>

                    </div>

                    <div className="modalbodyconnect">
                         <button className="bntconnect col-5" onClick={() => { onClickConnect() }}>MetaMask  <img src={metamask} width="25px" /></button>
                      {/*   <button className={`bntconnect col-5 ${btnindex === 1 ? "active" : ""}`} disabled={btnindex!=-1 && btnindex!=1} onClick={() => { onConnectionClicked(1,currentConnector, 'MetaMask', setActivatingConnector, activate) }}>MetaMask  <img src={metamask} width="25px" /></button> */}
                        <button className={`bntconnect col-5 ${btnindex === 2 ? "active" : ""}`} disabled={btnindex!=-1 && btnindex!=1} onClick={() => { onConnectionClicked(2,currentConnector, 'Trezor', setActivatingConnector, activate) }}>Trezor  <img src={trezor} width="25px" /></button>
                        <button className={`bntconnect col-5 ${btnindex === 3 ? "active" : ""}`} disabled={btnindex!=-1 && btnindex!=2} onClick={() => { onConnectionClicked(3,currentConnector, 'WalletConnect', setActivatingConnector, activate) }}>WalletConnect  <img src={walletConnectIcon} width="25px" /></button> 
                        <button className={`bntconnect col-5 ${btnindex === 4 ? "active" : ""}`} disabled={btnindex!=-1 && btnindex!=3} onClick={() => { onConnectionClicked(4, currentConnector, 'Portis', setActivatingConnector, activate) }}>Portis  <img src={portisIcon} width="25px" /></button>
                        <button className={`bntconnect col-5 ${btnindex === 5 ? "active" : ""}`} disabled={btnindex!=-1 && btnindex!=4} onClick={() => { onConnectionClicked(5, currentConnector, 'Fortmatic', setActivatingConnector, activate) }}> Fortmatic  <img src={fortmaticIcon} width="25px" /></button>
                        <button className={`bntconnect col-5 ${btnindex === 6 ? "active" : ""}`} disabled={btnindex!=-1 && btnindex!=5} onClick={() => { onConnectionClicked(6, currentConnector, 'TrustWallet', setActivatingConnector, activate) }}> TrustWallet  <img src={trustWallet} width="25px" /></button>
                        <button className={`bntconnect col-5 ${btnindex === 7 ? "active" : ""}`} disabled={btnindex!=-1 && btnindex!=6} onClick={() => { onConnectionClicked(7, currentConnector, 'Squarelink', setActivatingConnector, activate) }}> Squarelink  <img src={squarelink} width="25px" /></button>
                        <button className={`bntconnect col-5 ${btnindex === 8 ? "active" : ""}`} disabled={btnindex!=-1 && btnindex!=7} onClick={() => { onConnectionClicked(8, currentConnector, 'Ledger', setActivatingConnector, activate) }}> Ledger  <img src={ledger} width="25px" /></button>
                        <button className={`bntconnect col-5 ${btnindex === 9 ? "active" : ""}`} disabled={btnindex!=-1 && btnindex!=8} onClick={() => { onConnectionClicked(9, currentConnector, 'Torus', setActivatingConnector, activate) }}> Torus  <img src={torus} width="25px" /></button>
                       {btnindex != -1 ?
                       ( <button className="bntconnectcancel col-5"  onClick={() => { setbtnindex(-1) }}> Cancel </button>)
                       :(null)
                       }



                    </div>
                </div>
            </Modal>

            <div className="header">
                <div className="container-fluid">
                    <nav className="navbar navbar-dark bg-dark justify-content-end">


                        <a href="#/About" className="btn btn-outline-dark my-2 my-sm-0  text-light btn-block ">About</a>

                    </nav>
                </div>
            </div>

            <div className="full_bg">

                <div className="container-fluid">
                    <section className="pt-5 pb-5 mt-0 align-items-center d-flex bg-dark" style={{ height: "100vh" }}>

                        <div className="container-fluid">
                            <div className="row  justify-content-center align-items-center d-flex text-center h-100">
                                <div className="col-12 col-md-8  h-50 ">
                                    <h1 className="display-2  text-light mb-2 mt-3"><img src={logo} /></h1>
                                    
                                    <p><a className="btn btn-outline-dark shadow-lg btn-round text-light btn-lg mt-3" onClick={toggleModalconnect} >Connect Wallet</a></p>


                                </div>

                            </div>
                        </div>
                    </section>


                </div>
            </div>






        </div>


    );
}
export default Home;
