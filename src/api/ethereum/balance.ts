
import Web3 from "web3";


export function subscribeToBalanceImpl(
    web3: Web3,
    callback: (error: Error | null, balance: string | null) => any
  ) {
    const id = setInterval(async () => {
      try {
        const accounts = await web3.eth.getAccounts();
        const balance = await web3.eth.getBalance(accounts[0]);
        callback(null, balance);
      } catch (error) {
        callback(error, null);
      }
    }, 1000);
  
    return () => {
      clearInterval(id);
    };
  }