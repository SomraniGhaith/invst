import React, { useState, useEffect } from "react";

import "./SwapComponent.css";
import ethereum from "../../images/ethereum.svg";
import { getCoins } from "../../api/coins";
import { withRouter, RouteComponentProps } from "react-router";
import { useHistory, useLocation } from "react-router-dom";
import { onClickConnect } from "../../lib/Connect";
import useAsync from "../useAsync";
import { unlockAccount, getBalance } from "../../api/web3";
import { setNetworkId, setBalances } from "../../redux/actions";
const SwapComponent = (props: any) => {
  /*****************Begin State*****************/
  const [tolerance, setTolerance] = useState(props.tolerance);
  const [{ reserve1, reserve2 }, updateReserve] = useState({
    reserve1: "",
    reserve2: ""
  });
  const [input1, setInput1] = useState(""); // first amount
  const [input2, setInput2] = useState(""); // second amount

  const [balances, setBalances] = useState(new Map<string, string>());
  const [allowances, setAllowance] = useState(new Map<string, string>());
  const [amountMin, setamountMin] = useState("");
  const location = useLocation();
  /*****************End State*****************/

  const getCoinAddress = (name: string) => {
    //@ts-ignore
    for (let coin of getCoins(reseauId, swaplink)) {
      if (coin.name === name) {
        return coin.address;
      }
    }
    return "default";
  };
  const [selected1, setSelected1] = useState(
    !location.state
      ? "default"
      : getCoinAddress(JSON.parse(JSON.stringify(location.state)).paireOne)
  );
  const [selected2, setSelected2] = useState(
    !location.state
      ? "default"
      : getCoinAddress(JSON.parse(JSON.stringify(location.state)).paireTwo)
  );

  //  const renderFromContent = () => {
  //     let { from } = this.state;
  //     if (from === "")
  //       return (
  //         <button className={`selectToken ${from != "" ? "selected" : ""}`}>
  //           <span>select a token</span>
  //           <i className="fa fa-chevron-down"></i>
  //         </button>
  //       );
  //     else
  //       return (
  //         <button className={`selectToken ${from != "" ? "selected" : ""}`}>
  //           <span className="maxBalance">max</span>
  //           <img src={ethereum} alt="" className="tokenImage" />
  //           <span className="tokenName">Eth</span>
  //           <i className="fa fa-chevron-down"></i>
  //         </button>
  //       );
  //   };
  const handerValue1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput1(e.target.value);

    var x1 = parseFloat(reserve1);
    var x2 = parseFloat(reserve2);
    var y = parseFloat(e.target.value);

    if (e.target.value.length) {
      if (x1 > 0 && x2 > 0 && y > 0) {
        setInput2("" + (x2 * y) / x1);
        //setamountMin((y-(parseFloat(tolerance)*(parseFloat(input2)/100))).toString())
      }
    } else {
      setInput2("");
    }
  };
  function handerValue2(e: React.ChangeEvent<HTMLInputElement>) {
    setInput2(e.target.value);

    var x1 = parseFloat(reserve1);
    var x2 = parseFloat(reserve2);
    var y = parseFloat(e.target.value);

    if (e.target.value.length) {
      if (x1 > 0 && x2 > 0 && y > 0) {
        setInput1("" + (x1 * y) / x2);
      }
    } else setInput1("");
  }
  const balancetake = (slected: string) => {
    //  var b = await getBalance(web3, slected );
    // return toHumanReadableBalance(b , "");
    if (balances.has(slected)) {
      return balances.get(slected);
    }
    return "";
  };
  const { pending, error, call } = useAsync(unlockAccount);
  /***************Begin Effects***************/
  useEffect(() => {
    onClickConnect(call);
    setTolerance(!props.tolerance ? "1.1" : props.tolerance);
  }, [props.tolerance]);
  useEffect(() => {
    if (input2) {
      var amount2 = parseFloat(input2);
      var t = parseFloat(tolerance) / 100;
      var cof = amount2 * t;
      var res = amount2 - cof;
      setamountMin(res.toString());
    }
  }, [input2]);
  /***************End Effects***************/
  return (
    <div className="SwapComponent">
      <div className="swapFrom">
        <div className="info">
          <label htmlFor="">From</label>
          <span className="balance">Balance:{balancetake(selected1)}</span>
        </div>
        <div className="inputContainer">
          <input
            disabled={!parseFloat(reserve1)}
            type="text"
            pattern="^[0-9]*[.,]?[0-9]*$"
            placeholder="0.0"
            value={input1}
            onChange={handerValue1}
            name="from"
            id=""
          />
          {/* <div className="token">{renderFromContent}</div> */}
        </div>
        <p>
          {allowances.get(selected1)
            ? allowances.get(selected1) + "allowed"
            : ""}
        </p>
      </div>
      <div className="separator">
        <i className="fa fa-arrow-down"></i>
      </div>
      <div className="swapTo">
        <div className="info">
          <label htmlFor="">To</label>
          <span className="balance">Balance:{balancetake(selected2)}</span>
        </div>
        <div className="inputContainer">
          <input
            disabled={!parseFloat(reserve2)}
            type="text"
            pattern="^[0-9]*[.,]?[0-9]*$"
            placeholder="0.0"
            value={input2}
            onChange={handerValue2}
          />

          <div className="token">
            <button className="selectToken">
              {true ? (
                <span>select a token</span>
              ) : (
                <>
                  <span className="maxBalance">max</span>
                  <img src="" alt="" className="tokenImage" />
                  <span className="tokenName">Eth</span>
                </>
              )}
              <i className="fa fa-chevron-down"></i>
            </button>
          </div>
        </div>
        <p>
          {allowances.get(selected2)
            ? allowances.get(selected2) + "allowed"
            : ""}
        </p>
      </div>
      <div className="moreInfo">
        <div className="info">
          <span>slippage tolerance</span>
          <span>{tolerance}%</span>
        </div>
      </div>
      <button className="swapButton">Enter an amount</button>
    </div>
  );
};

export default SwapComponent;
