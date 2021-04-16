// @ts-ignore
var currentZilliqa;
export async function getZilAccountImpl(callback:any) {
    //@ts-ignore
    currentZilliqa = window.zilPay;
    const isConnect = await currentZilliqa.wallet.isConnect;
    if(isConnect){
     var account = currentZilliqa.wallet.defaultAccount

     callback(account.bech32,account.base16,null)
    }
   }

