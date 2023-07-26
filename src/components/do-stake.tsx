import { ChainID } from "@/types";
import { getChainConfig } from "@/utils";
import ActiveDepositSelector from "./active-deposit-selector";
import CollatorSelector from "./collator-selector";
import BalanceInput, { ExtraPower } from "./balance-input";
import { parseEther } from "viem";

const { nativeToken, ktonToken } = getChainConfig(ChainID.DARWINIA);

export default function DoStake() {
  return (
    <div className="flex flex-col gap-middle bg-component p-5">
      <h5 className="text-sm font-bold text-white">Delegate</h5>
      <span className="text-xs font-light text-white/50">
        Note that it takes 1 Session(~24 hours) to get rewards if your collator get elected. The delegation locks your
        tokens, and You need to unbond in order for your staked tokens to be transferrable again, which takes ~14 days.
      </span>

      <div className="h-[1px] bg-white/20" />

      {/* collator */}
      <CollatorSelector />

      <div className="flex flex-col gap-middle lg:flex-row">
        {/* ring */}
        <BalanceInput
          balance={parseEther("1876.6354")}
          symbol={nativeToken.symbol}
          logoPath={nativeToken.logoPath}
          decimals={nativeToken.decimals}
          power={0n}
          className="lg:flex-1"
        />

        {/* kton */}
        {ktonToken && (
          <>
            <BalanceInput
              balance={parseEther("1876.6354")}
              symbol={ktonToken.symbol}
              logoPath={ktonToken.logoPath}
              decimals={ktonToken.decimals}
              power={0n}
              className="lg:flex-1"
            />
          </>
        )}

        {/* active deposit */}
        <div className="flex flex-col gap-middle lg:flex-1">
          <ActiveDepositSelector />
          <ExtraPower power={0n} />
        </div>
      </div>

      <div className="h-[1px] bg-white/20" />

      <button
        disabled
        className="bg-primary px-large py-middle text-sm font-bold text-white transition-opacity hover:opacity-80 active:opacity-60 disabled:cursor-not-allowed disabled:opacity-60 lg:w-40"
      >
        Stake
      </button>
    </div>
  );
}
