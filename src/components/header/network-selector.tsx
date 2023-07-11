"use client";

import { useApp } from "@/hooks";
import Selector from "../selector";
import { getChainConfig, getChainConfigs } from "@/utils";
import { useState } from "react";
import ActionButton from "./action-button";

const chainConfigs = getChainConfigs();

export default function NetworkSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { activeChain, setActiveChain } = useApp();

  const chainConfig = getChainConfig(activeChain);

  return (
    <Selector
      label={<span className="text-sm font-light">{chainConfig.name}</span>}
      menuClassName="border border-primary p-large flex flex-col items-start gap-large bg-app-black"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      {chainConfigs.map(({ name, chainId }) => (
        <ActionButton
          key={chainId}
          disabled={chainId === activeChain}
          onClick={() => {
            setActiveChain(chainId);
            setIsOpen(false);
          }}
        >
          {name}
        </ActionButton>
      ))}
    </Selector>
  );
}
