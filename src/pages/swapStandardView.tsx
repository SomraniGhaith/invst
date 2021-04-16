import React, { useState, useEffect, useReducer } from "react";
import "./swapView.css";
import "./swapStandardView.css"
import { unlockAccount, getBalance } from "../api/web3";
import { useWeb3Context } from "../contexts/Web3";
import Web3 from "web3";
import useAsync from "../components/useAsync";
import { getCoins, getCoinsZil } from "../api/coins";
import { getPaires } from "../api/Bonus";
import { getlogo } from "../api/logo";
import { swapExactTokensForTokens, approveDoing, getAllowance, swapExactETHForTokens, swapExactTokensForETH, getReserve, getBalancePair } from "../api/web3";
import { Modal } from "reactstrap";
import store from "../redux/store";
import { useHistory, useLocation } from "react-router-dom";
import PopupAddToken from "../components/Popup/PopupAddToken";


const bn = require("bn.js");

function SwapStandardView(props: any) {
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
  const [tolerance, setTolerance] = useState(props.tolerance);
  const location2 = useLocation();
  const [swaplink, setswaplink] = useState("novaswap");
  const [isOpen, setIsOpen] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup1, setOpenPopup1] = useState(false);
  const [confirmswap, setconfirmswap] = useState(false);
  const [successApprove, setsuccessApprove] = useState(false);
  const [loadingapprove, setloadingapprove] = useState(false);
  const [loadingswap, setloadingswap] = useState(false);
  const [succesSwap, setsuccesSwap] = useState(false);
  const [kovanTx, setkovanTx] = useState("");
  const [balances, setBalances] = useState(new Map<string, string>());
  const [allowances, setAllowance] = useState(new Map<string, string>());
  const [isOpen2, setIsOpen2] = useState(false);
  const [tokenSearch1, settokenSearch1] = useState("");
  const [tokenSearch2, settokenSearch2] = useState("");
  const [linkname, setlinkname] = useState("");
  const [logocoin, setlogocoin] = useState("");
  const [newInput, setNewInput] = useState("");
  const [logocoin2, setlogocoin2] = useState("");
  const [searchList, setSearchList] = useState<any[]>([]);
  const [searchList2, setSearchList2] = useState<any[]>([]);
  const [reseauId, setreseauId] = useState(parseFloat("" + store.getState().connection.networkId));
  const [listCoin, setListCoin] = useState<any[]>(getCoins(reseauId, swaplink));
  const [coinName1, setcoinName1] = useState(!location2.state ? "" : JSON.parse(JSON.stringify(location2.state)).paireOne);
  const [coinName2, setcoinName2] = useState(!location2.state ? "" : JSON.parse(JSON.stringify(location2.state)).paireTwo);
  const [addcoin, setaddcoin] = useState(false);
  const [addcoin2, setaddcoin2] = useState(false);
  const [addVerif, setaddVerif] = useState("");
  const [isOpen1, setIsOpen1] = useState(false);
  const [web3, setWeb3] = useState(new Web3());
  const [{ token1mustBeApproved, token1IsApproved }, setAprov] = useState({ token1mustBeApproved: false, token1IsApproved: false }); // token1mustBeApproved button is visible
  const [input1, setInput1] = useState(""); // first amount
  const [input2, setInput2] = useState(""); // second amount
  const location = useLocation();
  const [{ reserve1, reserve2 }, updateReserve] = useState({ reserve1: "", reserve2: "" });
  const [amountMin, setamountMin] = useState("");
  const [search1, setSearch1] = useState(false);
  const [search2, setSearch2] = useState(false);



  async function getCoinName1(address: string) {
    if (props.walletName !== "Zilliqa") {
      //@ts-ignore
      getCoins(reseauId, swaplink).map(coin => {
        if (coin.address === address) {
          setcoinName1("" + coin.name);

        } else return "";
      });
    }
    else {
      //@ts-ignore
      getCoinsZil(props.zilliqa.netId.toString()).map((coin, index) => {
        if (coin.address === address) {
          setcoinName1("" + coin.name);

        } else return "";
      });
    }


  }

  async function getCoinName2(address: string) {
    if (props.walletName !== "Zilliqa") {
      //@ts-ignore
      getCoins(reseauId, swaplink).map(coin => {
        if (coin.address === address) {
          setcoinName2("" + coin.name);

        } else return "";
      });
    }

    else {
      //@ts-ignore
      getCoinsZil(props.zilliqa.netId.toString()).map((coin, index) => {
        if (coin.address === address) {
          setcoinName2("" + coin.name);

        } else return "";
      });
    }

  }


  function getLogo1ByAddress(add: string) {
    //@ts-ignore
    getCoins(reseauId, swaplink).map(coin => {
      if (coin.address === add) {
        setlogocoin(coin.logo);
      }
    });
  }
  function getLogo2ByAddress(add: string) {
    //@ts-ignore
    getCoins(reseauId, swaplink).map(coin => {
      if (coin.address === add) {
        setlogocoin2(coin.logo);
      }
    });
  }
  //When pair does not exist navigate to bonus 1
  const history = useHistory();
  async function navigate(paireOne: any, paireTwo: any) {
    history.push({
      pathname: "/Bonus1",
      state: { paireOne: paireOne, paireTwo: paireTwo }
    });
  }

  function navigateToSwap() {
    // store.dispatch(setScanLink("https://kovan.etherscan.io/tx/"));

    setInput1("")
    setInput2("")
    setconfirmswap(false)
    getReserveSwap(web3, selected2, selected1);
    setsuccessApprove(false)
    setsuccesSwap(false)

  }

  function getLinkName() {
    if (reseauId === 42) {
      setlinkname("https://kovan.etherscan.io/tx/");
    } else if (reseauId === 4) {
      setlinkname("https://rinkeby.etherscan.io/tx/");
    }
  }

  function handerSearch(e: React.ChangeEvent<HTMLInputElement>) {
    var searching = e.target.value;
    //console.log("valeur ==>" + searching)
    var list: any = [];
    setSearch1(false);
    settokenSearch1(searching)
    var res1 = searching.substring(0, 1);
    //console.log("res1 ==>" + res1)

    if (res1.toUpperCase() !== "0") {
      getlogo().forEach(element => {
        if (props.walletName === "Zilliqa") {
          //@ts-ignore
          var result1 = getCoinsZil(props.zilliqa.netId.toString()).filter(
            coin => coin.name.toUpperCase().includes(searching.toUpperCase())
          );
        }
        else {
          //@ts-ignore
          var result1 = getCoins(reseauId, element.name).filter(
            coin => coin.name.toUpperCase().includes(searching.toUpperCase())
          );
        }
        //console.log(getCoins(reseauId, element.name));
        //console.log("apres filter" + JSON.stringify(result1))

        // var address = result1[0] != undefined ? result1[0].address : null;

        result1.map(el => {


          var object = { link: element.name, address: el.address, name: el.name, logo: el.logo };

          if (object.address) {
            list.push(object);
            getLogo1ByAddress(object.address);
            setSearchList(list);
            setSearch1(true);
            setSelected1(object.address);
          }
        });
      })


    } else if (res1.toUpperCase() === "0") {
      getlogo().forEach(element => {
        if (props.walletName === "Zilliqa") {
          //@ts-ignore
          var result1 = getCoinsZil(props.zilliqa.netId.toString()).filter(
            coin => coin.name.toUpperCase().includes(searching.toUpperCase())
          );
        }
        else {
          //@ts-ignore
          var result1 = getCoins(reseauId, element.name).filter(
            coin => coin.address.toUpperCase().includes(searching.toUpperCase())
          );
        }
        //console.log("apres filter" + JSON.stringify(result1[0]))
        result1.map(el => {


          var object = { link: element.name, address: el.address, name: el.name, logo: el.logo };

          if (object.address) {
            list.push(object);
            getLogo1ByAddress(object.address);
            setSearchList(list);
            setSearch1(true);
            setSelected1(object.address);
          }

        });
      })
    }
  }
  function handerSearch2(e: React.ChangeEvent<HTMLInputElement>) {
    var searching = e.target.value;
    //console.log("valeur ==>" + searching)
    var list: any = [];
    setSearch2(false);
    settokenSearch2(searching)
    var res1 = searching.substring(0, 1);


    if (res1.toUpperCase() !== "0") {
      getlogo().forEach(element => {

        if (props.walletName === "Zilliqa") {
          //@ts-ignore
          var result1 = getCoinsZil(props.zilliqa.netId.toString()).filter(
            coin => coin.name.toUpperCase().includes(searching.toUpperCase())
          );
        }
        else {
          //@ts-ignore
          var result1 = getCoins(reseauId, element.name).filter(
            coin => coin.address.toUpperCase().includes(searching.toUpperCase())
          );
        }
        result1.map(el => {
          var object = { link: element.name, address: el.address, name: el.name, logo: el.logo };
          if (object.address) {
            list.push(object);
            getCoinName2(object.address);
            setSearchList2(list);
            setSelected2(object.address);
            setSearch2(true);
            getLogo2ByAddress(object.address);
          }
        });
      });
    } else if (res1.toUpperCase() === "0") {
      getlogo().forEach(element => {
        if (props.walletName === "Zilliqa") {
          //@ts-ignore
          var result1 = getCoinsZil(props.zilliqa.netId.toString()).filter(
            coin => coin.name.toUpperCase().includes(searching.toUpperCase())
          );
        }
        else {
          //@ts-ignore
          var result1 = getCoins(reseauId, element.name).filter(
            coin => coin.address.toUpperCase().includes(searching.toUpperCase())
          );
        }

        result1.map(el => {
          var object = { link: element.name, address: el.address, name: el.name, logo: el.logo };
          if (object.address) {
            list.push(object);
            getLogo2ByAddress(object.address);
            getCoinName2(object.address);
            setSearch2(true);
            setSearchList(list);
            setSelected2(object.address);
          }
        });
      })
    }
  }

  const getCoinAddress = (name: string) => {

    const coins = getCoins(reseauId, swaplink).filter(coin => coin.name === name)
    if (coins.length > 0) {
      return coins[0].address
    }
    return "default";
  };
  const [selected1, setSelected1] = useState((!location.state ? "default" : getCoinAddress(JSON.parse(JSON.stringify(location.state)).paireOne)));
  const [selected2, setSelected2] = useState((!location.state ? "default" : getCoinAddress(JSON.parse(JSON.stringify(location.state)).paireTwo)));

  function changeswap(nameSwap: string) {
    setswaplink(nameSwap);
    setSelected1("default");
    setSelected2("default");
    setInput1("");
    setInput2("");
    setcoinName1("");
    setcoinName2("");
    updateReserve({ reserve1: "", reserve2: "" });
  }
  function inverseInputSelect() {
    setSelected1(selected2);
    setSelected2(selected1);
    setInput1(input2);
    setInput2(input1);
    getReserveSwap(web3, selected1, selected2);
    setcoinName1(coinName2);
    setcoinName2(coinName1);
    getLogo1ByAddress(selected2)
    getLogo2ByAddress(selected1)
  }
  function compareTokenParReserve(amount: string, reserveToken: string) {
    var amountPut = parseFloat(amount);
    var reservePut = parseFloat(reserveToken);
    if (amountPut > reservePut) {
      return true;
    }
  }
  function toggleModal() {
    setIsOpen(!isOpen);
  }

  function toggleModal1() {
    setIsOpen1(!isOpen1);
    if (openPopup1) {
      setOpenPopup1(false)
    }
  }
  function toggleModal2() {
    setIsOpen2(!isOpen2);
    if (openPopup) {
      setOpenPopup(false)
    }
  }
  var paireName: any[] = [];
  getPaires().map(val => val.pairesName.map(name => paireName.push(name)));
  //function for get web 3  we use setData(data.web3)
  // u

  async function onClickAmount() {
    if (selected1 !== "ETH" && selected2 !== "ETH") {
      swapExactTokensForTokens(web3, selected1, selected2, input1, swaplink, "0", reseauId,
        (err, result) => {
          if (err) {
            // alert("err" + err)
            setloadingswap(false); //rejeter swap
          } else {
            setkovanTx(JSON.parse("" + result).tx);

            setsuccesSwap(true);

          }
          //const for amountToleranceMin

          //  alert(JSON.parse(result).tx);
          // @ts-ignore


          setconfirmswap(false);
        }
      );
    } else if (selected1 == "ETH" && selected2 !== "ETH") {

      return swapExactETHForTokens(web3, selected1, selected2, input1, input2, swaplink, "0", reseauId,
        (err, result) => {
          if (err) {
            setloadingswap(false);
          } else {

            setkovanTx(JSON.parse("" + result).tx);
            setsuccesSwap(true);

          }
          setconfirmswap(false);
        }
      );
    } else {
      swapExactTokensForETH(web3, selected1, selected2, input1, "0", swaplink, reseauId,
        (err, result) => {
          if (err) {
            setloadingswap(false);
          } else {


            setkovanTx(JSON.parse("" + result).tx);

            setsuccesSwap(true);

          }
          setconfirmswap(false);
        }
      );
    }
  }
  const balancetake = (slected: string) => {
    //  var b = await getBalance(web3, slected );
    // return toHumanReadableBalance(b , "");
    if (balances.has(slected)) {
      return balances.get(slected);
    }
    return "";
  };
  const { state: { account, netId, balance }, updateAccount } = useWeb3Context();
  const { pending, error, call } = useAsync(unlockAccount);
  function checkbalance(input1: string, testBalence: string) {

    var x = parseFloat(input1);
    // @ts-ignore
    var b = parseFloat(balancetake(testBalence));
    if (x > b || b === 0) {
      return true;
    } else {
      return false;
    }
  }
  async function onClickConnect() {
    //  let newAllownces = new Map<string, string>();
    let newBalances = new Map<string, string>();
    const { error, data } = await call(null);

    if ((props.walletName === "Zilliqa")&&(props.zilliqa.accountBase16)) {
      var address = props.zilliqa.accountBase16

      //@ts-ignore
      getCoinsZil(props.zilliqa.netId).forEach(token => {
        if (token.name === "ZIL") {
          newBalances.set(token.address, props.zilliqa.balance)
        }
        else {

          fetch('/api/balanceZil?account=' + address + '&token=' + token.address, {
            method: 'GET',
            headers: {
              'content-type': 'application/json;charset=UTF-8',
            },

          })
            .then(response => response.json())
            .then(data => {
          
              newBalances.set(token.address, data.result)
           
              
            })
            .catch((error) => {
             // alert("Data out connection");

              console.error('Error:', error);
            });
        }
      });

    }
    if (data) {

      setWeb3(data.web3);
      getLinkName();
      // setTolerance(""+localStorage.getItem('Tolerance'));
      //// netId pour la
      if (location.state) {
        getBalancePair(data.web3, "" + selected1, (err, balancePair) => {
          if (!err) {
            balancePair = !balancePair ? "" : balancePair
            //@ts-ignore
            newBalances.set(selected1, "" + toHumanReadableBalance("" + balancePair.toString(), "")
            );
          } else return;
        });
      }


      getCoins(reseauId, swaplink).forEach(coin => {
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
          getAllowance(data.web3, coin.address, swaplink, reseauId, (error, b) => {
            if (error) {

            }
            if (b) {

              allowances.set(coin.address, toHumanReadableBalance(b.toString(), ""));
              // forceUpdate()
            }
          }
          );
        }
        if (location.state) {
          getReserveSwap(
            data.web3,
            getCoinAddress(JSON.parse(JSON.stringify(location.state)).paireOne),
            getCoinAddress(JSON.parse(JSON.stringify(location.state)).paireTwo)
          );
        }
      });
      //    setAccount({account: data.account , balance: balance });
      updateAccount(data);
      setBalances(newBalances)
      // setAllowance(newAllownces)
      forceUpdate()
    }
  }
  /*------Calcul montant minimal -------- */
  function CalculMin() {
    if (input2) {
      var amount2 = parseFloat(input2);
      var t = parseFloat(tolerance) / 100;
      var cof = amount2 * t;
      var res = amount2 - cof;
      setamountMin(res.toString());
    }
  }
  const toHumanReadableBalance = (balance: string, unit: string) => {
    var getBalanceFloat = parseFloat(balance);
    return (getBalanceFloat / 1000000000000000000).toFixed(3);
  };
  function formAccount(x: String) {
    var str = x;
    var res1 = str.substring(0, 6);
    var res2 = str.substring(str.length - 4, str.length);
    var res = res1.concat("...", res2);
    return res;
  }




  function handerValue1(e: React.ChangeEvent<HTMLInputElement>) {
    setInput1(e.target.value);
    setNewInput(e.target.value);
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
  }
  function handerNewValue(e: React.ChangeEvent<HTMLInputElement>) {

    setNewInput(e.target.value)
    if (e.target.value.length) {
      if (e.target.value === input1) {
        // alert(" equel input 1 =" + input1 + " new input =" + newInput)
      }

      else {
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

      }
    }
  }
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
  useEffect(() => {
    CalculMin();
    onClickConnect();
    setTolerance(!props.tolerance ? "1.1" : props.tolerance);
  }, [reserve1, reserve2, input1, kovanTx, input2, tolerance, swaplink, props.tolerance, newInput, props.walletName, props.zilliqa]);
  function approveButtonVisible() {
    var condition = allowances.get(selected1) &&
      parseFloat("" + allowances.get(selected1)) < parseFloat(input1);
    return condition;
  }
  function getReserveSwap(web3: Web3, token1: string, token2: string) {
    updateReserve({ reserve1: "loading ..", reserve2: "loading .." });
    getReserve(web3, token1, token2, swaplink, reseauId, (err, result) => {
      //callbcack its funtion fo what we do then
      if (err) {
        updateReserve({ reserve1: "--", reserve2: "--" });
      } else {
        var reserves = result ? JSON.parse(result) : {};
        if (reserves["0"] && reserves["1"]) {
          var val1 = new bn(reserves["0"], 16);
          var val2 = new bn(reserves["1"], 16);


          return updateReserve({
            reserve1: toHumanReadableBalance(val1, ""),
            reserve2: toHumanReadableBalance(val2, "")
          });
        } else {
          return updateReserve({ reserve1: "--", reserve2: "--" });
        }

      }
    });

  }
  function doApprove() {
    if (input1 !== newInput && newInput != "" && parseFloat(newInput) != 0) {
      setInput1(newInput)
    }
    approveDoing(web3, selected1, input1, swaplink, reseauId, (err, result) => {
      if (err) {
        setloadingapprove(false);
      } else {
        setsuccessApprove(true);
        setloadingapprove(false);
      }
    });
    /*  else {
       approveDoing(web3, selected1, input1, swaplink, reseauId, (err, result) => {
         if (err) {
           setloadingapprove(false);
         } else {
           setsuccessApprove(true);
           setloadingapprove(false);
         }
       });
     } */
  }
  function openPopupAdd() {
    setOpenPopup(true)
  }
  function openPopupAdd1() {
    setOpenPopup1(true)
  }
  const handleSelectFrom = ({ address }: any) => {
    // alert("ok")
    setSelected1(address);
    toggleModal1();
    getCoinName1(address);
    if (selected2 !== "default") {
      getReserveSwap(web3, address, selected2);
    }
    props.changeTokenFrom(address)


  }
  const handleSelectTo = ({ address }: any) => {
    props.changeTokenTo(address);
  }


  return (

    <div className="main-layout inner_page">
 
        <div >
          {/* ---------- MODAL1   ------------------ */}
          <Modal
            isOpen={isOpen1}
            //  onRequestClose={toggleModal1}
            contentlabel="My dialog"
          // className="modal-content1"
          >
            {" "}
            <div>
              <div className="modaltitle1">
                <p style={{ fontSize: "24px" }}>
                  Select a token
            </p>

                <div style={{ textAlign: "center" }}>
                  <button className="btn btn-secondary" onClick={() => { openPopupAdd1() }}>
                    Add New Token
                  </button>
                  <PopupAddToken isOpenPopup={openPopup1} />
                </div>
                <button
                  onClick={toggleModal1}
                  style={{ backgroundColor: "transparent", color: "#6c757d" }}
                >
                  <i className="fa fa-times" aria-hidden="true" style={{ fontSize: "30px" }}></i>
                </button>
              </div>

              <div className="modalbody">
                <div className="row">
                  <div className="col-12">
                    <div className="search">
                      <input className="inputSearch" type="text" placeholder="Search name" value={tokenSearch1} onChange={handerSearch} />
                    </div>

                    <div style={{ height: "395px", width: "100%", overflowY: "auto", overflowX: "hidden" }}>
                      {tokenSearch1.length ? (
                        search1 ? (
                          <div style={{ height: "100%", overflow: "auto" }}>
                            {searchList.map((t, i) => (
                              <div key={i} style={{ display: "flex", justifyContent: "space-between" }} onClick={() => { handleSelectFrom(t) }}>
                                <div style={{ display: "flex" }}>
                                  <img src={t.logo} width="50px" />
                                  <option className="optionsslecttoken" value={t.address}
                                    onClick={() => {
                                      setSelected1(t.address);
                                      toggleModal1();
                                      getCoinName1(t.address);
                                      setlogocoin(t.logo);
                                      if (selected2 !== "default") {
                                        getReserveSwap(web3, t.address, selected2);
                                      }
                                    }}>
                                    {" "}{t.name}{" "}{t.link}
                                  </option>
                                </div>
                                <span className="optionsslecttoken"
                                  onClick={() => {
                                    setSelected1(t.address);
                                    toggleModal1();
                                    getCoinName1(t.address);
                                    setlogocoin(t.logo);
                                    if (selected2 !== "default") {
                                      getReserveSwap(web3, t.address, selected2);
                                    }
                                  }}>
                                  {balancetake(t.address)}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                            <div></div>
                          )
                      ) : (
                          (props.walletName !== "Zilliqa") ? (
                            <div>

                              {//@ts-ignore

                                getCoins(reseauId, swaplink).map((t, i) => (
                                  <div
                                    key={i}
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between"
                                    }}
                                    onClick={() => { handleSelectFrom(t) }}     >
                                    <div style={{ display: "flex" }}>
                                      <img
                                        src={t.logo}
                                        width="50px"
                                        onClick={() => {
                                          setSelected1(t.address);
                                          toggleModal1();
                                          getCoinName1(t.address);
                                          setlogocoin(t.logo);
                                          if (selected2 !== "default") {
                                            getReserveSwap(web3, t.address, selected2);
                                          }
                                        }}
                                      />
                                      <option
                                        className="optionsslecttoken"
                                        onClick={() => {
                                          setSelected1(t.address);
                                          toggleModal1();
                                          getCoinName1(t.address);
                                          setlogocoin(t.logo);
                                          if (selected2 !== "default") {
                                            getReserveSwap(web3, t.address, selected2);
                                          }
                                        }}
                                        value={t.address}
                                      >
                                        { }{t.name}{" "}
                                      </option>
                                    </div>
                                    <span
                                      className="optionsslecttoken"
                                      onClick={() => {
                                        setSelected1(t.address);
                                        toggleModal1();
                                        getCoinName1(t.address);
                                        setlogocoin(t.logo);
                                        if (selected2 !== "default") {
                                          getReserveSwap(web3, t.address, selected2);
                                        }
                                      }}
                                    >
                                      {balancetake(t.address)}
                                    </span>
                                  </div>
                                ))}
                            </div>) : (
                              <div>
                                {props.zilliqa !== undefined ? (
                                  //@ts-ignore
                                  getCoinsZil(props.zilliqa.netId.toString()).map((element, index) => (

                                    <div key={index} className="optionsslecttoken"
                                      style={{ display: "flex", justifyContent: "space-between" }}
                                    >
                                      <div style={{ display: "flex" }}>
                                        <img
                                          src={element.logo}
                                          width="40px"
                                          style={{ borderRadius: "50px", padding: "7px" }}
                                          onClick={() => {
                                            setSelected1(element.address);
                                            getCoinName1(element.address);
                                            toggleModal1();
                                            setlogocoin(element.logo);

                                          }}
                                        />
                                        <option
                                          className="optionsslecttoken"
                                          onClick={() => {
                                            setSelected1(element.address);
                                            getCoinName1(element.address);
                                            toggleModal1();
                                            setlogocoin(element.logo);

                                          }}
                                        > {element.name}</option>
                                      </div>

                                      <span
                                        onClick={() => {
                                          setSelected1(element.address);
                                          getCoinName1(element.address);
                                          toggleModal1();
                                          setlogocoin(element.logo);

                                        }}
                                        className="optionsslecttoken">{balancetake(element.address)}</span>

                                    </div>


                                  ))

                                ) :
                                  null

                                }

                              </div>

                            )
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
          {/* ---------- MODAL2   ------------------ */}
          <Modal
            isOpen={isOpen2}
            contentlabel="My dialog"
          //  className="modal-content1"
          >
            {" "}
            <div>
              <div className="modaltitle1">
                <p style={{ fontSize: "24px" }}>
                  Select a token
            </p>
                <div style={{ textAlign: "center" }}>
                  <button className="btn btn-secondary" onClick={() => { openPopupAdd() }}>
                    Add New Token
                  </button>
                  <PopupAddToken isOpenPopup={openPopup} />
                </div>
                <button
                  onClick={toggleModal2}
                  style={{ backgroundColor: "transparent", color: "#6c757d" }}
                >
                  <i className="fa fa-times" aria-hidden="true" style={{ fontSize: "30px" }}></i>
                </button>
              </div>
              <div className="modalbody" style={{ display: "grid", backgroundColor: "#353434" }}>
                <div className="row">
                  <div className="col-12">
                    <div className="search">
                      <input type="text" className="inputSearch" placeholder="Search name" value={tokenSearch2} onChange={handerSearch2} />
                    </div>

                    <div style={{ height: "395px", width: "100%", overflowY: "auto", overflowX: "hidden" }}>



                      {tokenSearch2.length ? (
                        search2 ? (
                          <div style={{ height: "100%", overflow: "auto" }}>
                            {searchList2.map((e, i) => (
                              <div
                                key={i}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between"
                                }}
                                onClick={() => { handleSelectTo(e) }} >
                                <div style={{ display: "flex" }}>
                                  <img
                                    src={e.logo}
                                    width="50px"
                                    onClick={() => {
                                      setSelected2(e.address);
                                      toggleModal2();
                                      getCoinName2(e.address);
                                      setlogocoin2(e.logo);
                                      if (selected1 !== "default") {
                                        getReserveSwap(
                                          web3,
                                          e.address,
                                          selected1
                                        );
                                      }
                                    }}
                                  />
                                  <option
                                    className="optionsslecttoken"
                                    onClick={() => {
                                      setSelected2(e.address);
                                      toggleModal2();
                                      getCoinName2(e.address);
                                      setlogocoin2(e.logo);
                                      if (selected1 !== "default") {
                                        getReserveSwap(
                                          web3,
                                          e.address,
                                          selected1
                                        );
                                      }
                                    }}
                                    value={e.address}
                                  >
                                    {" "}{e.name}{" "}{e.link}
                                  </option>
                                </div>
                                <span
                                  className="optionsslecttoken"
                                  onClick={() => {
                                    setSelected2(e.address);
                                    toggleModal2();
                                    getCoinName2(e.address);
                                    if (selected1 !== "default") {
                                      getReserveSwap(web3, e.address, selected1);
                                    }
                                  }}
                                >
                                  {balancetake(e.address)}
                                </span>{" "}
                              </div>
                            ))}
                          </div>
                        ) : (
                            <div></div>
                          )
                      ) : (props.walletName !== "Zilliqa" ? (
                        <div>
                          {//@ts-ignore
                            getCoins(reseauId, swaplink).map((e, i) => (
                              <div
                                key={i}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between"
                                }}
                                onClick={() => { handleSelectTo(e) }}  >
                                <div style={{ display: "flex" }} >
                                  <img
                                    src={e.logo}
                                    width="50px"
                                    onClick={() => {
                                      setSelected2(e.address);
                                      toggleModal2();
                                      getCoinName2(e.address);
                                      setlogocoin2(e.logo);
                                      if (selected1 !== "default") {
                                        getReserveSwap(web3, e.address, selected1);
                                      }
                                    }}
                                  />
                                  <option
                                    className="optionsslecttoken"
                                    onClick={() => {
                                      setSelected2(e.address);
                                      toggleModal2();
                                      getCoinName2(e.address);
                                      setlogocoin2(e.logo);
                                      if (selected1 !== "default") {
                                        getReserveSwap(web3, e.address, selected1);
                                      }
                                    }}
                                    value={e.address}
                                  >
                                    {e.name}{" "}
                                  </option>
                                </div>
                                <span
                                  className="optionsslecttoken"
                                  onClick={() => {
                                    setSelected2(e.address);
                                    toggleModal2();
                                    getCoinName2(e.address);
                                    setlogocoin2(e.logo);
                                    if (selected1 !== "default") {
                                      getReserveSwap(web3, e.address, selected1);
                                    }
                                  }}
                                >
                                  {balancetake(e.address)}
                                </span>{" "}
                              </div>
                            ))}
                        </div>) : (
                          <div>
                            {props.zilliqa !== undefined ? (
                              //@ts-ignore
                              getCoinsZil(props.zilliqa.netId.toString()).map((element, index) => (
                                <div key={index} className="optionsslecttoken"
                                  style={{ display: "flex", justifyContent: "space-between" }}
                                >
                                  <div style={{ display: "flex" }}>
                                    <img
                                      src={element.logo}
                                      width="40px"
                                      style={{ borderRadius: "50px", padding: "4px" }}
                                      onClick={() => {
                                        setSelected2(element.address);
                                        getCoinName2(element.address);
                                        toggleModal2();
                                        setlogocoin2(element.logo);

                                      }}
                                    />
                                    <option
                                      className="optionsslecttoken"
                                      onClick={() => {
                                        setSelected2(element.address);
                                        getCoinName2(element.address);
                                        toggleModal2();
                                        setlogocoin2(element.logo);

                                      }}
                                    > {element.name}</option>
                                  </div>

                                  <span
                                    onClick={() => {
                                      setSelected2(element.address);
                                      getCoinName2(element.address);
                                      toggleModal2();
                                      setlogocoin2(element.logo);

                                    }}
                                    className="optionsslecttoken">{balancetake(element.address)}</span>

                                </div>



                              ))

                            ) :
                              null

                            }

                          </div>

                        )
                        )}

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
          <Modal isOpen={isOpen} contentlabel="My dialog" className="modalswap" >
            {" "}
            {!succesSwap ? (
              <div className="modalbody" style={{ backgroundColor: "#212429", color: "white" }}>
                <div className="modaltitle" style={{ backgroundColor: "#212429", color: "white" }}>
                  <div style={{ fontSize: "30px", fontFamily: "Open Sans", color: "white" }}>
                    Confirm Swap
              </div>
                  <button
                    onClick={toggleModal}
                    style={{ backgroundColor: "#212429", color: "white" }}
                  >
                    <i className="fa fa-times" aria-hidden="true" style={{ fontSize: "30px" }}></i>
                  </button>
                </div>

                <div className="dropdownSwap">
                  <div style={{ marginLeft: "20px" }}>
                    <img src={logocoin} width="35px" />

                    <span
                      className="info-confirm-swap"
                    >
                      {input1.includes(".")
                        ? input1.substring(0, input1.indexOf(".") + 4)
                        : input1}
                    </span>  </div>
                  <div>
                    <span
                      className="info-confirm-swap"
                    >
                      {coinName1}
                    </span></div>
                </div>
                <div style={{ marginLeft: "30px", fontSize: "22px" }}>
                  {/* <i className="fa fa-arrow-down" aria-hidden="true"></i> */}
              ↓
            </div>

                <div className="dropdownSwap">
                  <div style={{ marginLeft: "20px" }}>
                    <img src={logocoin2} width="37px" />
                    <span className="info-confirm-swap">
                      {input2.includes(".")
                        ? input2.substring(0, input2.indexOf(".") + 4)
                        : input2}
                    </span> </div>
                  <div>
                    <span className="info-confirm-swap">
                      {coinName2}
                    </span></div>
                </div>
                <div style={{ backgroundColor: "#2c2f36" }}>
                  <div >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "1rem",

                      }}
                    >
                      <span
                        className="info-swap"
                      >
                        Price{" "}
                      </span>
                      <span
                        className="info-swap"
                      >
                        {isNaN(parseFloat(reserve2)) ? (
                          <div> </div>
                        ) : (parseFloat(reserve2) / parseFloat(reserve1))
                          .toString()
                          .includes(".") ? (
                              (parseFloat(reserve2) / parseFloat(reserve1))
                                .toString()
                                .substring(
                                  0,
                                  (parseFloat(reserve2) / parseFloat(reserve1))
                                    .toString()
                                    .indexOf(".") + 4
                                )
                            ) : (
                              (parseFloat(reserve2) / parseFloat(reserve1)).toString()
                            )}{" "}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "1rem"
                      }}
                    >
                      <span
                        className="info-swap"
                      >
                        Minimum received{" "}
                      </span>
                      <span
                        className="info-swap"
                      >
                        {amountMin.includes(".")
                          ? amountMin.substring(0, amountMin.indexOf(".") + 4)
                          : amountMin}
                        {coinName2}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "1rem"
                      }}
                    >
                      <span
                        className="info-swap"
                      >
                        Price Impact{" "}
                      </span>
                      <span
                        className="info-swap"
                      >
                        0.21%
                </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "1rem"
                      }}
                    >
                      <span
                        className="info-swap"
                      >
                        Liquidity Provider Fee{" "}
                      </span>
                      <span
                        className="info-swap"
                      >
                        0.003 {coinName1}
                      </span>
                    </div>
                  </div>
                  {!confirmswap ? (
                    <button
                      className="approvebtnmodal"
                      style={{ backgroundColor: "#2172e5" }}
                      onClick={() => {
                        onClickAmount();
                        setconfirmswap(true);
                        setloadingswap(true);
                      }}
                    >
                      Confirm Swap
                    </button>
                  ) : loadingswap ? (
                    <>
                      <button className="approveedbtnmodal">
                        {" "}
                Loading <i className="fa fa-spinner fa-spin"></i>{" "}
                      </button>
                      {/* //    <span onClick={()=>{window.location.reload()}}>Reload</span> */}
                    </>

                  ) : null}
                </div></div>
            ) : (
                <div className="modalbody" style={{ backgroundColor: "#353434" }}>
                  <div className="modaltitle" style={{ backgroundColor: "#353434" }}>
                    <div style={{ fontSize: "30px", fontWeight: "bold" }}></div>
                    <button
                      onClick={toggleModal}
                      style={{ backgroundColor: "#353434" }}
                    >
                      <i className="fa fa-times" aria-hidden="true" style={{ fontSize: "30px" }}></i>
                    </button>
                  </div>
                  <div className="transactionsub">
                    <p>Transaction Submitted</p>
                    <a href={linkname + kovanTx} target="_blank">
                      View on Etherscan
              </a>
                    <button
                      className="closebtn"
                      onClick={() => {
                        setIsOpen(false)
                        //  console.log({coinName1 , coinName2})
                        navigateToSwap()



                      }}
                      style={{ backgroundColor: "#ce4ed2" }}
                    >
                      Close
              </button>
                  </div>
                </div>
              )}
          </Modal>

          {/* --------------------------------------------------------------------- */}

          <div className="section">
            <div className="col-md-12">
              <div className="cardblance">
                <div className="carditem ">
                  <div className="balencefrom">
                    <div className="col-7">
                      <p className="info-text">
                        From{" "}
                      </p>
                      <input className="addbalence" disabled={!parseFloat(reserve1)} type="text" pattern="^[0-9]*[.,]?[0-9]*$" placeholder="0.0" value={input1} onChange={handerValue1} />
                      {input1 !== "" ? (
                        <p className="clasAllowed">
                          {" "} {parseFloat("" + allowances.get(selected1)) > 0
                            ? allowances.get(selected1) + " allowed"
                            : ""}{" "}
                        </p>
                      ) : (null)}
                    </div>
                    <div className="info-token col-5">
                      <p className="info-text">
                        {" "}Balance: {balancetake(selected1)}
                      </p>
                      <button className="selecttokenbtn" onClick={toggleModal1}>
                        <img src={logocoin} width="37px"
                          style={{ borderRadius: "50px", padding: "4px" }}
                        />{" "}
                        {coinName1 ? coinName1 : "Select Token"}{" "}
                        <i className="fa fa-angle-down"></i>
                      </button>
                    </div>
                  </div>
                  {selected2 !== "default" && selected1 !== " default" ? (
                    <div className="buttonInverse">
                      <button onClick={() => inverseInputSelect()} className="buttonInverseInput">{" "}
                        <i className="fa fa-arrow-down" aria-hidden="true" style={{ fontSize: "30px" }} ></i>{" "}
                      </button>
                    </div>
                  ) : (
                      <div className="buttonInverse">
                        <button disabled className="buttonInverseInput">{" "}
                          <i className="fa fa-arrow-down" aria-hidden="true" style={{ fontSize: "30px" }}></i>{" "}
                        </button>
                      </div>
                    )}
                  <div className="balencefrom">
                    <div className="col-7">
                      <p className="info-text" >To{" "}</p>
                      <input className="addbalence" disabled={!parseFloat(reserve2)} type="text" pattern="^[0-9]*[.,]?[0-9]*$" placeholder="0.0" value={input2} onChange={handerValue2} />
                      {input2 !== "" ? (
                        <p className="clasAllowed">
                          {" "}{parseFloat("" + allowances.get(selected2)) > 0
                            ? allowances.get(selected2) + " allowed"
                            : ""}{" "}
                        </p>
                      ) : (null)}
                    </div>
                    <div className="info-token col-5">
                      <p>
                        <span className="info-text">
                          Balance: {balancetake(selected2)}
                        </span>
                      </p>
                      <button className="selecttokenbtn" onClick={toggleModal2}>
                        <img src={logocoin2} width="37px"
                          style={{ borderRadius: "50px", padding: "4px" }}
                        />{" "}
                        {coinName2 ? coinName2 : "Select Token"}{" "}
                        <i className="fa fa-angle-down"></i>
                      </button>
                    </div>
                  </div>
                  <div className="styleCaract">
                    <p className="info-text fontText" >Slippage Tolerance{" "}</p>
                    <p className="info-text" >{tolerance}%</p>
                  </div>
                  {/* ------------Price--------------------- */}
                  <div className="styleCaract">
                    <span className="info-text fontText">Price{" "}</span>
                    <span className="info-text">
                      {" "}{isNaN(parseFloat(reserve2)) ? (
                        null
                      ) : (parseFloat(reserve2) / parseFloat(reserve1))
                        .toString()
                        .includes(".") ? (
                            (parseFloat(reserve2) / parseFloat(reserve1))
                              .toString()
                              .substring(
                                0,
                                (parseFloat(reserve2) / parseFloat(reserve1))
                                  .toString()
                                  .indexOf(".") + 4
                              )
                          ) : (
                            (parseFloat(reserve2) / parseFloat(reserve1)).toString()
                          )}{" "}
                    </span>
                  </div>
                  <div className="styleCaract">
                    <p className="info-text fontText">Reserve {coinName1}{" "}</p>
                    <p className="info-text">{reserve1}</p>
                  </div>
                  <div className="styleCaract">
                    <p className="info-text fontText">Reserve {coinName2}{" "}</p>
                    <p className="info-text">{reserve2}</p>
                  </div>
                  {// Reserve is null go to links
                    /*----------------------------------------------------------------------*/
                    selected2 == "default" ? (
                      <div>
                        <div className="styleCaract">
                          <p className="info-text fontText" >Exchange used</p>
                          <div
                            className="dropdown dropdownSwap" >
                            {!swaplink ? (
                              <button className="btn btn-secondary dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Select...
                              </button>
                            ) : (
                                <button className="btn btn-secondary dropdown-toggle " style={{ backgroundColor: "#1a1e23" }}
                                  id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
                                  {swaplink}
                                </button>
                              )}
                            <div className="dropdown-menu dropdownMenu" aria-labelledby="dropdownMenuButton" >
                              {getlogo().map((e, index) => (
                                <button key={index} className="dropdown-item-swaplink" onClick={() => { changeswap(e.name); }} >
                                  <img src={e.icon} width="20%" />{" "}
                                  {e.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="amount">Select a token</div>
                      </div>
                    ) : selected2 == selected1 ? (
                      <div className="amount">Select different token </div>
                    ) : reserve1 === "--" && reserve1 === "--" ? (
                      <div style={{ textAlign: "center" }}>
                        <div className="styleCaract">
                          <p className="info-text">Exchange used</p>
                          <div className="dropdown dropdownSwap">
                            {!swaplink ? (
                              <button className="btn btn-secondary dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Select...
                              </button>
                            ) : (
                                <button className="btn btn-secondary dropdown-toggle " style={{ backgroundColor: "#1a1e23" }} id="dropdownMenuButton" data-toggle="dropdown"
                                  aria-haspopup="true" aria-expanded="false">
                                  {swaplink}
                                </button>
                              )}
                            <div className="dropdown-menu dropdownMenu" aria-labelledby="dropdownMenuButton">
                              {getlogo().map((e, index) => (
                                <button key={index} className="dropdown-item-swaplink" onClick={() => { changeswap(e.name); }}>
                                  <img src={e.icon} width="20%" />{" "}
                                  {e.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="liquidity">No Pair Liquidity</div>
                        <p className="info-text">Try changing the exchange used in the setting above.</p>
                      </div>
                    ) : parseFloat(reserve1) === 0 && parseFloat(reserve2) === 0 ? (
                      <div>
                        <div className="styleCaract">
                          <p className="info-text fontText">Exchange used</p>
                          <div className="dropdown dropdownSwap">
                            {!swaplink ? (
                              <button className="btn btn-secondary dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Select...
                              </button>
                            ) : (
                                <button className="btn btn-secondary dropdown-toggle " style={{ backgroundColor: "#1a1e23" }} id="dropdownMenuButton"
                                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                  {swaplink}
                                </button>
                              )}
                            <div className="dropdown-menu dropdownMenu" aria-labelledby="dropdownMenuButton">
                              {getlogo().map((e, index) => (
                                <button key={index} className="dropdown-item-swaplink" onClick={() => { changeswap(e.name); }}>
                                  <img src={e.icon} width="20%" />{" "}
                                  {e.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="amount">
                          <button style={{ backgroundColor: "transparent" }} onClick={() => navigate(coinName1, coinName2)}>
                            {" "}You must add Liquidity
                      </button>
                        </div>
                      </div>
                    ) : /*----------------------------------------------------------------------*/
                            !input1.length || parseFloat(input1) <= 0 ? (
                              <div className="amount">Enter an amount </div>
                            ) : selected2 == "default" && input1.length ? (
                              <div>
                                <div className="styleCaract">
                                  <p className="info-text fontText">Exchange used</p>
                                  <div className="dropdown dropdownSwap">
                                    {!swaplink ? (
                                      <button className="btn btn-secondary dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Select...
                                      </button>
                                    ) : (
                                        <button className="btn btn-secondary dropdown-toggle " style={{ backgroundColor: "#1a1e23" }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
                                          {swaplink}
                                        </button>
                                      )}
                                    <div className="dropdown-menu dropdownMenu" aria-labelledby="dropdownMenuButton">
                                      {getlogo().map((e, index) => (
                                        <button key={index} className="dropdown-item-swaplink"
                                          onClick={() => { changeswap(e.name); }}>
                                          <img src={e.icon} width="20%" />{" "}
                                          {e.name}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="amount">Select a token</div>
                              </div>
                            ) : selected2 == selected1 ? (
                              <div className="amount">Select different token </div>
                            ) : checkbalance(input1, selected1) ? (
                              <div>
                                <div className="styleCaract">
                                  <p className="info-text fontText">Exchange used</p>
                                  <div className="dropdown dropdownSwap">
                                    {!swaplink ? (
                                      <button className="btn btn-secondary dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Select...
                                      </button>
                                    ) : (
                                        <button className="btn btn-secondary dropdown-toggle " style={{ backgroundColor: "#1a1e23" }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                          {swaplink}
                                        </button>
                                      )}
                                    <div className="dropdown-menu dropdownMenu" aria-labelledby="dropdownMenuButton" >
                                      {getlogo().map((e, index) => (
                                        <button key={index} className="dropdown-item-swaplink" onClick={() => { changeswap(e.name); }}>
                                          <img src={e.icon} width="20%" />{" "}
                                          {e.name}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="amount">{" "}Insufficient {coinName1} balance{" "}</div>
                              </div>
                            ) : // Reserve Insufficient  with links
                                    /*----------------------------------------------------------------------*/
                                    compareTokenParReserve(input2, reserve2) ? (
                                      <div>
                                        <div className="styleCaract">
                                          <p className="info-text fontText">Exchange used</p>
                                          <div className="dropdown dropdownSwap">
                                            {!swaplink ? (
                                              <button
                                                className="btn btn-secondary dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                Select...
                                              </button>
                                            ) : (
                                                <button className="btn btn-secondary dropdown-toggle " style={{ backgroundColor: "#1a1e23" }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                  {swaplink}
                                                </button>
                                              )}
                                            <div className="dropdown-menu dropdownMenu" aria-labelledby="dropdownMenuButton">
                                              {getlogo().map((e, index) => (
                                                <button key={index} className="dropdown-item-swaplink" onClick={() => { changeswap(e.name); }}>
                                                  <img src={e.icon} width="20%" />{" "}
                                                  {e.name}
                                                </button>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="amount">
                                          <button style={{ backgroundColor: "transparent" }} onClick={() => navigate(coinName1, coinName2)}>
                                            {" "} Insufficient {coinName2} reserve {" "}
                                          </button>
                                        </div>
                                      </div>
                                    ) : /*----------------------------------------------------------------------*/
                                      selected1 == "ETH" ? (
                                        <>
                                          <div style={{ justifyContent: "center" }}>
                                            <div className="styleCaract">
                                              <p className="info-text fontText">Exchange used</p>
                                              <div className="dropdown dropdownSwap" >
                                                {!swaplink ? (
                                                  <button className="btn btn-secondary dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    Select...
                                                  </button>
                                                ) : (
                                                    <button className="btn btn-secondary dropdown-toggle " style={{ backgroundColor: "#1a1e23" }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                      {swaplink}
                                                    </button>
                                                  )}
                                                <div className="dropdown-menu dropdownMenu" aria-labelledby="dropdownMenuButton">
                                                  {getlogo().map((e, index) => (
                                                    <button key={index} className="dropdown-item-swaplink"
                                                      onClick={() => { changeswap(e.name); }}>
                                                      <img src={e.icon} width="20%" />{" "}
                                                      {e.name}
                                                    </button>
                                                  ))}
                                                </div>
                                              </div>
                                            </div>
                                            <button onClick={toggleModal} className="swapbtnapproveth">Swap</button>
                                          </div>
                                        </>
                                      ) : selected2 == "ETH" ? (
                                        approveButtonVisible() ? (
                                          <div className="blockApprove" >
                                            {!loadingapprove ? (
                                              <>
                                                {successApprove ? (
                                                  <button className="appovedbtn" disabled>
                                                    {" "}Approved{" "}
                                                  </button>
                                                ) : (
                                                    <div className="styleApproveInput">
                                                      <div className="classCurrency">
                                                        <span className="currencyLimit">Set currency spending limit </span>
                                                        <input className="inputApprove" disabled={!parseFloat(reserve1)} type="text" placeholder="0.0" value={newInput} onChange={handerNewValue} />
                                                      </div>
                                                      <div>
                                                        <button className="approvebtn" style={{ width: "121px", height: "65px" }} onClick={() => { doApprove(); setloadingapprove(true); }}>
                                                          {"Approve"}
                                                        </button>
                                                      </div>
                                                    </div>
                                                  )}
                                              </>
                                            ) : (
                                                <>
                                                  <div className="approvebtn" style={{ height: "100%", marginTop: "13px" }}>
                                                    Loading <i className="fa fa-spinner fa-spin"></i>
                                                  </div>
                                                  <button disabled className="swapbtn">
                                                    {" "}Swap{" "}
                                                  </button>
                                                </>
                                              )}
                                            {!successApprove ? (null)
                                              :
                                              (<>
                                                <div>
                                                  <button onClick={toggleModal} className="swapbtnapprov">
                                                    Swap
                                                </button>
                                                  {/* <button style={{background:"transparent",color:"#E57EE8",fontWeight:"bold",fontSize:"17px"}} onClick={toggleModal1}>Other link for swap </button> */}
                                                </div>
                                              </>
                                              )}
                                          </div>
                                        ) : (
                                            <>
                                              <div className="styleCaract">
                                                <p className="inputCurrency">Currency Limit </p>
                                                <div className="allowances">
                                                  <span className="inputCurrency">{allowances.get(selected1) != null ? allowances.get(selected1) : 0}/{input1}</span>
                                                  <i className="fa fa-pencil" onClick={() => { setShowEdit(true) }} aria-hidden="true" style={{ color: "#0e61c7" }} ></i>
                                                </div>
                                              </div>
                                              {!showEdit ? (
                                                <div className="classSwapButton">
                                                  <button onClick={toggleModal} className="swapbtnapproveth">
                                                    Swap
                                                </button>
                                                </div>
                                              ) : (
                                                  <div className="styleApproveInput">
                                                    <div className="classCurrency">
                                                      <span className="currencyLimit">Set currency spending limit </span>
                                                      <input className="inputApprove" disabled={!parseFloat(reserve1)} type="text" placeholder="0.0" value={newInput} onChange={handerNewValue} />
                                                    </div>
                                                    <div>
                                                      {input1.length ?
                                                        (approveButtonVisible() ?
                                                          (<>
                                                            <button className="approvebtn" style={{ position: "absolute", width: "121px", height: "65px" }} onClick={() => { doApprove(); setloadingapprove(true); }}>
                                                              {"Approve"}</button>
                                                            <button className="textConcel" onClick={() => { setShowEdit(false) }}>Caancel</button>
                                                          </>) : (<>
                                                            <button onClick={toggleModal} className="swapbtnapproveth">
                                                              Swap
                                                          </button>
                                                            <button className="textConcel" onClick={() => { setShowEdit(false) }}>Cancel</button>
                                                          </>
                                                          )
                                                        ) : null
                                                      }
                                                    </div>
                                                  </div>
                                                )}
                                            </>
                                          )
                                      ) : approveButtonVisible() ? (
                                        <div>
                                          <div className="styleCaract">
                                            <p className="info-text fontText">Exchange used</p>
                                            <div className="dropdown dropdownSwap">
                                              {!swaplink ? (
                                                <button className="btn btn-secondary dropdown-toggle" id="dropdownMenuButton"
                                                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                  Select...
                                                </button>
                                              ) : (
                                                  <button className="btn btn-secondary dropdown-toggle " style={{ backgroundColor: "#1a1e23" }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    {swaplink}
                                                  </button>
                                                )}
                                              <div className="dropdown-menu dropdownMenu" aria-labelledby="dropdownMenuButton">
                                                {getlogo().map((e, index) => (
                                                  <button key={index} className="dropdown-item-swaplink"
                                                    onClick={() => { changeswap(e.name); }} >
                                                    <img src={e.icon} width="20%" />{" "}
                                                    {e.name}
                                                  </button>
                                                ))}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="blockApprove">
                                            {!loadingapprove ? (
                                              <>
                                                {successApprove ? (
                                                  <button className="appovedbtn" disabled>
                                                    {" "}Approved{" "}
                                                  </button>
                                                ) : (
                                                    <div className="styleApproveInput" style={{ border: "none" }}>
                                                      <div className="classCurrency">
                                                        <span className="currencyLimit">Set currency spending limit</span>
                                                        <input className="inputApprove" disabled={!parseFloat(reserve1)} type="text" placeholder="0.0" value={newInput} onChange={handerNewValue} />
                                                      </div>
                                                      <div>
                                                        <button className="approvebtn" style={{ position: "absolute", width: "121px", height: "65px" }} onClick={() => { doApprove(); setloadingapprove(true); }}>
                                                          {"Approve"}
                                                        </button>
                                                      </div>

                                                    </div>
                                                  )}

                                              </>
                                            ) : (
                                                <>
                                                  <div className="approvebtn" >
                                                    Loading<i className="fa fa-spinner fa-spin"></i>
                                                  </div>
                                                  <button disabled className="swapbtn">
                                                    {" "}Swap{" "}
                                                  </button>
                                                </>
                                              )}
                                            {!successApprove ? (
                                              null
                                            ) : (
                                                <button onClick={toggleModal} className="swapbtnapprov">
                                                  Swap
                                                </button>
                                              )}
                                          </div>
                                        </div>
                                      ) : (
                                              <div style={{ justifyContent: "center" }}>
                                                <div className="styleCaract">
                                                  <p className="info-text fontText">Exchange used</p>
                                                  <div className="dropdown dropdownSwap" >
                                                    {!swaplink ? (
                                                      <button className="btn btn-secondary dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        Select...
                                                      </button>
                                                    ) : (
                                                        <button className="btn btn-secondary dropdown-toggle " style={{ backgroundColor: "#1a1e23" }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                          {swaplink}
                                                        </button>
                                                      )}
                                                    <div className="dropdown-menu dropdownMenu" aria-labelledby="dropdownMenuButton">
                                                      {getlogo().map((e, index) => (
                                                        <button key={index} className="dropdown-item-swaplink"
                                                          onClick={() => { changeswap(e.name); }}>
                                                          <img src={e.icon} width="20%" />{" "}
                                                          {e.name}
                                                        </button>
                                                      ))}
                                                    </div>
                                                  </div>
                                                </div>
                                                <button onClick={toggleModal} className="swapbtnapproveth">Swap</button>
                                              </div>
                                            )
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      
      
    </div>
  );
}

export default SwapStandardView;