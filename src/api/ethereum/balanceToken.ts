import Web3 from 'web3';
import { configContrat } from "../config";
import DollarContract from "../../contracts/Sqoin.json";
import Vault_Deposit from "../../contracts/vault/contracts/Vault.json";
import UniswapV2Pair from "../../contracts/UniswapV2Pair.json";
import TruffleContract from "@truffle/contract";

const balanceCache = new Map<string, string>();
// @ts-ignore
const Dollar = TruffleContract(DollarContract);
//@ts-ignore
const vault = TruffleContract(Vault_Deposit);
// @ts-ignore
const pair = TruffleContract(UniswapV2Pair);
export async function getBalanceTokenImpl(
    web3: Web3,
    coin: string,
    netId: number,
    callback: (error: Error | null, txid: string | null) => any
  ) {
    try {
      let adresses: any = configContrat();
  
      if (balanceCache.has(coin)) {
        callback(null, "" + balanceCache.get(coin));
  
      }
      if (coin === "ETH") {
        const accounts = await web3.eth.getAccounts();
        const balance = await web3.eth.getBalance(accounts[0]);
        balanceCache.set(coin, balance.toString());
        callback(null, balance.toString());
      } else if (coin === adresses[0][netId].novaswap.vaultProxy) {
        vault.setProvider(web3.currentProvider);
        const Vault = await vault.at(adresses[0][netId].novaswap.vaultProxy);
        var accounts = await web3.eth.getAccounts();
        var balance = await Vault.balanceOf(accounts[0]);
        balanceCache.set(coin, balance.toString());
        callback(null, balance.toString());
      } else {
        Dollar.setProvider(web3.currentProvider);
        const dollar = await Dollar.at(coin);
        var accounts = await web3.eth.getAccounts();
        var balance = await dollar.balanceOf(accounts[0]);
      }
  
      balanceCache.set(coin, balance.toString());
      callback(null, balance.toString());
    } catch (error) {
      callback(error, null);
    }
  }
  // function get pair Balance
export async function getBalancePairImpl(
    web3: Web3,
    coin: string,
    callback: (error: Error | null, txid: string | null) => any
  ) {
    try {
      if (balanceCache.has(coin)) {
        callback(null, "" + balanceCache.get(coin));
        return;
      }
  
      pair.setProvider(web3.currentProvider);
      const dollar = await pair.at(coin.slice(1, -1));
      var accounts = await web3.eth.getAccounts();
      var balance = await dollar.balanceOf(accounts[0]);
      balanceCache.set(coin, balance.toString());
  
      callback(null, balance.toString());
    } catch (error) {
      callback(error, null);
    }
  }
  