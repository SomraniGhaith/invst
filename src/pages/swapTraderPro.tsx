import React, { useState, useEffect } from "react";

import './swapTraderPro.css'
import { unlockAccount, addLiquidity } from '../api/web3'
import useAsync from "../components/useAsync";
import './swapTraderPro.css'
import SwapStandardView from "./swapStandardView"
//import Chart from "../components/chart";
import { useWeb3Context } from "../contexts/Web3";
import Web3 from "web3";
import './swapView.css'
import { getTotalLiquidity } from '../api/liquidity';
import { getSwapList } from '../api/swap';
import { getPaires } from "../api/Bonus"
import Chart from "./Chart";
import DataTableTransations from "../components/dataTableTransations"
import TableInfo from "../components/tableInfo";


let totalLiquidity: any = getTotalLiquidity().totalLiquidity;
let swapList: any = getSwapList();



function SwapTraderPro(props: any) {
    const [value, setValue] = useState(false);
    const { state: { account, netId, balance }, updateAccount } = useWeb3Context();
    const [tab, settab] = useState([])
    const [tokenFrom, setTokenFrom] = useState(props.tokenFrom)
    const [tokenTo, setTokenTo] = useState(props.tokenTo)
    const [tolerance, setTolerance] = useState(props.tolerance)
    //function for get web 3  we use setData(data.web3)
    // u
    const [web3, setWeb3] = useState(new Web3());
    async function onClickAmount() {
        if ((slected1) && (slected2) !== "ETH")

            // @ts-ignore
            return addLiquidity(web3, slected1, slected2, input1, input2, (s) => {
                //callbcack its funtion fo what we do then
                // alert(s);
            });

    }

    var paireName: any[] = []

    getPaires().map((val) => (

        val.pairesName.map((name) => (

            paireName.push(name)


        ))
    ))







    const { pending, error, call } = useAsync(unlockAccount);
    async function onClickConnect() {
        const { error, data } = await call(null);

        if (error) {

        }
        if (data) {

            setWeb3(data.web3);
            //    setAccount({account: data.account , balance: balance });
            updateAccount(data);
        }


    }


    const toHumanReadableBalance = (balance: string, unit: string) => {
        var f = parseFloat(balance);
        return (f / 1000000000000000000) + unit;
    };

    useEffect(() => {
        //  loadData();
    }, [])
    useEffect(() => {
        onClickConnect();
        setTolerance(!(props.tolerance) ? "1.1" : props.tolerance)
    }, [props.tolerance]);
    function formAccount(x: String) {
        var str = x;
        var res1 = str.substring(0, 6);
        var res2 = str.substring(str.length - 4, str.length);
        var res = (res1.concat('...', res2));
        return (res)
    }


    //fonction select
    const [input1, setInput1] = useState("");
    const [input2, setInput2] = useState("");
    const [slected1, setSelected1] = useState(tokenFrom ? tokenFrom : "default");
    const [slected2, setSelected2] = useState(tokenTo ? tokenTo : "default");

    function handerValue1(e: React.ChangeEvent<HTMLInputElement>) {
        setInput1(e.target.value);
    }
    function handerValue2(e: React.ChangeEvent<HTMLInputElement>) {
        setInput2(e.target.value);
    }
 



    return (
        <div className="main-layout inner_page">
            <div className="" style={{ display: "flex", justifyContent: 'space-around' }}>
                <div className="col-lg-6 ">
                <Chart tokenFrom={tokenFrom} tokenTo={tokenTo} />
                  
                  {/*   {((tokenFrom.length && tokenTo.length)) && (

                        <Chart tokenFrom={tokenFrom} tokenTo={tokenTo} />

                    )
                    } */}
                </div>



                {/* -------------------------- */}

                <div className=" col-lg-6">


                    <SwapStandardView tolerance={tolerance} changeTokenFrom={setTokenFrom} changeTokenTo={setTokenTo}/>

                </div>
            </div>




            {/* ---------------------- */}
            <div className="mt-5" style={{ display: "flex", justifyContent: 'space-around' }}>
             
                <div className="col-md-4" style={{marginTop:"40px"}}>

                   <TableInfo/>


                </div>

                {/* -------------------------- */}
                <div className="col-md-8">
                <DataTableTransations/>
                    
                </div>

            </div>


        </div>


    );
}
export default SwapTraderPro

