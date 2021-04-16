import Web3 from "web3"
import TruffleContract from "@truffle/contract";
import UniswapContract from "../../contracts/UniswapV2Router02.json";
import DollarContract from "../../contracts/Sqoin.json";
import { configContrat } from "../config";
import UniswapV2Factory from "../../contracts/UniswapV2Factory.json";
import UniswapV2Pair from "../../contracts/UniswapV2Pair.json";

// @ts-ignore
const contract = TruffleContract(UniswapContract);
// @ts-ignore
const Dollar = TruffleContract(DollarContract);
// @ts-ignore
const factory = TruffleContract(UniswapV2Factory);
// @ts-ignore
const pair = TruffleContract(UniswapV2Pair);


export async function addLiquidityImpl(
  web3: Web3,
  from: string,
  to: string,
  amount1: string,
  amount2: string,
  netId: number,
  callback: (error: Error | null, txid: string | null) => any
) {
  try {
    contract.setProvider(web3.currentProvider);
    Dollar.setProvider(web3.currentProvider);

    let adresses: any = configContrat();

    const Router = await contract.at(adresses[0][netId].novaswap.router);

    const coin1 = await Dollar.at(from);
    const coin2 = await Dollar.at(to);

    var amount1Big = Web3.utils.toWei(amount1);
    var amount2Big = Web3.utils.toWei(amount2);
    var accounts = await web3.eth.getAccounts();
    var result: any = {};
    result = await Router.addLiquidity(
      coin1.address,
      coin2.address,
      amount1Big,
      amount2Big,
      0, // amount minimal of token 1 no working
      0, // amount minimal of token 2  no working
      accounts[0],
      10000000000,
      { from: accounts[0] }
    ).then((result: any) => callback(null, JSON.stringify(result)));

    //callback(null, JSON.stringify(result));
  } catch (error) {
    callback(error, null);
  }
}

export async function addLiquidityETHImpl(
  web3: Web3,
  from: string,
  to: string,
  amount1: string,
  amount2: string,
  netId: number,
  callback: (error: Error | null, txid: string | null) => any
) {
  try {
    contract.setProvider(web3.currentProvider);

    let adresses: any = configContrat();

    const Router = await contract.at(adresses[0][netId].novaswap.router);

    var accounts = await web3.eth.getAccounts();
    var amount1Big = Web3.utils.toWei(amount1);
    var amount2Big = Web3.utils.toWei(amount2);
    var result: any = {};
    if (from === "ETH") {

     // const coin = await Dollar.at(to);
      result = await Router.addLiquidityETH(
        to,
        amount2Big,
        0, // amount1 min no working
        0, // amount2 min no working
        accounts[0],
        10000000000,
        { from: accounts[0], value: amount1Big }
      ).then((result: any) => callback(null, JSON.stringify(result)));
    } else if (to === "ETH") {
     // const coin = await Dollar.at(from);
      result = await Router.addLiquidityETH(
        from,
        amount1Big,
        0,
        0,
        accounts[0],
        10000000000,
        { from: accounts[0], value: amount2Big }
      ).then((result: any) => callback(null, JSON.stringify(result)));
    }

    //  callback(null, JSON.stringify(result));
  } catch (error) {
    callback(error, null);
  }
}

export async function removeLiquidityImpl(
  web3: Web3,
  token1: string,
  token2: string,
  linkSwap: string,
  netId: number,
  callback: (error: Error | null, txid: string | null) => any
) {
  try {
    contract.setProvider(web3.currentProvider);
    factory.setProvider(web3.currentProvider);
    pair.setProvider(web3.currentProvider);
    Dollar.setProvider(web3.currentProvider);
    let adresses: any = configContrat();
    var result: any = {};
    var accounts = await web3.eth.getAccounts();
    const coin1 = await Dollar.at(token1);
    const coin2 = await Dollar.at(token2);
    var Factory = await factory.at(adresses[0][netId].novaswap.Factory);
    const Router = await contract.at(adresses[0][netId].novaswap.router);
    var Pair = await Factory.getPair(token1, token2);
    var couple = await pair.at(Pair);
    var toBeRemoved = await couple.balanceOf(accounts[0]);
    await couple.approve(Router.address, toBeRemoved, { from: accounts[0] });
    result = await Router.removeLiquidity(
      coin1.address,
      coin2.address,
      toBeRemoved, // BalanceOf (coin1.address , coin2.address)
      0, // amountMinCoin1
      0, // amountMin coin2
      accounts[0],
      10000000000, //deadline
      { from: accounts[0] }
    ).then((result: any) => callback(null, JSON.stringify(result)));


    /*     else if (linkSwap === "uniswap") {
          var Factory = await factory.at(adresses[0][netId].uniswap.Factory);
          const Router = await contract.at(adresses[0][netId].uniswap.router);
    
          var Pair = await Factory.getPair(coin1.address, coin2.address);
    
          var couple = await pair.at(Pair);
          var toBeRemoved = await couple.balanceOf(accounts[0]);
          await couple.approve(Router.address, toBeRemoved, { from: accounts[0] });
          result = await Router.removeLiquidity(
            coin1.address, // address euro
            coin2.address, // address dollar
            toBeRemoved, // 0.1 convert to bn
            0, // amountMinCoin1
            0, // amountMin coin2
            accounts[0],
            10000000000,
            { from: accounts[0] }
          ).then( (result:any) => callback(null, JSON.stringify(result)) );
        } */
    //callback(null, JSON.stringify(result));
  } catch (error) {
    callback(error, null);
  }
}

export async function removeLiquidityETHImpl(
  web3: Web3,
  token1: string,
  token2: string,
  linkSwap: string,
  netId: number,
  callback: (error: Error | null, txid: string | null) => any
) {
  try {
    var coin1: any;
    contract.setProvider(web3.currentProvider);
    factory.setProvider(web3.currentProvider);
    pair.setProvider(web3.currentProvider);
    Dollar.setProvider(web3.currentProvider);
    var accounts = await web3.eth.getAccounts();
    let adresses: any = configContrat();
    var result: any = {};

    if (linkSwap === "novaswap") {
     
      if (token1 !== "ETH") {
       
        coin1 = await Dollar.at(token1);
    
      
        var Factory = await factory.at(adresses[0][netId].novaswap.Factory);
        const Router = await contract.at(adresses[0][netId].novaswap.router);
        var Pair = await Factory.getPair(
          coin1.address,
          adresses[0][netId].novaswap.WETH
        );
        var couple = await pair.at(Pair);
        var toBeRemoved = await couple.balanceOf(accounts[0]);
        await couple.approve(Router.address, toBeRemoved, {
          from: accounts[0]
        });
        result = await Router.removeLiquidityETH(
          coin1.address,

          toBeRemoved, // 0.1 convert to bn
          0,
          0,
          accounts[0],
          10000000000,
          { from: accounts[0] }
        );
      } else if (token1 === "ETH") {
        coin1 = await Dollar.at(token2);
        var Factory = await factory.at(adresses[0][netId].novaswap.Factory);
        const Router = await contract.at(adresses[0][netId].novaswap.router);
        var Pair = await Factory.getPair(
          coin1.address,
          adresses[0][netId].novaswap.WETH
        );
        var couple = await pair.at(Pair);
        var toBeRemoved = await couple.balanceOf(accounts[0]);
        await couple.approve(Router.address, toBeRemoved, {
          from: accounts[0]
        });
        result = await Router.removeLiquidityETH(
          coin1.address,

          toBeRemoved, // 0.1 convert to bn
          0,
          0,
          accounts[0],
          10000000000,
          { from: accounts[0] }
        );
      }
    } else if (linkSwap === "uniswap") {
      if (token1 !== "ETH") {
        coin1 = await Dollar.at(token1);
        var Factory = await factory.at(adresses[0][netId].uniswap.Factory);
        const Router = await contract.at(adresses[0][netId].uniswap.router);
        var Pair = await Factory.getPair(
          coin1.address,
          adresses[0][netId].uniswap.WETH
        );
        var couple = await pair.at(Pair);
        var toBeRemoved = await couple.balanceOf(accounts[0]);
        await couple.approve(Router.address, toBeRemoved, {
          from: accounts[0]
        });
        result = await Router.removeLiquidityETH(
          coin1.address,

          toBeRemoved, // 0.1 convert to bn
          0,
          0,
          accounts[0],
          10000000000,
          { from: accounts[0] }
        );
      } else if (token1 === "ETH") {
        coin1 = await Dollar.at(token2);
        var Factory = await factory.at(adresses[0][netId].uniswap.Factory);
        const Router = await contract.at(adresses[0][netId].uniswap.router);
        var Pair = await Factory.getPair(
          coin1.address,
          adresses[0][netId].uniswap.WETH
        );
        var couple = await pair.at(Pair);
        var toBeRemoved = await couple.balanceOf(accounts[0]);
        await couple.approve(Router.address, toBeRemoved, {
          from: accounts[0]
        });
        result = await Router.removeLiquidityETH(
          coin1.address,

          toBeRemoved, // 0.1 convert to bn
          0,
          0,
          accounts[0],
          10000000000,
          { from: accounts[0] }
        );
      }
    }

    callback(null, JSON.stringify(result));
  } catch (error) {
    callback(error, null);
  }
}