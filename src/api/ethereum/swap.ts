import Web3 from 'web3'
import { configContrat } from "../config";
import TruffleContract from "@truffle/contract";
import UniswapContract from "../../contracts/UniswapV2Router02.json";
import DollarContract from "../../contracts/Sqoin.json";


// @ts-ignore
const contract = TruffleContract(UniswapContract);
// @ts-ignore
const Dollar = TruffleContract(DollarContract);
// tokens to tokens  without ethereum
export async function swapExactTokensForTokensImpl(
    web3: Web3,
    from: string,
    to: string,
    amount1: string,
    selectSwap: string,
    amountMin: string,
    netId: number,
    callback: (error: Error | null, txid: string | null) => any
  ) {
    try {
      var amount1Big = Web3.utils.toWei(amount1);
      var amount2Big = Web3.utils.toWei(amountMin);
      var accounts = await web3.eth.getAccounts();
      contract.setProvider(web3.currentProvider);
      Dollar.setProvider(web3.currentProvider);
      let adresses: any = configContrat();
  
      if (selectSwap === "novaswap") {
        const Router = await contract.at(adresses[0][netId].novaswap.router);
  
        const coin1 = await Dollar.at(from);
        const coin2 = await Dollar.at(to);
  
        
        result = await Router.swapExactTokensForTokens(
          amount1Big,
          amount2Big,
          [coin1.address, coin2.address],
          accounts[0],
          10000000000,
          { from: accounts[0] }
        ).then( (result:any) => callback(null, JSON.stringify(result)) );
     
  
    //   callback(null, JSON.stringify(result));
      } else if (selectSwap === "uniswap") {
        const Router = await contract.at(adresses[0][netId].uniswap.router);
        const coin1 = await Dollar.at(from);
        const coin2 = await Dollar.at(to);
  
        var amount1Big = Web3.utils.toWei(amount1);
        var amount2Big = Web3.utils.toWei(amountMin);
        var accounts = await web3.eth.getAccounts();
        var result: any = {};
        result = await Router.swapExactTokensForTokens(
          amount1Big,
          amount2Big,
          [coin1.address, coin2.address],
          accounts[0],
          10000000000,
          { from: accounts[0] }
        ).then( (res:any) => callback(null, JSON.stringify(res)) );
  
        //callback(null, JSON.stringify(result));
      }
    } catch (error) {
      callback(error, null);
    }
  }
  
  export async function swapExactTokensForETHImpl(
    web3: Web3,
    from: string,
    to: string,
    amount1: string,
    amountMin: string,
    selectSwap: string,
    netId: number,
    callback: (error: Error | null, txid: string | null) => any
  ) {
    try {
      contract.setProvider(web3.currentProvider);
      let adresses: any = configContrat();
  
      var amount1Big = Web3.utils.toWei(amount1);
      var amount2Big = Web3.utils.toWei(amountMin);
      var accounts = await web3.eth.getAccounts();
  
      if (selectSwap === "novaswap") {
        const weth = adresses[0][netId].novaswap.WETH;
        const Router = await contract.at(adresses[0][netId].novaswap.router);
  
        var result: any = {};
  
        result = await Router.swapExactTokensForETH(
          amount1Big,
          amount2Big,
          [from, weth],
          accounts[0],
          10000000000,
          { from: accounts[0] }
        ).then( (result:any) => callback(null, JSON.stringify(result)) );
  
       // callback(null, JSON.stringify(result));
      } else if (selectSwap === "uniswap") {
        var weth = adresses[0][netId].uniswap.WETH;
        const Router = await contract.at(adresses[0][netId].uniswap.router);
        var result: any = {};
        result = await Router.swapExactTokensForETH(
          amount1Big,
          amount2Big,
          [from, weth],
          accounts[0],
          10000000000,
          { from: accounts[0] }
        ).then( (result:any) => callback(null, JSON.stringify(result)) );
  
       // callback(null, JSON.stringify(result));
      }
    } catch (error) {
      callback(error, null);
    }
  }
  
  export async function swapExactETHForTokensImpl(
    web3: Web3,
    from: string,
    to: string,
    amount1: string,
    amount2: string,
    selectSwap: string,
    amountMin: string,
    netId: number,
    callback: (error: Error | null, txid: string | null) => any
  ) {
    try {
      contract.setProvider(web3.currentProvider);
      let adresses: any = configContrat();
      var ammountMinBig = Web3.utils.toWei(amountMin);
  
      if (selectSwap === "novaswap") {
        const Router = await contract.at(adresses[0][netId].novaswap.router);
        var amount1Big = Web3.utils.toWei(amount1);
        var amount2Big = Web3.utils.toWei(amount2);
        var accounts = await web3.eth.getAccounts();
        var result: any = {};
  
        result = await Router.swapExactETHForTokens(
          //swapExactETHForTokens
          ammountMinBig,
          [adresses[0][netId].novaswap.WETH, to],
          accounts[0],
          10000000000,
          { from: accounts[0], value: amount1Big }
        ).then( (result:any) => callback(null, JSON.stringify(result)) );
  
        //callback(null, JSON.stringify(result));
      } else if (selectSwap === "uniswap") {
        const Router = await contract.at(adresses[0][netId].uniswap.router);
        var amount1Big = Web3.utils.toWei(amount1);
        var amount2Big = Web3.utils.toWei(amount2);
        var accounts = await web3.eth.getAccounts();
        var result: any = {};
  
        result = await Router.swapExactETHForTokens(
          //swapExactETHForTokens
          ammountMinBig,
          [adresses[0][netId].uniswap.WETH, to],
          accounts[0],
          10000000000,
          { from: accounts[0], value: amount1Big }
        ).then( (result:any) => callback(null, JSON.stringify(result)) );
  
      // callback(null, JSON.stringify(result));
      }
    } catch (error) {
      callback(error, null);
    }
  }