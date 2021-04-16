import { combineReducers } from "redux";
import connection from "./connection";
import jeton from "./jeton";
import balances from "./balances";
import pairs from "./pairs";
export default combineReducers({
  connection,
  jeton,
  balances,
  pairs,
});
