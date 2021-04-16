import React from "react";
import "./tableInfo.css"
import "./dataTableTransations.css";

export default class tableInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            totalLiquidityUSD: "",
            totalLiquidityETH: "",
            totalVolumeUSD: "",
            totalVolumeETH: "",
            txCount: "",
            parcentVolumeETH:"",
            parcentVolumeUSD:"",
            parcentLiquidityETH:"",
            parcentLiquidityUSD:"",
            parcentTransaction:"",
            lastList: [],
            last2List: []

        };
    }
    componentDidMount() {
        this.loadInfo();
        this.loadDayDatas();
    }
    loadDayDatas = () => {
        var self = this;
        var querytosend = `{  
            uniswapDayDatas{
                dailyVolumeETH
                dailyVolumeUSD
                totalVolumeETH
                totalVolumeUSD
                totalLiquidityETH
                totalLiquidityUSD
                date
                txCount
              }
        }`;
        fetch('https://graph.novafinance.app/subgraphs/name/NovaFi/NovaFi', {
            method: 'POST',
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify({
                "query": querytosend,

            }),
        })
            .then(response => response.json())
            .then(data => {
                console.info('data:', data.data.uniswapDayDatas);
                var last = data.data.uniswapDayDatas[data.data.uniswapDayDatas.length - 1];
                var last2 = data.data.uniswapDayDatas[data.data.uniswapDayDatas.length - 2];
                console.log(JSON.stringify(last) + JSON.stringify(last2))
                var dailyVolumeUSD=last.dailyVolumeUSD-last2.dailyVolumeUSD;
                var dailyVolumeETH=last.dailyVolumeETH-last2.dailyVolumeETH;
                var totalLiquidityETH=last.totalLiquidityETH-last2.totalLiquidityETH;
                var totalLiquidityUSD=last.totalLiquidityUSD-last2.totalLiquidityUSD;
                var txCount=last.txCount-last2.txCount;
                console.log(txCount/100)
              // console.log(self.financial((dailyVolumeUSD/1000000000000000000)/100))
               //console.log(Math.sign(self.financial((dailyVolumeUSD/1000000000000000000)/100)))
               console.log(self.financial((dailyVolumeETH/1000000000000000000)/100))
               console.log(Math.sign(self.financial((dailyVolumeETH/1000000000000000000)/100)))

                self.setState({ lastList: last, last2List: last2,parcentVolumeUSD: self.financial((dailyVolumeUSD/1000000000000000000)/100),parcentVolumeETH:self.financial((dailyVolumeETH/1000000000000000000)/100),parcentLiquidityETH:self.financial((totalLiquidityETH/1000000000000000000)/100),parcentLiquidityUSD:self.financial((totalLiquidityUSD/1000000000000000000)/100),parcentTransaction:txCount/100})
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    loadInfo = () => {
        var self = this;
        var querytosend = `{  
            uniswapFactories{
                totalLiquidityETH
                totalLiquidityUSD
                totalVolumeUSD
                totalVolumeETH
                txCount
          }}`;
        console.log(querytosend)
        fetch('https://graph.novafinance.app/subgraphs/name/NovaFi/NovaFi', {
            method: 'POST',
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify({
                "query": querytosend,

            }),
        })
            .then(response => response.json())
            .then(data => {
                //console.info('data:', data.data.uniswapFactories[0].txCount);
                self.setState({ txCount: data.data.uniswapFactories[0].txCount, totalLiquidityETH: data.data.uniswapFactories[0].totalLiquidityETH, totalLiquidityUSD: data.data.uniswapFactories[0].totalLiquidityUSD, totalVolumeETH: data.data.uniswapFactories[0].totalVolumeETH, totalVolumeUSD: data.data.uniswapFactories[0].totalVolumeUSD })
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    financial = (x) => {
        return Number.parseFloat(x).toFixed(4);
    }
    renderPercent=(x)=>{
        var ret=[];
        if(Math.sign(x)<0){
            ret.push(
<span className="text-red">{x}% ↓</span>
            )
        }else{
            ret.push(
                <span  className="text-green">+{x}% ↑</span>
        )
        }
        return ret;
    }
    render() {
        return (
            <>
                <div className="tradecard">
                    <p className="text-muted">Total Liquidity </p>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                        <span className="text-bold ">{this.financial(this.state.totalLiquidityETH / 1000000000000000000)}ETH {this.renderPercent(this.state.parcentLiquidityETH)} </span>
                        <span className="text-bold"> $ {this.financial(this.state.totalLiquidityUSD / 1000000000000000000)} {this.renderPercent(this.state.parcentLiquidityUSD)} </span>
                    </div>
                </div>

                <div className="tradecard">
                    <p className="text-muted">Volume (24hrs)</p>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                        <span className="text-bold">{this.financial(this.state.totalVolumeETH / 1000000000000000000)}ETH {this.renderPercent(this.state.parcentVolumeETH)}</span>
        <span className="text-bold">$ {this.financial(this.state.totalVolumeUSD / 1000000000000000000)} {this.renderPercent(this.state.parcentVolumeUSD)}</span>
                    </div>
                </div>

                <div className="tradecard">
                    <p className="text-muted">Transactions (24hrs)</p>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                        <span className="text-bold">{this.state.txCount}</span>
                        <span className="text-bold">{this.renderPercent(this.state.parcentTransaction)} </span>
                    </div>
                </div>
            </>
        )
    }

}
