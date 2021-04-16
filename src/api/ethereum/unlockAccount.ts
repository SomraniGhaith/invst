import Web3 from "web3";
import store from "../../redux/store";
import { setNetworkId, setBalances } from '../../redux/actions'
// @ts-ignore
var currentweb3;


export async function unlockAccountImpl() {
    // @ts-ignore
    const { ethereum } = window;
  
    if (!ethereum) {
      throw new Error("Web3 not found");
    }
  
    const web3 = new Web3(ethereum);
    await ethereum.enable();
    currentweb3 = web3;
    const accounts = await web3.eth.getAccounts();
    var address = accounts[0];
    //store.dispatch(setAccount(address));
    const balance = await web3.eth.getBalance(accounts[0]);
    const balances = { 'key': address, 'value': balance };
    store.dispatch(setBalances(balances));
    return { web3, account: accounts[0] || "" };
  }