import { coinbaseWallet } from "wagmi/connectors";
import { base } from "wagmi/chains";
import { createConfig } from "wagmi";
import { http } from "viem";

export function getConfig() {
  return createConfig({
    chains: [base],
    connectors: [coinbaseWallet({
      appName: "Based Cart",
    })],
    transports: {
      [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
    },
  });
};