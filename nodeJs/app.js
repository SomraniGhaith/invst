"use strict";
const _publics = {};
const express = require("express");
const app = express();
var config = require("./config");
var pool = config.pool;
var emailConfig = require("./emailConfig");
var transporter = emailConfig.transporter;
let fs = require('fs');
app.use((req, res, next) => {
  res.payload = {};
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=Strict");
  next();
});


app.listen(config.port, () =>
  console.log(`Hello world ***app listening on port ${config.port}!`)
);
//send Email

function sendEmail (emailTo) {

  return new Promise((resolve, reject) => {



    fs.readFile('./WelcomeEmailTemplate.html', null, function (error, data) {
      try {
        transporter.sendMail({
          from: 'team@novafinance.app',
          to: emailTo,
          subject: "Welcome to NovaFi",
          html:data,
      }, (error, info) => {
          if (error) {
              return reject("failure" + error)
          } else {
            return resolve("email was sent successfully")
          }

      })
      

     } catch (error) { console.log(error) }

  })

   });
}

app.get("/api/sendEmail", (req, res, next) => {
  sendEmail(req.query.emailTo)
    .then(response => res.send(response))
    .catch(next);
});


/***********BALANCE USING ZIL******** */

const { BN, Long, bytes, units } = require('@zilliqa-js/util');
const { Zilliqa } = require('@zilliqa-js/zilliqa');
const zilliqa = new Zilliqa('https://api.zilliqa.com');


var cache = {};

async function zilliqaBalance() {
  let dataZil = [
    "zil1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9yf6pz",
    "zil17zvlqn2xamqpumlm2pgul9nezzd3ydmrufxnct",
    "zil1x6z064fkssmef222gkhz3u5fhx57kyssn7vlu0",
    "zil1hau7z6rjltvjc95pphwj57umdpvv0d6kh2t8zk",
    "zil1p2cp77kz06wlxeyha4psawencm5gx8ttcwsxdn",
    "zil18f5rlhqz9vndw4w8p60d0n7vg3n9sqvta7n6t2",
    "zil1a5wkhunysdp9x0nww5qe6m2m8x2m3ygdpuu257",
    "zil1ztmv5jhfpnxu95ts9ylup7hj73n5ka744jm4ea",
    "zil17tsmlqgnzlfxsq4evm6n26txm2xlp5hele0kew",
    "zil1zu72vac254htqpg3mtywdcfm84l3dfd9qzww8t",
    "zil1r9dcsrya4ynuxnzaznu00e6hh3kpt7vhvzgva0",
    "zil1l0g8u6f9g0fsvjuu74ctyla2hltefrdyt7k5f4",
    "zil1p5suryq6q647usxczale29cu3336hhp376c627",
    "zil1arrjugcg28rw8g9zxpa6qffc6wekpwk2alu7kj",
    "zil1ucvrn22x8366vzpw5t7su6eyml2auczu6wnqqg",
    "zil14pzuzq6v6pmmmrfjhczywguu0e97djepxt8g3e",
    "zil1ph7jkzpm8sp0g2pkxsvfvnd9806djpptfutf2n",
  ];

  for (var i = 0; i < dataZil.length; i++) {

    if (dataZil[i] === "zil1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9yf6pz") {
      continue;
    }
    else {
      var smartContractState = await zilliqa.blockchain.getSmartContractState(dataZil[i].toLowerCase())
      cache[dataZil[i]] = smartContractState.result.balances;
    }
  }
}

zilliqaBalance();

setInterval(zilliqaBalance, 100000);


app.get("/api/balanceZil", (req, res, next) => {
  if (!req.query.account) {
    res.status(401).send({ err: "missing param account" });
    return;
  }
  var address = req.query.account.toLowerCase();

  var token = req.query.token;
  if (!req.query.token) {
    res.status(401).send({ err: "missing param token" });
    return;
  }
  if (!cache[token]) {
    res.status(401).send({ err: "missing invalid token" });
    return;
  }
  var value = cache[token][address];
  if (!value) value = 0
  res.send({ result: value });
});







module.exports = _publics;
