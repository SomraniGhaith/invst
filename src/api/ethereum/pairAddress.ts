import Web3 from "web3"
import TruffleContract from "@truffle/contract";
import UniswapContract from "../../contracts/UniswapV2Router02.json";
import DollarContract from "../../contracts/Sqoin.json";
import { configContrat } from "../config";
import UniswapV2Factory from "../../contracts/UniswapV2Factory.json";
import UniswapV2Pair from "../../contracts/UniswapV2Pair.json";
const cache = new Map<string, string>();
// @ts-ignore
const contract = TruffleContract(UniswapContract);
// @ts-ignore
const Dollar = TruffleContract(DollarContract);
// @ts-ignore
const factory = TruffleContract(UniswapV2Factory);
// @ts-ignore
const pair = TruffleContract(UniswapV2Pair);


export async function getPairAddressImpl(
    web3: Web3,
    from: string,
    to: string,
    selectSwap: string,
    netId: number,
    callback: (error: Error | null, txid: string | null) => any
  ) {
    try {
      if (cache.has(from + ":" + to)) {
        callback(null, cache.get(from + ":" + to) + "");
        return;
      }
  
      contract.setProvider(web3.currentProvider);
      Dollar.setProvider(web3.currentProvider);
  
      let adresses: any = configContrat();
  
      /* const coin1 = await Dollar.at(from)
       const coin2 = await Dollar.at(to) */
  
      factory.setProvider(web3.currentProvider);
      pair.setProvider(web3.currentProvider);
  
      if (selectSwap === "novaswap") {
        var Factory = await factory.at(adresses[0][netId].novaswap.Factory);
      } else if (selectSwap === "uniswap") {
        var Factory = await factory.at(adresses[0][netId].uniswap.Factory);
      }
  
      var pairaddress: any = {};
      if (from === "ETH" && to !== "ETH") {
        pairaddress = await Factory.getPair(adresses[0][netId].novaswap.WETH, to);
      } else if (from !== "ETH" && to === "ETH") {
        pairaddress = await Factory.getPair(
          from,
          adresses[0][netId].novaswap.WETH
        );
      } else pairaddress = await Factory.getPair(from, to);
      //console.log("from : "+from+"  to :"+to+"   adresse:"+pairaddress)
  
      callback(null, JSON.stringify(pairaddress));
    } catch (error) {
      callback(error, null);
    }
  }
  