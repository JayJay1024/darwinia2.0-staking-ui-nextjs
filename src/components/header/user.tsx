"use client";

import { useState, FC, ButtonHTMLAttributes } from "react";
import { useAccount, useDisconnect } from "wagmi";
import Identicon from "@polkadot/react-identicon";
import Button from "./button";
import Image from "next/image";
import { toShortAdrress } from "@/utils";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Popper from "./popper";

export default function User() {
  const [isOpen, setIsOpen] = useState(false);

  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();

  return address ? (
    <>
      <Popper
        className="border border-primary p-large flex flex-col items-start gap-middle z-10 bg-app-black"
        label={
          <>
            <Identicon value={address} theme="ethereum" size={24} className="identicon" />
            <span className="text-sm font-light uppercase">{toShortAdrress(address)}</span>
            <Image
              src="/images/caret-down.svg"
              alt="Account profiles icon"
              width={16}
              height={16}
              className="transition-transform duration-300 translate-y-3"
              style={{ transform: isOpen ? "rotateX(180deg)" : "rotateX(0)" }}
            />
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

const ActionButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...rest }) => (
  <button
    {...rest}
    className="text-sm font-light text-white hover:opacity-80 active:opacity-60 disabled:opacity-100 disabled:text-white/50 disabled:cursor-not-allowed"
  >
    {children}
  </button>
);
