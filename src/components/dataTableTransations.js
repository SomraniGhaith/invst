import React from "react";
import { MDBDataTable } from "mdbreact";
import $ from "jquery";
import Web3 from "web3";
import { connect } from "react-redux";

import "./dataTableTransations.css";

class DataTableTransations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataToShow: [],
            transationsList: [],
            transationSwaps: [],
            transationMints: [],
            transationBurns: [],
            reseauNet:"",
            LinkName:""
        };
    }





    componentDidMount() {
        this.getLinkName(this.props.connection.networkId)


        this.loadTransations()
        $(".dataTables_length.bs-select label").html(
            $(".dataTables_length.bs-select label").children()
        );
        $(".dataTables_length.bs-select label select option").append(" Transations");
    }
     getLinkName=(reseauId)=> {
        if (reseauId === 42) {
         this.setState({LinkName:"https://kovan.etherscan.io/tx/"})
        } else if (reseauId === 4) {
          this.setState({LinkName: "https://rinkeby.etherscan.io/tx/"})
        }
      }
    formAccount = (x) => {
        var str = x;
        var res1 = str.substring(0, 6);
        var res2 = str.substring(str.length - 4, str.length);
        var res = (res1.concat('...', res2));
        return (res)
    }
    
    loadTransations = () => {
        var { transationsList, transationMints, transationSwaps, transationBurns } = this.state;
        var retM = [];
        var retB = [];
        var retS = [];
        var ret = [];
        var self = this;
        var querytosend = `{ 
            mints{
                id
                timestamp
                sender
                amount0
                amount1
                pair{
                    token0{symbol name}
                    token1{symbol name}
                } 
              }
              burns{
                id
                timestamp
                sender
                amount0
                amount1
                pair{
                    token0{symbol name}
                    token1{symbol name} 
                }
              }
              swaps{
                id
                sender
                totalValue
                pair{
                    token0{symbol name}
                    token1{symbol name}
                }
                amount0In
                amount1In
                amount0Out
                amount1Out
                timestamp
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
                //console.log('data:', data);
                data.data.mints.map(mint => {
                    const unixTimestamp = mint.timestamp
                    const milliseconds = unixTimestamp * 1000 // 1575909015000
                    const dateObject = new Date(milliseconds)
                    const humanDateFormat = dateObject.toLocaleDateString() //2019-12-9 10:30:15
                    if((mint.pair.token0.name.toUpperCase() !="UNKNOWN NAME")&&(mint.pair.token1.name.toUpperCase() !="UNKNOWN NAME")){
                        if((mint.pair.token0.name.toUpperCase()=="ETH")||(mint.pair.token1.name.toUpperCase()=="ETH")){
                        var transation = {"id":mint.id, "title": "Add " + mint.pair.token0.name.toUpperCase() + " and " + mint.pair.token1.name.toUpperCase(), "token0":Number.parseFloat(Web3.utils.fromWei(mint.amount0,'ether')).toFixed(3)  + " " + mint.pair.token0.symbol, "token1":Number.parseFloat(Web3.utils.fromWei(mint.amount1,'ether')).toFixed(3) + " " + mint.pair.token1.symbol, "sender": self.formAccount(mint.sender), "date": humanDateFormat, "totleValue": " -- " }
                        retM.push(transation);
                        }else{
                                var transation = {"id":mint.id, "title": "Add " + mint.pair.token0.name.toUpperCase() + " and " + mint.pair.token1.name.toUpperCase(), "token0":Number.parseFloat(mint.amount0/1000000000000000000).toFixed(3) + " " + mint.pair.token0.symbol, "token1": Number.parseFloat(mint.amount1/1000000000000000000).toFixed(3) + " " + mint.pair.token1.symbol, "sender": self.formAccount(mint.sender), "date": humanDateFormat, "totleValue": " -- " }
                                retM.push(transation);
                        }
                    }

                })
                data.data.swaps.map(swap => {
                    const unixTimestamp = swap.timestamp
                    const milliseconds = unixTimestamp * 1000 // 1575909015000
                    const dateObject = new Date(milliseconds)
                    const humanDateFormat = dateObject.toLocaleDateString() //2019-12-9 10:30:15
                    if( (swap.pair.token0.name.toUpperCase()!="UNKNOWN NAME") && (swap.pair.token1.name.toUpperCase()!="UNKNOWN NAME")){
                        if((swap.pair.token0.name.toUpperCase()=="ETH")||(swap.pair.token1.name.toUpperCase()=="ETH")){
                            var transation = {"id":swap.id, "title": "Swap " + swap.pair.token0.name.toUpperCase() + " for " + swap.pair.token1.name.toUpperCase(), "token0":Number.parseFloat(Web3.utils.fromWei(swap.amount0In,'ether')).toFixed(3) + " " + swap.pair.token0.symbol, "token1":Number.parseFloat(Web3.utils.fromWei(swap.amount1In,'ether')).toFixed(3) + " " + swap.pair.token1.symbol, "sender": self.formAccount(swap.sender), "date": humanDateFormat, "totleValue": swap.totalValue }
                            retS.push(transation);
                        }else{
                            var transation = {"id":swap.id,"title": "Swap " + swap.pair.token0.name.toUpperCase() + " for " + swap.pair.token1.name.toUpperCase(), "token0":Number.parseFloat(swap.amount0In/1000000000000000000).toFixed(3) + " " + swap.pair.token0.symbol, "token1":Number.parseFloat(swap.amount1In/1000000000000000000).toFixed(3) + " " + swap.pair.token1.symbol, "sender": self.formAccount(swap.sender), "date": humanDateFormat, "totleValue": swap.totalValue }
                            retS.push(transation);
                        }
                       
                    }
                })
                data.data.burns.map(burn => {
                    const unixTimestamp = burn.timestamp
                    const milliseconds = unixTimestamp * 1000 // 1575909015000
                    const dateObject = new Date(milliseconds)
                    const humanDateFormat = dateObject.toLocaleDateString() //2019-12-9 10:30:15
                    if( (burn.pair.token0.name.toUpperCase()!="UNKNOWN NAME")&&(burn.pair.token1.name.toUpperCase()!="UNKNOWN NAME")){
                        if((burn.pair.token0.name.toUpperCase()=="ETH")||(burn.pair.token1.name.toUpperCase()=="ETH")){
                    var transation = {"id":burn.id, "title": "Burn " + burn.pair.token0.name.toUpperCase() + " and " + burn.pair.token1.name.toUpperCase(), "token0":Number.parseFloat(Web3.utils.fromWei(burn.amount0,'ether')).toFixed(3) + " " + burn.pair.token0.symbol, "token1": Number.parseFloat(Web3.utils.fromWei(burn.amount1,'ether')).toFixed(3)+ " " + burn.pair.token1.symbol, "sender": self.formAccount(burn.sender), "date": humanDateFormat, "totleValue": " -- " }
                    retB.push(transation);
                        }else{
                            var transation = {"id":burn.id, "title": "Burn " + burn.pair.token0.name.toUpperCase() + " and " + burn.pair.token1.name.toUpperCase(), "token0":Number.parseFloat(burn.amount0/1000000000000000000).toFixed(3) + " " + burn.pair.token0.symbol, "token1": Number.parseFloat(burn.amount1/1000000000000000000).toFixed(3)+ " " + burn.pair.token1.symbol, "sender": self.formAccount(burn.sender), "date": humanDateFormat, "totleValue": " -- " }
                    retB.push(transation);
                        }
                    }

                })

                ret.push(retS);
                ret.push(retB);
                ret.push(retM)
                self.setState({ transationsList: ret, transationMints: retM, transationBurns: retB, transationSwaps: retS }, () => {
                    
                    self.renderData();
                })

            })
            .catch((error) => {
                console.error('Error:', error);
            });

    }
    navigatToEtherscan=(id)=>{
        var newStr = id.substring(0, id.length - 2);
        console.log(newStr);
    }


    renderData = () => {
        let { dataToShow, transationsList } = this.state;
        let data = transationsList;
        data.map((elemnt, index) => {
            elemnt.map((item, i) => {
                dataToShow.push({
                    all:(
                        <a href={this.state.LinkName+item.id.substring(0,item.id.length-2)} target="_blank">{item.title}</a>
                      ),
                    totalValue: item.totleValue,
                    token0: item.token0,
                    token1: item.token1,
                    account: item.sender,
                    date: item.date,
                });
            })

        });
    };
    render() {
        const data = {
            columns: [
                {
                    label: "ALL",
                    field: "all",
                    sort: "asc",
                    width: 270
                },
                {
                    label: "Total Value",
                    field: "totalValue",
                    sort: "asc",
                    width: 270
                },
                {
                    label: "Token Account",
                    field: "token0",
                    sort: "asc",
                    width: 100
                },
                {
                    label: "Token Account",
                    field: "token1",
                    sort: "asc",
                    width: 100
                },
                {
                    label: "Account",
                    field: "account",
                    sort: "asc",
                    width: 150
                },
                {
                    label: "Time",
                    field: "date",
                    sort: "asc",
                    width: 150
                }
            ],
            rows: this.state.dataToShow
        };

        return (
            <div className="DataTablePage" style={{ backgroundColor: "white", marginBottom: "10%", padding: "0 5px 5px 5px" }}>


                <MDBDataTable
                    striped
                    bordered
                    large
                    hover
                    entriesOptions={[5, 20, 25]}
                    entries={5}
                    // pagesAmount={4}
                    data={data}
                    fullPagination
                    noRecordsFoundLabel="Aucun Transation  trouvés"
                    paginationLabel={["Précédent", "Suivant"]}
                    searchLabel="Rechercher"
                    responsive={true}
                    entriesLabel="Transations"
                    sortable={false}
                />
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
      connection: state.connection
    };
  };
  
  
  export default connect(
    mapStateToProps,
    null
  )(DataTableTransations);