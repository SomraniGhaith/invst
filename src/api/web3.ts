import Web3 from "web3";
import {subscribeToBalanceImpl} from "./ethereum/balance";
import {subscribeToAccountImpl} from './ethereum/account';
import {subscribeToNetIdImpl} from './ethereum/networkId';
import {unlockAccountImpl} from './ethereum/unlockAccount';
import {connectZilliqaImpl} from './zilliqa/connectZilliqa';
import {getZilAccountImpl} from './zilliqa/account';
import {getZilNetIdImpl} from './zilliqa/networkId';
import {getZilBalanceImpl } from './zilliqa/balance';
import {getReserveImpl} from  './ethereum/reserve' ;
import {getPairAddressImpl} from './ethereum/pairAddress';
import {createNewPairImpl} from './ethereum/createPair';
import { getBalanceTokenImpl,getBalancePairImpl } from "./ethereum/balanceToken";
import {deposit_TokenImpl,Withdraw_nTokenImpl} from './ethereum/deposit_withdraw'
import {swapExactTokensForETHImpl,swapExactTokensForTokensImpl,swapExactETHForTokensImpl} from './ethereum/swap';
import {approveNnovaImpl , approveDoingImpl , getAllowanceImpl} from './ethereum/approve';
import {addLiquidityImpl, addLiquidityETHImpl ,removeLiquidityImpl, removeLiquidityETHImpl} from './ethereum/pool';



//Connect with ZilPay
export async function connectZilliqa(callback : (err : any | null , connect : boolean | null)=> any ){
  return connectZilliqaImpl(callback)
}
export async function getZilAccount(callback:any) {
  return getZilAccountImpl(callback)
}
export async function getZilBalance(callback : any) {
  return getZilBalanceImpl(callback)
}

export async function getZilNetId(callback:any) {
  return getZilNetIdImpl(callback)
}


/*-------------Etheruem Eth----------------------- */
export async function unlockAccount(){
  return unlockAccountImpl() ; 
}
// composant in Etheruem
export function subscribeToBalance(
  web3: Web3,
  callback: (error: Error | null, balance: string | null) => any
) {
  return subscribeToBalanceImpl(web3 , callback);
}
export function subscribeToAccount(
  web3: Web3,
  callback: (error: Error | null, account: string | null) => any
) 
 {
   return subscribeToAccountImpl(web3 , callback)
 }
export function subscribeToNetId (
  web3: Web3,
  callback: (error: Error | null, netId: number | null) => any
)  {
  return subscribeToNetIdImpl(web3 , callback)
}
export async function getReserve(
  web3: Web3,
  from: string,
  to: string,
  selectSwap: string,
  netId: number,
  callback: (error: Error | null, txid: string | null) => any
) {
    return getReserveImpl(web3,from,to,selectSwap,netId,callback)
}

export async function getPairAddress(
  web3: Web3,
  from: string,
  to: string,
  selectSwap: string,
  netId: number,
  callback: (error: Error | null, txid: string | null) => any
) {
      return getPairAddressImpl(web3,from,to,selectSwap,netId,callback)
}



export async function createNewPair(
  web3: Web3,
  token1: string,
  token2: string,
  selectSwap: string,
  netId: number,
  callback: (error: Error | null, txid: string | null) => any
) {
    return createNewPairImpl(web3,token1,token2,selectSwap,netId,callback)
}
export async function deposit_Token(
  web3: Web3,
  amount: string,
  netId: number,
  callback: (error: Error | null, txid: string | null) => any
) {
  return deposit_TokenImpl(web3,amount,netId,callback)
}
// function withdraw
export async function Withdraw_nToken(
  web3: Web3,
  amount: string,
  netId: number,
  callback: (error: Error | null, txid: string | null) => any
) {
    return Withdraw_nTokenImpl(web3,amount,netId,callback)
}

// function get pair Balance
export async function getBalancePair(
  web3: Web3,
  coin: string,
  callback: (error: Error | null, txid: string | null) => any
) {
  return getBalancePairImpl(web3 , coin , callback)
}

export async function getBalance(
  web3: Web3,
  coin: string,
  netId: number,
  callback: (error: Error | null, txid: string | null) => any
) {
    return getBalanceTokenImpl(web3,coin,netId,callback)
}




// tokens to tokens  without ethereum
export async function swapExactTokensForTokens(
  web3: Web3,
  from: string,
  to: string,
  amount1: string,
  selectSwap: string,
  amountMin: string,
  netId: number,
  callback: (error: Error | null, txid: string | null) => any
) {
    return swapExactTokensForTokensImpl(web3,from,to,amount1,selectSwap,amountMin,netId,callback)
  }


export async function swapExactTokensForETH(
  web3: Web3,
  from: string,
  to: string,
  amount1: string,
  amountMin: string,
  selectSwap: string,
  netId: number,
  callback: (error: Error | null, txid: string | null) => any
) {
    return swapExactTokensForETHImpl(web3,from,to,amount1,amountMin,selectSwap,netId,callback)
}

export async function swapExactETHForTokens(
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
    return swapExactETHForTokensImpl(web3,from,to,amount1,amount2,amountMin,selectSwap,netId,callback)
}

/*-------------------------------------------*/

export async function approveNnova(
  web3: Web3,
  from: string,
  amount1: string,
  netId: number,
  callback: (error: Error | null, txid: string | null) => any
) {
      return approveNnovaImpl(web3,from,amount1,netId,callback)
  }

/*-------------------------------------------*/

export async function approveDoing(
  web3: Web3,
  from: string,
  amount1: string,
  selectSwap: string,
  netId: number, 
  callback: (error: Error | null, txid: string | null) => any
) {
  return approveDoingImpl(web3,from,amount1,selectSwap,netId,callback)
}

export async function getAllowance(
  web3: Web3,
  from: string,
  selectSwap: string,
  netId: number,
  callback: (error: Error | null, allowance: string | null) => any
) {
    return getAllowanceImpl(web3,from,selectSwap,netId,callback)
}

/*------------LIQUIDITY---------------- */
export async function addLiquidity(
  web3: Web3,
  from: string,
  to: string,
  amount1: string,
  amount2: string,
  netId: number,
  callback: (error: Error | null, txid: string | null) => any
) {
    return addLiquidityImpl(web3,from,to,amount1,amount2,netId,callback) 
}

export async function addLiquidityETH(
  web3: Web3,
  from: string,
  to: string,
  amount1: string,
  amount2: string,
  netId: number,
  callback: (error: Error | null, txid: string | null) => any
) {
      return  addLiquidityETHImpl(web3,from,to,amount1,amount2,netId,callback)
}

export async function removeLiquidity(
  web3: Web3,
  token1: string,
  token2: string,
  linkSwap: string,
  netId: number,
  callback: (error: Error | null, txid: string | null) => any
) {     

    return await removeLiquidityImpl(web3,token1,token2,linkSwap,netId,callback)
}

export async function removeLiquidityETH(
  web3: Web3,
  token1: string,
  token2: string,
  linkSwap: string,
  netId: number,
  callback: (error: Error | null, txid: string | null) => any
) {
    return await removeLiquidityETHImpl(web3,token1,token2,linkSwap,netId,callback)
  }

export async function function1(
  web3: Web3,
  from: string,
  to: string,
  amount1: string,
  amount2: string
) {
  alert(
    "token1" + "" + from + "" + "Token2" + "" + to + "" + amount1 + "" + amount2
  );
}

export async function transaction1(
  web3: Web3,
  from: string,
  to: string,
  amount1: string,
  amount2: string
) {
  alert(
    "token1" + "" + from + "" + "Token2" + "" + to + "" + amount1 + "" + amount2
  );
}
export async function function2(
  web3: Web3,
  from: string,
  to: string,
  amount1: string,
  amount2: string
) {
  alert(
    "token1" + "" + from + "" + "Token2" + "" + to + "" + amount1 + "" + amount2
  );
}
export async function transaction2(
  web3: Web3,
  from: string,
  to: string,
  amount1: string,
  amount2: string
) {
  alert(
    "token1" + "" + from + "" + "Token2" + "" + to + "" + amount1 + "" + amount2
  );
}
export async function transaction3(
  web3: Web3,
  from: string,
  to: string,
  amount1: string,
  amount2: string
) {
  alert(
    "token1" + "" + from + "" + "Token2" + "" + to + "" + amount1 + "" + amount2
  );
}
export async function transaction4(
  web3: Web3,
  from: string,
  to: string,
  amount1: string,
  amount2: string
) {
  alert(
    "token1" + "" + from + "" + "Token2" + "" + to + "" + amount1 + "" + amount2
  );
}

export async function convertEthJoinStrategy(
  web3: Web3,
  balance: string,
  token: string
) {
  alert(balance + " " + token);
}


