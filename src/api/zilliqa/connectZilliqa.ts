// @ts-ignore
var currentZilliqa;
export async function connectZilliqaImpl(callback : (err : any | null , connect : boolean | null)=> any ){
    //@ts-ignore
    const zilliqa = window.zilPay
    if (!zilliqa) {
      callback("Zilpay is not installed" , null);
    }
  
  //@ts-ignore
  await zilliqa.wallet.connect();
    //@ts-ignore
    
    const isConnect = await zilliqa.wallet.isConnect;
    if (!isConnect) {
      callback("wallet is not connected" , null);
    }
   
    //@ts-ignore
    currentZilliqa = window.zilPay;
    callback(null , isConnect);
  
  }
  