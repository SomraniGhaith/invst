import React, { PureComponent } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

import { getCoins } from "../api/coins";

import { connect } from "react-redux";
class Chart extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      loadPage: true,
      tokenFrom: "",
      tokenTo: "",
      amount: 0,
      coinNameFrom: "",
      coinNameTo: "",
      dataChart: [],
      dataQuery: [],
      valueMax: 0,
      pairsL: [],
      nameToken0: "",
      nameToken1: ""
    }
  }




  getMaxValue(dataValue) {

    if (Array.isArray(dataValue) && dataValue.length > 0)
      return Math.max.apply(Math, dataValue.map(function (o) { return Number(o.price); }))
    return 0

  }
  async getCoinName(tokenAddress0, tokenAddress1) {
    //@ts-ignore
    const coin0 = getCoins("42", "novaswap").find(coin => coin.address === tokenAddress0);
    const coin1 = getCoins("42", "novaswap").find(coin => coin.address === tokenAddress1);
    if (coin0 && coin1) {
      await this.setState({ nameToken0: coin0.name });
      await this.setState({ nameToken1: coin1.name });
    }
  }

  /*-------------function for update chart ------ */
  strUcFirst(a) { return (a + '').charAt(0).toUpperCase() + a.substr(1); }
  getChartByReserve() {

    const { tokenFrom, tokenTo } = this.props;
    const { nameToken0, nameToken1 } = this.state;

    var ret = [];
    var self = this;
   // console.log("0 =" + nameToken0 + " 1 =" + nameToken1)
    self.state.pairsL.map((pair) => {
      //console.log(JSON.stringify(pair))
     // console.log("0 " + nameToken0 + "1 " + nameToken1)
      if (pair.nameToken0 === nameToken0.toUpperCase() && pair.nameToken1 === nameToken1.toUpperCase()) {
        //alert("adress pair est " + pair.adressPair);
        var querytosend = `{ 
          pairDayDatas( where: {pairAddress:"${pair.adressPair}"}){
            id 
            pairAddress 
            reserve0
            reserve1
            date
          }
        }`;
        //console.log(querytosend)
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

            ret.push(data);
            self.setState({ dataQuery: ret }, () => {
              //console.log('Success:', self.state.dataQuery);
            })
            const dataChart = self.state.dataQuery[0].data.pairDayDatas.map((element) => {
             // console.log("elemet" + element.reserve0)

              var price = (parseFloat(element.reserve1) / parseFloat(element.reserve0)).toFixed(3)
              const unixTimestamp = element.date

              const milliseconds = unixTimestamp * 1000 // 1575909015000

              const dateObject = new Date(milliseconds)

              const humanDateFormat = dateObject.toLocaleDateString() //2019-12-9 10:30:15
              var object = { "price": price, "date": humanDateFormat }
              // var numberofTime = Date.parse(new Date(element.date))

              return ({
                name: object.date,
                price: object.price
              });

            })
            self.setState({ dataChart })
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
    })

    //(`/api/getReserves?from=${tokenFrom}&to=${tokenTo}`
    /* fetch('/api/getReserves?from=' + tokenFrom + '&to=' + tokenTo)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        const dataChart = data.map(element => {
          var price = (parseFloat(element.reserve_to) / parseFloat(element.reserve_from)).toFixed(3)
          var object = { "price": price, "date": element.date }
          // var numberofTime = Date.parse(new Date(element.date))
    
          return ({
            name: object.date,
            price: object.price
          });
    
        })
        self.setState({ dataChart })
        //chart.render() 
      });
    console.log("fetch " + JSON.stringify(self.state.dataQuery)) */
  }

  componentDidUpdate(prevProps, prevState) {
    const { tokenFrom, tokenTo } = this.props
    if (tokenFrom != prevProps.tokenFrom || tokenTo != prevProps.tokenTo) {
      this.getCoinName(tokenFrom, tokenTo).then(res => {
        this.getChartByReserve()
      })
      // this.setState({ nameToken0: coinName }, () => {
      //   this.getChartByReserve()
      // })

    }


  }
  componentDidMount() {
    const { tokenFrom, tokenTo } = this.props
    this.getCoinName(tokenFrom, tokenTo).then(res => {
      this.getChartByReserve()
    })

  }

  listPairs = () => {
    var pairsList = this.props.pairs;

    if (this.state.loadPage) {

      var self = this;

      self.setState({ pairsL: pairsList, loadPage: false }, () => {
       // console.log("liste pairs  ++" + JSON.stringify(self.state.pairsL));
      });

    }
  }

  render() {
    let { dataChart, nameToken0, nameToken1 } = this.state
    let { tokenFrom, tokenTo } = this.props
    let coinNameFrom, coinNameTo, valueMax;
    valueMax = this.getMaxValue(dataChart)
    coinNameFrom = nameToken0
    //  alert({this.coinNameFrom})


    coinNameTo = nameToken1





    return (
      <div style={{padding:"5%"}}>
      <div style={{ width: '100%', height: 400, backgroundColor: "black" }}>
        {this.listPairs()}
        <p style={{ color: "white" }}>  Liquidity
          {coinNameFrom && coinNameTo ? (
            <p style={{ color: '#FF00FF' }}>
              {coinNameFrom}-{coinNameTo}
            </p>
          ) : null
          }
        </p>
        <ResponsiveContainer width="100%" height={350} >

          <AreaChart
            width={900}
            height={900}
            data={dataChart}

            // {...this.setState({amount : dataChart.uv})}
            margin={{
              top: 10, right: 30, left: 0, bottom: 0

            }}


          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, parseInt(valueMax + 5)]} />
            <Tooltip />
            <Area type="monotone" dataKey="price" stroke="#FF00FF" fill="#FF00FF" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      </div>
    );

  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    pairs: state.pairs
  };
};


export default connect(
  mapStateToProps,
  null
)(Chart);

