

var mysql = require('mysql');



module.exports = {
  port: process.env.PORT || 3005,
  env: process.env.NODE_ENV || 'development',

  // Initialize pool
  pool: mysql.createPool({
    connectionLimit: 100,
    //host     : 'http://3.134.116.167',
    host: 'localhost',
    port: 3306,
    user: 'root',
   // password: 'sqoin123456',
   password : "wqtqVSROVpdhilqI00",
    //password: "tbEsNGfMcF8Htt7n",
    database: 'nova',
    debug: false,
    dateStrings: true
  }),

  data: [
    "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
    "0xCF659cd50BAd6fb3943579f5521847D5a2462709",
    "0x7854A93b9c2cfc8ab2304DBd10D9A67d51ec444A",
    "0x88DfC107390E043Ad5b46c3Efb98C0F30061F8e6",
    "0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD",
    "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa",
    "0xeDe35e989B0357b20DD5Ff981750Ca7702117A8e"],
  dataZil : [ {
    "BARTER": "zil17zvlqn2xamqpumlm2pgul9nezzd3ydmrufxnct",
    "BOLT": "zil1x6z064fkssmef222gkhz3u5fhx57kyssn7vlu0",
    "CARB" : "zil1hau7z6rjltvjc95pphwj57umdpvv0d6kh2t8zk",
    "KKZ" : "zil1p2cp77kz06wlxeyha4psawencm5gx8ttcwsxdn",
    "PORT": "zil18f5rlhqz9vndw4w8p60d0n7vg3n9sqvta7n6t2",
    "RedC": "zil1a5wkhunysdp9x0nww5qe6m2m8x2m3ygdpuu257",
    "SERGS": "zil1ztmv5jhfpnxu95ts9ylup7hj73n5ka744jm4ea",
    "SHRK" : "zil17tsmlqgnzlfxsq4evm6n26txm2xlp5hele0kew",
   "XSGD": "zil1zu72vac254htqpg3mtywdcfm84l3dfd9qzww8t",
    "ZIL": "zil1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9yf6pz",
    "ZLF": "zil1r9dcsrya4ynuxnzaznu00e6hh3kpt7vhvzgva0",
    "ZLP": "zil1l0g8u6f9g0fsvjuu74ctyla2hltefrdyt7k5f4",
    "ZWAP": "zil1p5suryq6q647usxczale29cu3336hhp376c627",
    "ZYF": "zil1arrjugcg28rw8g9zxpa6qffc6wekpwk2alu7kj",
    "ZYRO": "zil1ucvrn22x8366vzpw5t7su6eyml2auczu6wnqqg",
    "gZIL" : "zil14pzuzq6v6pmmmrfjhczywguu0e97djepxt8g3e",
    "zFred": "zil1ph7jkzpm8sp0g2pkxsvfvnd9806djpptfutf2n",
  }
  ]

};

