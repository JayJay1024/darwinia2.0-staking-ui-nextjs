"use client";

import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { toShortAdrress } from "@/utils";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Selector, { Button } from "../selector";
import ActionButton from "./action-button";
import Jazzicon from "../jazzicon";
import JoinCollatorModal from "../join-collator-modal";

export default function User() {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isJoinCollatorModalOpen, setIsJoinCollatorModalOpen] = useState(false);
  const [isManageCollatorModalOpen, setIsManageCollatorModalOpen] = useState(false);

  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();

  return address ? (
    <>
      <Selector
        menuClassName="border border-primary p-large flex flex-col items-start gap-large bg-app-black"
        label={
          <>
            <Jazzicon size={24} address={address} />
            <span className="text-sm font-light uppercase">{toShortAdrress(address)}</span>
          </>
        }
        isOpen={isSelectorOpen}
        setIsOpen={setIsSelectorOpen}
      >
        <ActionButton
          onClick={() => {
            setIsSelectorOpen(false);
            setIsJoinCollatorModalOpen(true);
          }}
        >
          Join Collator
        </ActionButton>
        <ActionButton
          onClick={() => {
            setIsSelectorOpen(false);
            setIsManageCollatorModalOpen(true);
          }}
          disabled
        >
          Manage Collator
        </ActionButton>
        <ActionButton
          onClick={() => {
            setIsSelectorOpen(false);
            disconnect();
          }}
        >
          Disconnect
        </ActionButton>
      </Selector>

      <JoinCollatorModal isOpen={isJoinCollatorModalOpen} onClose={() => setIsJoinCollatorModalOpen(false)} />
    </>
  ) : (
    <Button className="capitalize" onClick={() => openConnectModal && openConnectModal()}>
      Connect Wallet
    </Button>
  );
}
