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

export async function createNewPairImpl(
    web3: Web3,
    token1: string,
    token2: string,
    selectSwap: string,
    netId: number,
    callback: (error: Error | null, txid: string | null) => any
  ) {
    try {
      var accounts = await web3.eth.getAccounts();
      let adresses: any = configContrat();
      factory.setProvider(web3.currentProvider);
  
      if (selectSwap === "novaswap") {
        var Factory = await factory.at(adresses[0][netId].novaswap.Factory);
      } else if (selectSwap === "uniswap") {
        var Factory = await factory.at(adresses[0][netId].uniswap.Factory);
      }
  
      if (token1 === "ETH" && token2 !== "ETH") {
        await Factory.createPair(adresses[0][netId].novaswap.WETH, token2, {
          from: accounts[0]
        });
      } else if (token1 !== "ETH" && token2 === "ETH") {
        await Factory.createPair(token1, adresses[0][netId].novaswap.WETH, {
          from: accounts[0]
        });
      } else await Factory.createPair(token1, token2, { from: accounts[0] });
  
      callback(null, "Create success");
    } catch (error) {
      callback(error, null);
    }
  }