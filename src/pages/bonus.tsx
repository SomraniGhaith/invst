import React, { useState, useEffect } from "react";
import "./bonus.css";
import Head from '../components/head'
import { unlockAccount } from '../api/web3'
import useAsync from "../components/useAsync";
import {getPaires} from "../api/Bonus"
import { useHistory } from 'react-router-dom';
import MetaMaskAccount from "../components/metaMaskAccount"
function Bonus() {
     // pour obtenir compte =


     

     const [account, setAccount] = useState("");
     const { pending, error, call } = useAsync(unlockAccount);
     const history = useHistory();
     
     const handleClick = () => history.push('/Bonus1');
     async function onClickConnect() {
         const { error, data } = await call(null);
 
         if (error) {
             console.error(error);
         }
         if (data) {
             setAccount(data.account);
         }
     }
     useEffect(() => {
         onClickConnect();
     }, []);
     
     function formAccount(x : String) {
         var str = x;
         var res1 = str.substring(0, 6);
         var res2 = str.substring(str.length-6, str.length);
         var res = (res1.concat('...', res2));
        return(res)
       }

       async  function navigate (paireOne:any , paireTwo:any){
       
        history.push({
            pathname: "/Bonus1",
            state: { paireOne: paireOne , paireTwo : paireTwo },
          })
  
         }

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


            

            <section className="container">
                <div style={{display:"flex"}}>
            <h2 className="text-white mb-3"> Available Markets</h2>
            {/*   <h2   style={{cursor: "pointer",color: "cadetblue",marginLeft:"15px"}} onClick={handleClick}>+More option</h2> */}
            </div>
                <div className="row">

                {getPaires().map((result,index) => (

                                    <div  className="col-12 col-md-6 col-lg-4" key={index}>
                                    <div className="card pull-up">
                                        <div className="card-bg" onClick={() => navigate(result.pairesName[0] , result.pairesName[1]) }>
                                            <div className="justify-content-center ">
                                                <div className="text-center">
                                                  <img src={result.logo} className=" mb-2" />
                                                    <h3 className="no-margin text-light text-bold"> <span className="text-color">{result.pairesName[0]} / {result.pairesName[1]} </span> </h3>
                                                </div>

                                            </div>
                                        </div>
                                        <div className="card-content text-center">
                                            <p className="text-bold"><img src={result.logo} className="img-logo" /> {result.apy} APY
                                            </p>
                                        </div>
                                    </div>
                                    </div>


                           
                ))}

                  




                </div>

            </section>

        </div>






    );
}
export default Bonus 