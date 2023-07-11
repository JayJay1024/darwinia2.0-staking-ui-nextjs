import { ChainID } from "@/types";
import { getChainConfig } from "@/utils";
import ActiveDeposit from "./active-deposit";
import CollatorSelector from "./collator-selector";
import BalanceInput from "./balance-input";

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
        className="px-large py-middle bg-primary transition-opacity hover:opacity-80 active:opacity-60 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-bold text-white"
      >
        Stake
      </button>
    </div>
  );
}

function ExtraPower() {
  return <span className="text-primary text-xs font-bold">+0 Power</span>;
}
