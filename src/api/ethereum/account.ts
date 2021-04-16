import Web3 from "web3";
export function subscribeToAccountImpl(
    web3: Web3,
    callback: (error: Error | null, account: string | null) => any
  ) {
    const id = setInterval(async () => {
      try {
        const accounts = await web3.eth.getAccounts();
        callback(null, accounts[0]);
      } catch (error) {
        callback(error, null);
      }
    }, 1000);
  
    return () => {
      clearInterval(id);
    };
  }