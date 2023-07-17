"use client";

import { ChainID, UrlParamsKey, StoreKey, RpcMeta } from "@/types";
import { getChainConfig } from "@/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Dispatch, PropsWithChildren, SetStateAction, createContext, useCallback, useEffect, useState } from "react";

interface AppCtx {
  activeChain: ChainID;
  setActiveChain: (chainId: ChainID) => void;
  activeRpc: RpcMeta;
  setActiveRpc: Dispatch<SetStateAction<RpcMeta>>;
}

export const AppContext = createContext<AppCtx>({
  activeChain: ChainID.DARWINIA,
  setActiveChain: () => undefined,
  activeRpc: { url: "" },
  setActiveRpc: () => undefined,
});

export function AppProvider({ children }: PropsWithChildren<unknown>) {
  const [activeChain, _setActiveChain] = useState<AppCtx["activeChain"]>(ChainID.DARWINIA);
  const [activeRpc, _setActiveRpc] = useState<AppCtx["activeRpc"]>({ url: "" });

  const searchParams = useSearchParams();
  const router = useRouter();

  const setActiveChain = useCallback((chainId: ChainID) => {
    _setActiveChain(chainId);
    localStorage.setItem(StoreKey.ACTIVE_CHAIN, chainId.toString());
  }, []);

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
    let initChain = ChainID.DARWINIA;

    if (urlChain) {
      for (const chainId of Object.values(ChainID)) {
        if (urlChain === chainId.toString()) {
          initChain = chainId as ChainID;
        }
      }
    }
    _setActiveChain(initChain);
    localStorage.setItem(StoreKey.ACTIVE_CHAIN, initChain.toString());

    if (urlRpc) {
      setActiveRpc({ url: decodeURIComponent(urlRpc) });
    } else {
      setActiveRpc(getChainConfig(initChain).rpcMetas.at(0) || { url: "" });
    }
  }, []);

  return (
    <AppContext.Provider value={{ activeChain, setActiveChain, activeRpc, setActiveRpc }}>
      {children}
    </AppContext.Provider>
  );
}
