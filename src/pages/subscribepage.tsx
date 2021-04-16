
import React, { useRef, useEffect} from 'react';

import { useHistory } from 'react-router-dom';
import novalogo from "../images/novalogo.png";
import twiter from "../images/twiter.png"
import medium from "../images/medium.png"
import telegram from "../images/telegramme.png"
import jointelegramme from "../images/jointelegramme.png"
import checklogo from "../images/checklogo.png"
import "./landingpage.css"




function    SubscribePage() {
    const history = useHistory();
   
    const handleClick = () => history.push('/Landingpage'); 

    return (
        <div>
            <header>
                <nav className="navbar navbar-dark bg-dark justify-content-end">


                   
                    
                    <a href="https://twitter.com/NOVAFlNANCE" target="_blank" className="ribbon ribbon--purple"> <img src={twiter}  width="45px" /></a>
                    <a href="https://medium.com/@NovaFinance1" target="_blank" className="ribbon ribbon--purple"> <img src={medium}  width="45px" /></a>
                    <a href="https://t.me/NovaFinanceGroup" target="_blank" className="ribbon ribbon--purple"><img src={telegram}  width="55px" style={{margin:"-5px"}}/></a>

                  



                </nav>
            </header>
            <section className="pt-5 pb-5 mt-0 align-items-center d-flex bg-dark" style={{ height: "91vh " }}>

                <div className="container-fluid">
                    <div className="row  justify-content-center align-items-center d-flex text-center h-100">
                        <div className="col-12 col-md-8  h-50 ">
                            <h1 className="display-2  text-light mb-2 mt-2"><img src={checklogo} width="20%" /> </h1>

                            <h1 className="nova-title ">ALL SET!</h1>
                            <h1 className="landing-info ">We’ll keep you updated with the launch of Nova!</h1>

                            <div className="landing-button">
                            <div className="subscribe-form m-b20">
                             <a href="https://t.me/NovaFinanceGroup" target="_blank" >    <img src={jointelegramme} width="30%" /></a> 
                                 
                                </div>
                               
                            <button style={{background:"none",color:"white"}} onClick={()=>handleClick()}>Return to home </button>
                            </div>

                               
                         
                        </div>

                    </div>
                </div>
            </section>





        </div >

    );

}
export default SubscribePage;
