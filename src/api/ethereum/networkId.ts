import Web3 from "web3"
import store from "../../redux/store";
import { setNetworkId, setBalances } from '../../redux/actions'
export function subscribeToNetIdImpl(
    web3: Web3,
    callback: (error: Error | null, netId: number | null) => any
  ) {
    const id = setInterval(async () => {
      try {
        const netId = await web3.eth.net.getId();
        store.dispatch(setNetworkId(netId));
        callback(null, netId);
      } catch (error) {
        callback(error, null);
      }
    }, 1000);
  
    return () => {
      clearInterval(id);
    };
  }