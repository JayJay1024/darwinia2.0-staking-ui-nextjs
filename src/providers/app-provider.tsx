"use client";

import { ChainID, UrlParamsKey, StoreKey, RpcMeta } from "@/types";
import { getChainConfig, getChainConfigs } from "@/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { PropsWithChildren, createContext, useCallback, useEffect, useState } from "react";

const defaultChainConfig = getChainConfig(ChainID.DARWINIA);

interface AppCtx {
  activeChain: ChainID;
  setActiveChain: (chainId: ChainID) => void;
  activeRpc: RpcMeta;
  setActiveRpc: (rpcMeta: RpcMeta) => void;
}

export const AppContext = createContext<AppCtx>({
  activeChain: defaultChainConfig.chainId,
  setActiveChain: () => undefined,
  activeRpc: { url: "" },
  setActiveRpc: () => undefined,
});

export function AppProvider({ children }: PropsWithChildren<unknown>) {
  const [activeChain, _setActiveChain] = useState<AppCtx["activeChain"]>(defaultChainConfig.chainId);
  const [activeRpc, _setActiveRpc] = useState<AppCtx["activeRpc"]>(defaultChainConfig.rpcMetas[0]);

  const searchParams = useSearchParams();
  const router = useRouter();

  const setActiveChain = useCallback(
    (chainId: ChainID) => {
      _setActiveChain(chainId);
      localStorage.setItem(StoreKey.ACTIVE_CHAIN, chainId.toString());

      const chainConfig = getChainConfig(chainId);
      _setActiveRpc(chainConfig.rpcMetas[0]);

      const params = new URLSearchParams(searchParams.toString());
      params.set(UrlParamsKey.NETWORK, chainConfig.name);

      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  const setActiveRpc = useCallback(
    (rpcMeta: RpcMeta) => {
      _setActiveRpc(rpcMeta);

      const params = new URLSearchParams(searchParams.toString());
      params.set(UrlParamsKey.RPC, encodeURIComponent(rpcMeta.url));

      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const urlChain = urlSearchParams.get(UrlParamsKey.NETWORK);
    const urlRpc = urlSearchParams.get(UrlParamsKey.RPC);
    let initChain = defaultChainConfig;

    if (urlChain) {
      for (const chainConfig of getChainConfigs()) {
        if (urlChain === chainConfig.name) {
          initChain = chainConfig;
        }
      }
    }
    _setActiveChain(initChain.chainId);
    localStorage.setItem(StoreKey.ACTIVE_CHAIN, initChain.toString());

    if (urlRpc) {
      _setActiveRpc({ url: decodeURIComponent(urlRpc) });
    } else {
      _setActiveRpc(getChainConfig(initChain.chainId).rpcMetas.at(0) || { url: "" });
    }
  }, []);

  return (
    <AppContext.Provider value={{ activeChain, setActiveChain, activeRpc, setActiveRpc }}>
      {children}
    </AppContext.Provider>
  );
}
