import React, { useState, useEffect, MouseEvent } from "react";
import { Modal } from "reactstrap";
import "./PopupAddToken.css";
import Web3 from "web3";
import store from "../../redux/store";
import { setJeton } from "../../redux/actions"
import { getCoins } from "../../api/coins";

const PopupAddToken = (props: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [nameToken, setnameToken] = useState("");
    const [addressToken, setaddressToken] = useState("");
    const [Veriferror,setVerifError]=useState("");
    const [reseauId, setreseauId] = useState(parseFloat("" + store.getState().connection.networkId));
    const [swaplink, setswaplink] = useState("novaswap");
    function CloseModal() {
        setIsOpen(false);
        console.log("close model " + isOpen)

    }
    useEffect(() => {
        setIsOpen(props.isOpenPopup)
        console.log("props " + props.isOpenPopup)

    }, [props.isOpenPopup])
   function handerAddress(e: React.ChangeEvent<HTMLInputElement>){
        setaddressToken(e.target.value);
   }
   function handerAddName(e: React.ChangeEvent<HTMLInputElement>){
    setnameToken(e.target.value);
       
}
function addJeton() {
    console.log("karima")
    if (nameToken && addressToken) {
        setVerifError("");
      //@ts-ignore

      var result1 = getCoins(reseauId, swaplink).filter(
        coin => coin.name.toUpperCase() == nameToken.toUpperCase()
      );

      //@ts-ignore
      var result2 = getCoins(reseauId, swaplink).filter(
        coin => coin.address == addressToken
      );

      if (result1[0]) {
        setVerifError("Name " + nameToken + " " + "exist");
        return;
      } else if (result2[0]) {
        setVerifError("Address exist");
        return;
      } else {
        if (Web3.utils.isAddress(addressToken)) {
          //redux
          const jeton = { "name": nameToken, "adress": addressToken };
          store.dispatch(setJeton(jeton));
          // localStorage.setItem("NameJeton", nameNewJeton);
          // localStorage.setItem("addressJeton", addressNewJeton);
          window.location.reload();
        } else setVerifError("Your address is not compatible with our standard ");
      }
    }

    /*   else {
        localStorage.setItem("NameJeton" , nameNewJeton)
        localStorage.setItem("addressJeton" , addressNewJeton)
        } */
  }
    return (
        <Modal
            isOpen={isOpen}
            //  onRequestClose={toggleModal1}
            contentlabel="My dialog"
            className="modal-content">
            <div className="modaltitle">
                <p>Add New Token</p>
                <button className="close" onClick={CloseModal} >
                    <i className="fa fa-times" aria-hidden="true"></i>
                </button>
            </div>
            <div style={{ marginBottom: "10px",textAlign:"center" }}>
            <input className="inputName" type="text" placeholder="Token Name" value={nameToken} onChange={handerAddName}/>
                <input className="inputAdress" type="text" placeholder="Contract Address" value={addressToken} onChange={handerAddress} />
               
            </div>
              <div style={{textAlign:"center",marginBottom:"15px"}}>
                  <button className="btn btn-secondary" style={{width:"65%"}} onClick={() => {addJeton();}} >
                   {" "}Confirm{" "}
            </button>
            <h2 style={{ color: "red" }}>{Veriferror}</h2></div>
        </Modal>
    )


};
export default PopupAddToken;