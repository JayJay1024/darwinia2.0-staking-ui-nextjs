import { useAccount } from "wagmi";
import Jazzicon from "./jazzicon";
import Image from "next/image";

export default function CollatorSelector() {
  const { address } = useAccount();
  return address ? (
    <div className="px-large py-middle flex items-center gap-middle transition-opacity border border-primary">
      <Jazzicon address={address} size={30} />
      <div className="flex flex-col gap-small min-w-0">
        <span className="text-sm font-bold text-white">darwinia</span>
        <span className="text-xs font-light text-white break-words">{address}</span>
      </div>
      <button className="shrink-0 transition-transform hover:scale-105 active:scale-95">
        <Image alt="Switch collator" src="/images/switch.svg" width={24} height={24} />
      </button>
    </div>
  ) : (
    <button className="text-sm font-bold text-white py-middle border border-primary transition-opacity hover:opacity-80 active:opacity-60">
      Select a collator
    </button>
  );
}
