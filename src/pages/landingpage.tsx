
import React, { useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion'
import { useHistory } from 'react-router-dom';
import novalogo from "../images/novalogo.svg";

import arrowright from "../images/arrowright.png";
import "./landingpage.css";
import { useState } from "react";
import { Modal } from "reactstrap";






function Landingpage() {
  const history = useHistory();
  const [modal, setModal] = useState(false);
  const [chekedmail, setchekedmail] = useState(false);
  const toggle = () => setModal(!modal);

  const handleClick = () => history.push('/Landingpage');

  function handelemail(e: React.ChangeEvent<HTMLInputElement>) {
    setemail(e.target.value)


  }

  function ValidateEmail(email: string) {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
      return (true)
    }
    /*  alert("You have entered an invalid email address!") */
    return (false)
  }






  function validationemail() {
    if ((email.length) && ValidateEmail(email)) {
      //  handleClick();
      sendEmail();
      setchekedmail(true)
    }
    else {
      /* alert("invalid email") */
      toggle()



    }
  }


  const [email, setemail] = useState("")

  function sendEmail() {


    //  const { email } = this.props

    fetch('/api/sendEmail?emailTo=' + email)
      .then(function (res) {
        return res.json();
      })
      .then(function (res) {
        console.log("test**********" + res)

      })
      .catch(function (res) {
        //@ts-ignore
        res.then(data => {
          console.log(data.error)


        });
      });




    ;
  }
  const pageVariants = {
    in: {
      opacity: 1,
      x: 0
    },
    out: {
      opacity: 0,
      x: "-100vw"
    }
  };

  const pageTransition = {
    duration: 2
  }




  return (
    <div style={{ backgroundColor: "#0d151f",height:"100vh" }}>


      <motion.div
        initial="out"
        animate="in"
        variants={pageVariants}
        transition={pageTransition}
      >
        <Modal isOpen={modal} toggle={toggle} className="validatemodal" >


          <button style={{ fontSize: "30px", backgroundColor: "rgb(13, 21, 31)", textAlign: "right", margin: "10px" }} onClick={toggle}><i className="fa fa-times" aria-hidden="true" style={{ fontSize: "30px", backgroundColor: "rgb(13, 21, 31)" }}></i></button>
          <div className="modal-body text-center">

            <p className="btn-tryagain">Email is not valid</p>
            <button className="btn-tryagain" onClick={toggle}>Try Again</button>
            {/*   <span style={{textAlign:"center",fontSize:"30px",fontWeight:500,color:"white"}}></span> */}
          </div>

        </Modal>
      </motion.div>
      {/* <header>
                <nav className="navbar navbar-dark bg-dark justify-content-end">   
                    <a href="https://twitter.com/NOVAFlNANCE" target="_blank" className="ribbon ribbon--purple"> <img src={twiter}  width="45px" /></a>
                    <a href="https://medium.com/@NovaFinance1" target="_blank" className="ribbon ribbon--purple"> <img src={medium}  width="45px" /></a>
                    <a href="https://t.me/NovaFinanceGroup" target="_blank" className="ribbon ribbon--purple"><img src={telegram}  width="55px" style={{margin:"-5px"}}/></a>

                </nav>
            </header> */}
      <section className=" mt-0 align-items-center d-flex " >

        <div className="container-fluid">
          <div className="row  justify-content-center align-items-center d-flex text-center h-100" style={{ marginTop: "5%" }}>
            <div className="col-12 col-md-8  h-50 ">
              <h1 className="display-2  text-light mb-2 mt-2"><img src={novalogo} width="15%" /> </h1>


              <h1 className="landing-info ">Subscribe for launch notification</h1>

              {!chekedmail ? (
                <div className="landing-button">
                  <div className="subscribe-form m-b20">


                    <div className="input-group">
                      <input className="email" type="email" placeholder="Example@email.com" onChange={handelemail} />
                      <span className="input-group-btn">

                        <button onClick={() => { validationemail() }} className="btn landing-mail"><img src={arrowright} /> </button>

                      </span>
                    </div>

                  </div>
                </div>)
                : (<button className="btn-welcome" onClick={() => {setchekedmail(false)}}>Welcome on board!</button>)
              }

              <div className="linkblock">
                <a className="social-link"   href="https://twitter.com/NOVAFlNANCE" target="_blank" >Twitter </a>
                <a className="social-link" href="https://medium.com/@NovaFinance1" target="_blank" > Medium</a>
                <a className="social-link" href="https://t.me/NovaFinanceGroup" target="_blank" >Telegram</a>
              </div>
            </div>

          </div>
        </div>
      </section>



    </div >

  );

}
export default Landingpage;
