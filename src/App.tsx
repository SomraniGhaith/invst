import React from "react";

import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import {AnimatePresence,motion} from 'framer-motion'
// import createHistory from "history/createBrowserHistory";
import { createBrowserHistory } from "history";

import Home from "../src/pages/home";
//import TempLanding from "../src/pages/templanding";
import About from "../src/pages/about";
import Bonus from "../src/pages/bonus";
import { HashRouter, Route, Switch } from "react-router-dom";
import Earn from "../src/pages/earn";
import Bonus1 from "../src/pages/bonus1";
import Earn1 from "../src/pages/earn1";
import Earn2 from "../src/pages/earn2";
import Landingpage from "../src/pages/landingpage";
import SubscribePage from "../src/pages/subscribepage"
import SwapStandardView from "./pages/swapStandardView";
import SwapTraderPro from "./pages/swapTraderPro";
import SwapHome from "./components/swapHome";
import { Web3ReactProvider, useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import store from "./redux/store";
import InvestForm from "../src/pages/invest";
import Web3 from "web3";

export const history = createBrowserHistory();
function App() {
  let persistor = persistStore(store);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HashRouter>
          <div>
          <Switch>
              <Route exact path="/">
                 <InvestPageLink />
              </Route> 
          </Switch>
          </div>
        </HashRouter>
      </PersistGate>
    </Provider>
  );
}
function HomeLink() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      {" "}
      <Landingpage />{" "}
    </Web3ReactProvider>
  );
}

function getLibrary(provider: any) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 8000;
  return library;
}

function EarnLink() {
  return <Earn />;
}
function InvestPageLink() {
  return <InvestForm />;
}

function Home1Link() {
  return <Home />;
}
function BonusLink() {
  return <Bonus />;
}
/* function TempLandingLink() {
  return <TempLanding />;
} */

function LandingpageLink(){
  return<Landingpage />;
}
const pageVariants={
  in:{
    opacity:1,
  y:0
  },
  out:{
    opacity:0,
    y:"-100vw"
  }
};

const pageTransition ={
  duration :2
}


function SubscribePageLink(){
  return(
  <motion.div   
  initial="out"
  animate="in"
  variants={pageVariants}
  transition={pageTransition}
  >
  <SubscribePage />;
  </motion.div>)
}
function AboutLink() {
  return <About />;
}
function SwapStandardViewLink() {
  return <SwapStandardView />;
}
function SwapTraderProLink() {
  return <SwapTraderPro />;
}
function Bonus1Link() {
  return <Bonus1 />;
}
function Earn1Link() {
  return <Earn1 />;
}
function Earn2Link() {
  return <Earn2 />;
}
function SwapHomeLink() {
  return <SwapHome />;
}
export default App;

//Nova Finance app
