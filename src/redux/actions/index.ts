export const setNetworkId = (networkId: number) => ({
  type: "SET_NETWORDK_ID",
  networkId,
});
export const setAccount = (account: string) => ({
  type: "SET_ACCOUNT",
  account,
});
export const setScanLink = (link: any) => ({
  type: "SET_LINK",
  link,
});
export const setBalances = (balances: any) => ({
  type: "SET_BALANCE",
  balances,
});
/*export const setWeb3 = (web3: any) => ({
  type: "SET_WEB3",
  web3
});*/
export const setConnectionWeb3Account = (accountAndWeb3: any) => ({
  type: "SET_WEB_ACCOUNT",
  accountAndWeb3,
});
export const setJeton = (jeton: any) => ({
  type: "SET_JETON",
  jeton,
});
export const setPairs = (pairs: any) => ({
  type: "SET_PAIRS",
  pairs,
});
