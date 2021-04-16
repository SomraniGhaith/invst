export async function getZilNetIdImpl(callback:any) {
    //@ts-ignore
   const currentZilliqa = window.zilPay;
   const isConnect = await currentZilliqa.wallet.isConnect;
   if(isConnect)
        { await currentZilliqa.wallet.observableNetwork().subscribe(function (net : any) {
        callback(net)
      }); 
      const net = await currentZilliqa.wallet.net
        callback(net)
       
      }
    
  }