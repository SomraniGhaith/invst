import React, {useState, useEffect } from 'react';
const [chartList, setchartList] = useState<any[]>([]);
export async function  loadDataReserve() {
    var list : any = [];
     
          fetch("https://novafinance.app/api/getReserves").then(response => 
            response.clone().json().catch(() => response.text())
         
          ).then(data => { 
             
            data.forEach((element : any , key : number)  => {
                //console.log("data "+JSON.stringify(element.date))
                var price = parseFloat(element.reserve_to)/parseFloat(element.reserve_from)
             
                var object = { "price": price,"date": element.date}
                list.push(object)

              });
              setchartList(list)
            
           
            // data is now parsed JSON or raw text
          });
                console.log(chartList)

            

          
      }