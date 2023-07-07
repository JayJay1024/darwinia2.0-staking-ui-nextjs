"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider, connectorsForWallets } from "@rainbow-me/rainbowkit";
import { argentWallet, trustWallet, ledgerWallet, imTokenWallet, okxWallet } from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

import { APP_NAME_CONF } from "@/config";
import { getChainConfigs } from "@/utils";
import { PropsWithChildren, useEffect, useState } from "react";
import { useApp } from "@/hooks";

const { chains, publicClient } = configureChains(
  getChainConfigs().map(({ chainId, name, nativeToken, rpcMetas, explorer }) => ({
    id: chainId,
    name,
    network: name.toLowerCase().split(" ").join("-"),
    nativeCurrency: {
      name: nativeToken.symbol,
      symbol: nativeToken.symbol,
      decimals: nativeToken.decimals,
    },
    rpcUrls: {
      default: {
        http: rpcMetas.at(0)?.url.startsWith("http") ? [rpcMetas[0].url] : [],
        webSocket: rpcMetas.at(0)?.url.startsWith("ws") ? [rpcMetas[0].url] : [],
      },
      public: {
        http: rpcMetas.at(0)?.url.startsWith("http") ? [rpcMetas[0].url] : [],
        webSocket: rpcMetas.at(0)?.url.startsWith("ws") ? [rpcMetas[0].url] : [],
      },
    },
    blockExplorers: {
      default: {
        url: explorer.url,
        name: explorer.name,
      },
    },
  })),
  [publicProvider()]
);

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID || "";

const { wallets } = getDefaultWallets({
  appName: APP_NAME_CONF,
  projectId,
  chains,
});

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "More",
    wallets: [
      argentWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
      imTokenWallet({ projectId, chains }),
      okxWallet({ projectId, chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export function RainbowProvider({ children }: PropsWithChildren<unknown>) {
  const [mounted, setMounted] = useState(true); // temporarity set to true
  const { activeChain } = useApp();

  useEffect(() => setMounted(true), []);

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} appInfo={{ appName: APP_NAME_CONF }} initialChain={activeChain}>
        {mounted && children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
