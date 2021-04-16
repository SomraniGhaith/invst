import React, { useState, useEffect,MouseEvent } from "react";
import "./PopupSelectToken.css";
import { unlockAccount, getBalance } from "../../api/web3";
import { useWeb3Context } from "../../contexts/Web3";
import Web3 from "web3";
import useAsync from "../../components/useAsync";
import { getCoins } from "../../api/coins";
import { getPaires } from "../../api/Bonus";
import { getlogo } from "../../api/logo";
import {getAllowance,getReserve,getBalancePair} from "../../api/web3";
import { Modal } from "reactstrap";
import store from "../../redux/store";
import {setJeton} from "../../redux/actions"
import { useHistory, useLocation } from "react-router-dom";
const bn = require("bn.js");

const PopupSelectToken = (props: any) => {
  const [tolerance, setTolerance] = useState(props.tolerance);
  const location2 = useLocation();
  //redux
  const [reseauId, setreseauId] = useState(parseFloat("" +store.getState().connection.networkId));
  //***** begin state */
  const [isOpen, setIsOpen1] = useState(false);
  const [tokenSearch1, settokenSearch1] = useState("");
  const [addcoin, setaddcoin] = useState(false);
  const [addVerif, setaddVerif] = useState("");

  const [nameNewJeton, setnameNewJeton] = useState("");
  const [addressNewJeton, setaddressNewJeton] = useState("");
  const [search1, setSearch1] = useState(false);
  const [searchList, setSearchList] = useState<any[]>([]);
  const location = useLocation();
  const [balances, setBalances] = useState(new Map<string, string>());



  //***** end state  */

  //***** bagin function */
  function handerToken1(e: React.ChangeEvent<HTMLInputElement>) {
    settokenSearch1(e.target.value);
  }
  function handerAddress(e: React.ChangeEvent<HTMLInputElement>) {
    setaddressNewJeton(e.target.value);
  }
  function handerAddName(e: React.ChangeEvent<HTMLInputElement>) {
    setnameNewJeton(e.target.value);
  }

  function addJeton() {
    if (nameNewJeton && addressNewJeton) {
      setaddVerif("");
      //@ts-ignore

      var result1 = getCoins(reseauId, swaplink).filter(
        coin => coin.name.toUpperCase() == nameNewJeton.toUpperCase()
      );

      //@ts-ignore
      var result2 = getCoins(reseauId, swaplink).filter(
        coin => coin.address == addressNewJeton
      );

      if (result1[0]) {
        setaddVerif("Name " + nameNewJeton + " " + "exist");
        return;
      } else if (result2[0]) {
        setaddVerif("Address exist");
        return;
      } else {
        if (Web3.utils.isAddress(addressNewJeton)) {
          //redux
          const jeton={"name":nameNewJeton,"adress":addressNewJeton};
          store.dispatch(setJeton(jeton));
          window.location.reload();
        } else setaddVerif("Your address is not compatible with our standard ");
      }
    }
  }

  function toggleModal1() {
    //props.isOpen1=false;
    //
    console.log(props.isOpen1);
    setIsOpen1(false);
    setaddressNewJeton("");
    setaddVerif("");
  }
  const [coinName1, setcoinName1] = useState(
    !location2.state ? "" : JSON.parse(JSON.stringify(location2.state)).paireOne
  );
  async function getCoinName1(address: string) {
    //@ts-ignore
    getCoins(reseauId, swaplink).map(coin => {
      if (coin.address === address) {
        setcoinName1("" + coin.name);
      } else return "";
    });
  }
  const getCoinAddress = (name: string) => {
    //@ts-ignore
    for (let coin of getCoins(reseauId, swaplink)) {
      if (coin.name === name) {
        return coin.address;
      }
    }
    return "default";
  };
  const [selected1, setSelected1] = useState(!location.state? "default": getCoinAddress(JSON.parse(JSON.stringify(location.state)).paireOne));
  const [selected2, setSelected2] = useState(!location.state? "default": getCoinAddress(JSON.parse(JSON.stringify(location.state)).paireTwo));
  function getReserveSwap(web3: Web3, token1: string, token2: string) {
    updateReserve({ reserve1: "loading ..", reserve2: "loading .." });

    getReserve(web3, token1, token2, swaplink, reseauId, (err, result) => {
      //callbcack its funtion fo what we do then
      if (err) {
        updateReserve({ reserve1: "--", reserve2: "--" });
      } else {
        var reserves = result ? JSON.parse(result) : {};
        if (reserves["0"] && reserves["1"]) {
          var val = new bn(reserves["0"], 16);

          var val2 = new bn(reserves["1"], 16);

          //        if(token1.toLowerCase()<token2.toLowerCase()){
          updateReserve({
            reserve1: toHumanReadableBalance(val, ""),
            reserve2: toHumanReadableBalance(val2, "")
          });
          //     }
          //        else {
          //        updateReserve({reserve1: toHumanReadableBalance(val2 , "") , reserve2:  toHumanReadableBalance(val , "") });
          //   }
        } else {
          updateReserve({ reserve1: "--", reserve2: "--" });
        }
      }
    });
  }
  const balancetake = (slected: string) => {
    if (balances.has(slected)) {
      return balances.get(slected);
    }
    return "";
  };

  //function search :
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.currentTarget.value);
    console.log(searchTerm)
     // Variable to hold the original version of the list
    let currentList:any=[];
     // Variable to hold the filtered list before putting into state
    let newList = [];
   
    currentList=getCoins(reseauId, swaplink);
    console.log(currentList);


  };
  
  
  //**** end function */
  const [swaplink, setswaplink] = useState(props.swaplink);


  const [allowances, setAllowance] = useState(new Map<string, string>());
  const [linkname, setlinkname] = useState("");

  const [logocoin, setlogocoin] = useState("");
  function getLogo1ByAddress(add: string) {
    //@ts-ignore
    getCoins(reseauId, swaplink).map(coin => {
      if (coin.address === add) {
        setlogocoin(coin.logo);
      }
    });
  }
 

  //When pair does not exist navigate to bonus 1
  const history = useHistory();
  function getLinkName() {
    if (reseauId === 42) {
      setlinkname("https://kovan.etherscan.io/tx/");
    } else if (reseauId === 4) {
      setlinkname("https://rinkeby.etherscan.io/tx/");
    }
  }
  function rechercheToken1(searching: string) {
    var list: any = [];
    setSearch1(false);

    var res1 = searching.substring(0, 2);

    if (res1.toUpperCase() !== "0X") {
      getlogo().forEach(element => {
        //@ts-ignore
        var result1 = getCoins(reseauId, element.name).filter(
          coin => coin.name.toUpperCase() == searching.toUpperCase()
        );
        var address = result1[0] != undefined ? result1[0].address : null;
        var object = { link: element.name, address: address };
        if (object.address) {
          list.push(object);
          getLogo1ByAddress(object.address);
          getCoinName1(object.address);
          setSearchList(list);
          setSearch1(true);
          setSelected1(object.address);
        }
      });
    } else if (res1.toUpperCase() === "0X") {
      getlogo().forEach(element => {
        //@ts-ignore
        var result1 = getCoins(reseauId, element.name).filter(
          coin => coin.address.toUpperCase() == searching.toUpperCase()
        );

        var address = result1[0] !== undefined ? result1[0].address : null;
        var object = { link: element.name, address: address };
        if (object.address) {
          list.push(object);
          getLogo1ByAddress(object.address);
          getCoinName1(object.address);
          setSearch1(true);
          setSearchList(list);
          setSelected1(object.address);
        }
      });
    }
  }

  var paireName: any[] = [];

  getPaires().map(val => val.pairesName.map(name => paireName.push(name)));

  //function for get web 3  we use setData(data.web3)
  // u
  const [web3, setWeb3] = useState(new Web3());
  

  const {
    state: { account, netId, balance },
    updateAccount
  } = useWeb3Context();

  const { pending, error, call } = useAsync(unlockAccount);
  async function onClickConnect() {
    const { error, data } = await call(null);

    if (error) {
    }
    if (data) {
      setWeb3(data.web3);
      getLinkName();
 

      if (location.state) {
        getBalancePair(data.web3, "" + selected1, (err, balancePair) => {
          if (!err) {
            balancePair=!balancePair? "":balancePair
            //@ts-ignore
            balances.set(
              selected1,
              "" + toHumanReadableBalance("" + balancePair.toString(), "")
            );
          } else return;
        });
      }

      //@ts-ignore
      getCoins(reseauId, swaplink).map(coin => {
        getBalance(data.web3, coin.address, reseauId, (error, b) => {
          if (error) {
            return;
          }

          if (b) {
            balances.set(
              coin.address,
              toHumanReadableBalance(b.toString(), "")
            );
          }
        });

        if (coin.address !== "ETH") {
          getAllowance(
            data.web3,
            coin.address,
            swaplink,
            reseauId,
            (error, b) => {
              if (error) {
                return;
              }

              if (b) {
                allowances.set(
                  coin.address,
                  toHumanReadableBalance(b.toString(), "")
                );
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
    }
  }

  /*------Calcul montant minimal -------- */
  const toHumanReadableBalance = (balance: string, unit: string) => {
    var getBalanceFloat = parseFloat(balance);
    return (getBalanceFloat / 1000000000000000000).toFixed(3);
  };

  useEffect(() => {
    onClickConnect();
    setTolerance(!props.tolerance ? "1.1" : props.tolerance);
  }, [props.tolerance]);
  const [{ reserve1, reserve2 }, updateReserve] = useState({
    reserve1: "",
    reserve2: ""
  });
  useEffect(() => {}, [swaplink]);
  useEffect(()=>{setIsOpen1(props.isOpen1)}, [props.isOpen1])
    return (

      <Modal
      isOpen={isOpen}
      //  onRequestClose={toggleModal1}
      contentlabel="My dialog"
      className="modal-content"
     >
      <div>
        <div className="modaltitle">
          <p>
            Select a token ({props.swaplink}) 
          </p>
          <button className="close" onClick={toggleModal1} >
            <i className="fa fa-times" aria-hidden="true"></i>
          </button>
        </div>

        <div className="modalbody">
          <div className="row">
          <div className="col-12">
              <div className="search">
                <input className="inputSearch" type="text" placeholder="Search name" value={tokenSearch1} onChange={handerToken1}/>
                <button className="btn btn-secondary" onClick={() => {rechercheToken1(tokenSearch1);}} >
                  Search <i className="fa fa-search"></i>
                </button>

              </div>
              <div className="addToken ">
                <button className="btn btn-secondary" onClick={() => {setaddcoin(!addcoin);}}>
                  Add New Token
                </button>
                {addcoin ? (
                  <div className="addCoin">
                    <div className="divAddCoin">
                      <input className="inputAdress" type="text" placeholder="Add adress" onChange={handerAddress}/>
                      <input className="inputNameCoin" type="text" placeholder="Add Coin Name" onChange={handerAddName}/>
                    </div>
                    <button className="btn btn-secondary" onClick={() => {addJeton();}}>
                      {" "}Confirm{" "}
                    </button>
                    <h2>{addVerif}</h2>
                  </div>
                ) : null}
              </div>
              <h2 style={{ textAlign: "center" }}>Token Name</h2>
              </div>
              <input type="text" placeholder="Search" value={searchTerm} onChange={handleChange}/>
              <div className="listCoin">
                {tokenSearch1.length ? 
                (
                  search1 ? (
                    <div className="itemCoin">
                      {searchList.map((t, i) => (
                        <div className="body" key={i} >
                          <img src={logocoin} width="50px" onClick={() => { setSelected1(t.address);toggleModal1();getCoinName1(t.address);
                            if (selected2 !== "default") {getReserveSwap(web3, t.address, selected2);}}}/>
                          <option className="optionsslecttoken" onClick={() => {setSelected1(t.address); toggleModal1();getCoinName1(t.address);
                            if (selected2 !== "default") {getReserveSwap(web3, t.address, selected2);}}} value={t.address}>
                            {coinName1}{" "}
                          </option>
                          <span className="optionsslecttoken" onClick={() => {setSelected1(t.address);toggleModal1();getCoinName1(t.address);
                            if (selected2 !== "default") {getReserveSwap(web3, t.address, selected2);}}}>
                            {balancetake(t.address)}
                          </span>
                        </div>
                      ))}
                    </div>
                            ) : 
                            (
                    <div></div>
                            )
                ) :
                (
                  <div >
                    {//@ts-ignore
                    getCoins(reseauId, swaplink).map((t, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between"
                        }}
                      >
                        <div style={{ display: "flex" }}>
                          <img src={t.logo} width="50px" onClick={() => {setSelected1(t.address);toggleModal1();getCoinName1(t.address);setlogocoin(t.logo);
                              if (selected2 !== "default") {getReserveSwap(web3, t.address, selected2);}}}/>
                          <option className="optionsslecttoken" onClick={() => {setSelected1(t.address);toggleModal1();getCoinName1(t.address);setlogocoin(t.logo);
                              if (selected2 !== "default") {getReserveSwap(web3, t.address, selected2);}}} value={t.address}>{t.name}{" "}
                          </option>
                        </div>
                        <span className="optionsslecttoken" onClick={() => {setSelected1(t.address); toggleModal1();getCoinName1(t.address);setlogocoin(t.logo);
                          if (selected2 !== "default") {getReserveSwap(web3, t.address, selected2);}}}>
                          {balancetake(t.address)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
          
          </div>
        </div>
      </div>
    </Modal>
    );



};

export default PopupSelectToken;

