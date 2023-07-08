"use client";

import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import Button from "./button";
import { toShortAdrress } from "@/utils";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Popper from "./popper";
import ActionButton from "./action-button";
import Jazzicon from "../jazzicon";

export default function User() {
  const [isOpen, setIsOpen] = useState(false);

  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();

  return address ? (
    <>
      <Popper
        className="border border-primary p-large flex flex-col items-start gap-large bg-app-black"
        label={
          <>
            <Jazzicon size={24} address={address} />
            <span className="text-sm font-light uppercase">{toShortAdrress(address)}</span>
          </>
        }
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <ActionButton onClick={() => setIsOpen(false)}>Join Collator</ActionButton>
        <ActionButton onClick={() => setIsOpen(false)} disabled>
          Manage Collator
        </ActionButton>
        <ActionButton
          onClick={() => {
            setIsOpen(false);
            disconnect();
          }}
        >
          Disconnect
        </ActionButton>
      </Popper>
    </>
  ) : (
    <Button className="capitalize" onClick={() => openConnectModal && openConnectModal()}>
      Connect Wallet
    </Button>
  );
}