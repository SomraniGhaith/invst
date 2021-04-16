import Web3 from 'web3'
import { configContrat } from "../config";
import DollarContract from "../../contracts/Sqoin.json";
import Vault_Deposit from "../../contracts/vault/contracts/Vault.json";
import TruffleContract from "@truffle/contract";

//@ts-ignore
const vault = TruffleContract(Vault_Deposit);

export async function deposit_TokenImpl(
    web3: Web3,
    amount: string,
    netId: number,
    callback: (error: Error | null, txid: string | null) => any
  ) {
    try {
      let adresses: any = configContrat();
      vault.setProvider(web3.currentProvider);
      const Vault = await vault.at(adresses[0][netId].novaswap.vaultProxy);
      var accounts = await web3.eth.getAccounts();
      var amountBig = Web3.utils.toWei(amount);
      await Vault.deposit(amountBig, { from: accounts[0] });
  
      callback(null, "Create success");
    } catch (error) {
      callback(error, null);
    }
  }
  
export async function Withdraw_nTokenImpl(
    web3: Web3,
    amount: string,
    netId: number,
    callback: (error: Error | null, txid: string | null) => any
  ) {
    try {
      let adresses: any = configContrat();
      vault.setProvider(web3.currentProvider);
      const Vault = await vault.at(adresses[0][netId].novaswap.vaultProxy);
      var accounts = await web3.eth.getAccounts();
      var amountBig = Web3.utils.toWei(amount);
      await Vault.withdraw(amountBig, { from: accounts[0] });
  
      callback(null, "Create success");
    } catch (error) {
      callback(error, null);
    }
  }