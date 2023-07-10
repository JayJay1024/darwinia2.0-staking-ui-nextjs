import { ChainID } from "@/types";
import { getChainConfig } from "@/utils";
import Image from "next/image";
import ActiveDeposit from "./active-deposit";
import CollatorSelector from "./collator-selector";

const { nativeToken, ktonToken } = getChainConfig(ChainID.DARWINIA);

export default function Delegate() {
  return (
    <div className="p-5 bg-component flex flex-col gap-middle">
      <h5 className="text-sm font-bold text-white">Delegate</h5>
      <span className="text-xs font-light text-white/50">
        Note that it takes 1 Session(~24 hours) to get rewards if your collator get elected. The delegation locks your
        tokens, and You need to unbond in order for your staked tokens to be transferrable again, which takes ~14 days.
      </span>

      <div className="h-[1px] bg-white/20" />

      {/* collator */}
      <CollatorSelector />

      {/* ring */}
      <BalanceInput symbol={nativeToken.symbol} logoPath={nativeToken.logoPath} />
      <ExtraPower />

      {/* kton */}
      {ktonToken && (
        <>
          <BalanceInput symbol={ktonToken.symbol} logoPath={ktonToken.logoPath} />
          <ExtraPower />
        </>
      )}

      {/* active deposit */}
      <ActiveDeposit />
      <ExtraPower />

      <div className="h-[1px] bg-white/20" />

      <button
        disabled
        className="px-large py-middle bg-primary transition-opacity hover:opacity-80 active:opacity-60 disabled:opacity-80 disabled:cursor-not-allowed text-xs font-bold text-white"
      >
        Stake
      </button>
    </div>
  );
}

function BalanceInput({ symbol, logoPath }: { symbol: string; logoPath: string }) {
  return (
    <div className="flex items-center justify-between gap-middle border border-white p-middle">
      <input
        type="string"
        placeholder="Balance: 18,422.4"
        className="bg-transparent text-sm font-light focus-visible:outline-none w-[72%]"
      />
      <div className="flex items-center gap-middle">
        <Image alt={symbol} width={20} height={20} src={logoPath} />
        <span className="text-sm font-light text-white">{symbol}</span>
      </div>
    </div>
  );
}

function ExtraPower() {
  return <span className="text-primary text-xs font-bold">+0 Power</span>;
}
