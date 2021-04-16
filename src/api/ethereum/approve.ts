import Web3 from 'web3';
import { configContrat } from "../config";
import TruffleContract from "@truffle/contract";
import DollarContract from "../../contracts/Sqoin.json";
import Vault_Deposit from "../../contracts/vault/contracts/Vault.json";
import UniswapContract from "../../contracts/UniswapV2Router02.json";
// @ts-ignore
const nNova = TruffleContract(Vault_Deposit);
// @ts-ignore
const contract = TruffleContract(UniswapContract);
// @ts-ignore
const Dollar = TruffleContract(DollarContract);
export async function approveNnovaImpl(
    web3: Web3,
    from: string,
    amount1: string,
    netId: number,
    callback: (error: Error | null, txid: string | null) => any
  ) {
    try {
      contract.setProvider(web3.currentProvider);
      nNova.setProvider(web3.currentProvider);
      let adresses: any = configContrat();
      var accounts = await web3.eth.getAccounts();
  
      var amount1Big = Web3.utils.toWei(amount1);
      var result: any = {};
      const coin = await nNova.at(from);
      result = await coin.approve(
        adresses[0][netId].novaswap.vaultProxy,
        amount1Big,
        { from: accounts[0] }
      );
  
      // @ts-ignore
      callback(null, JSON.stringify(result));
    } catch (error) {
      callback(error, null);
    }
  }
  /*-------------------------------------------*/
  
  export async function approveDoingImpl(
    web3: Web3,
    from: string,
    amount1: string,
    selectSwap: string,
    netId: number, 
    callback: (error: Error | null, txid: string | null) => any
  ) {
    try {
      contract.setProvider(web3.currentProvider);
      Dollar.setProvider(web3.currentProvider);
  
      let adresses: any = configContrat();
      if (selectSwap === "novaswap") {
        var Router = await contract.at(adresses[0][netId].novaswap.router);
      } else if (selectSwap === "uniswap") {
        var Router = await contract.at(adresses[0][netId].uniswap.router);
      }
      var accounts = await web3.eth.getAccounts();
  
      var amount1Big = Web3.utils.toWei(amount1);
      var result: any = {};
  
      const coin = await Dollar.at(from);
  
      result = await coin.approve(Router.address, amount1Big, {
        from: accounts[0]
      }).then( (result: any) => callback(null, JSON.stringify(result)) );
  
  
     // callback(null, JSON.stringify(result));
    } catch (error) {
      callback(error, null);
    }
  }
  
  export async function getAllowanceImpl(
    web3: Web3,
    from: string,
    selectSwap: string,
    netId: number,
    callback: (error: Error | null, allowance: string | null) => any
  ) {
    try {
      contract.setProvider(web3.currentProvider);
      Dollar.setProvider(web3.currentProvider);
  
      let adresses: any = configContrat();
  
      if (selectSwap === "novaswap") {
        const Router = await contract.at(adresses[0][netId].novaswap.router);
        const coin = await Dollar.at(from);
  
        var accounts = await web3.eth.getAccounts();
  
        var approved = await coin.allowance(accounts[0], Router.address);
  
         callback(null, approved);
      } else if (selectSwap === "uniswap") {
        const Router = await contract.at(adresses[0][netId].uniswap.router);
        const coin = await Dollar.at(from);
  
        var accounts = await web3.eth.getAccounts();
  
        var approved = await coin.allowance(accounts[0], Router.address);
  
         callback(null, approved);
      }
    } catch (error) {
      callback(error, null);
    }
  
    return approved;
  }