import BigNumber from "bignumber.js";

export async function getZilBalanceImpl(callback: any) {
    
  //@ts-ignore
  const currentZilliqa = window.zilPay;
  var account = currentZilliqa.wallet.defaultAccount
  const balanceOfaccount = await currentZilliqa.blockchain.getBalance(account.bech32);
  var Balance = balanceOfaccount.result.balance
  var balance = parseFloat(Balance) / 1000000000000
  callback(balance.toString(),null)
}


/* 
 const currentZilliqa = window.zilPay;

  var account = currentZilliqa.wallet.defaultAccount
  const isConnect = await currentZilliqa.wallet.isConnect;
  if (isConnect) {
    if (token === "zil1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9yf6pz") {
    
      const balanceOfaccount = await currentZilliqa.blockchain.getBalance(account.bech32);
      var Balance = balanceOfaccount.result.balance
      var balance = parseFloat(Balance) / 1000000000000
      console.log(Balance)
      callback(null, balance.toString())
    }
    else {


      const smartContractState = await currentZilliqa.blockchain.getSmartContractState(
        token
      );
      var address = account.bech32
      // console.log(smartContractState.result.balance);
      var balanceToken = smartContractState.result.balances[address.toLowerCase()]
      if (balanceToken === undefined) {
        callback(null, "0")

      }
      else {
        var balance = parseFloat(balanceToken) / 1000000000000
        console.log(balance)
        callback(null, balance.toString())
      }
    }


  }
    //@ts-ignore
  const currentZilliqa = window.zilPay;
  const isConnect = await currentZilliqa.wallet.isConnect;
  if (isConnect) {
    var account = currentZilliqa.wallet.defaultAccount
    const balanceOfaccount = await currentZilliqa.blockchain.getBalance(account.bech32);
    var Balance = balanceOfaccount.result.balance
    var balance = parseFloat(Balance) / 1000000000000
    callback(balance)
  
      
  
     */