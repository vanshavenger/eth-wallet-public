import { http, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { metaMask, injected, coinbaseWallet } from "wagmi/connectors";

export const config = createConfig({
  chains: [mainnet],
  connectors: [metaMask(), injected(), coinbaseWallet()],
  transports: {
    [mainnet.id]: http(),
  },
});
