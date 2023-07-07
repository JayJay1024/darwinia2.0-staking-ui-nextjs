"use client";

import { ChainID, UrlParamsKey, StoreKey } from "@/types";
import { PropsWithChildren, createContext, useCallback, useEffect, useState } from "react";

interface AppCtx {
  activeChain: ChainID;
  setActiveChain: (chainId: ChainID) => void;
}

export const AppContext = createContext<AppCtx>({ activeChain: ChainID.DARWINIA, setActiveChain: () => undefined });

export function AppProvider({ children }: PropsWithChildren<unknown>) {
  const [activeChain, _setActiveChain] = useState<AppCtx["activeChain"]>(ChainID.DARWINIA);

  const setActiveChain = useCallback((chainId: ChainID) => {
    _setActiveChain(chainId);
    localStorage.setItem(StoreKey.ACTIVE_CHAIN, chainId.toString());
  }, []);

  useEffect(() => {
    const urlChain = new URLSearchParams(window.location.search).get(UrlParamsKey.NETWORK);
    if (urlChain) {
      for (const chainId of Object.values(ChainID)) {
        if (urlChain === chainId.toString()) {
          _setActiveChain(chainId as ChainID);
          localStorage.setItem(StoreKey.ACTIVE_CHAIN, chainId.toString());
        }
      }
    }
  }, []);

  return <AppContext.Provider value={{ activeChain, setActiveChain }}>{children}</AppContext.Provider>;
}
