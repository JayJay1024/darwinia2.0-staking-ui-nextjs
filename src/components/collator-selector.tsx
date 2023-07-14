import { useAccount } from "wagmi";
import Jazzicon from "./jazzicon";
import Image from "next/image";
import CollatorSelectModal from "./collator-select-modal";
import { useState } from "react";

export default function CollatorSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { address } = useAccount();

  return (
    <>
      {address ? (
        <div className="flex items-center gap-middle border border-primary px-large py-middle transition-opacity">
          <Jazzicon address={address} size={30} />
          <div className="flex min-w-0 flex-col gap-small">
            <span className="text-sm font-bold text-white">darwinia</span>
            <span className="break-words text-xs font-light text-white">{address}</span>
          </div>
          <button
            className="shrink-0 transition-transform hover:scale-105 active:scale-95"
            onClick={() => setIsOpen(true)}
          >
            <Image alt="Switch collator" src="/images/switch.svg" width={24} height={24} />
          </button>
        </div>
      ) : (
        <button
          className="border border-primary py-middle text-sm font-bold text-white transition-opacity hover:opacity-80 active:opacity-60"
          onClick={() => setIsOpen(true)}
        >
          Select a collator
        </button>
      )}

      <CollatorSelectModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
