import { ChainID } from "@/types";
import { getChainConfig } from "@/utils";
import BalanceInput from "./balance-input";
import DepositTermSelector from "./deposit-term-selector";
import { parseEther } from "viem";
import InputLabel from "./input-label";

const { nativeToken } = getChainConfig(ChainID.DARWINIA);

export default function TermDeposit() {
  return (
    <div className="flex flex-col gap-middle bg-component p-5">
      <h5 className="text-sm font-bold text-white">Term Deposit</h5>
      <span className="text-xs font-light text-white/50">
        Deposit RING for a fixed term and earn KTON, and the RING in deposit can used in Staking as Well. Note that if
        you withdraw the funds before the term ends, you have to pay 3 times the reward as a penalty.
      </span>

      <div className="h-[1px] bg-white/20" />

      {/* amount */}
      <BalanceInput
        label="Amount"
        balance={parseEther("1234.8763")}
        symbol={nativeToken.symbol}
        decimals={nativeToken.decimals}
        logoPath={nativeToken.logoPath}
      />

      {/* deposit term */}
      <InputLabel label="Deposit term" />
      <DepositTermSelector />

      {/* reward */}
      <InputLabel label="Reward you'll receive" />
      <div className="flex h-10 items-center justify-between bg-primary px-middle">
        <span className="text-sm font-bold text-white">7.614213</span>
        <span className="text-sm font-bold text-white">KTON</span>
      </div>

      <div className="h-[1px] bg-white/20" />

      <button
        disabled
        className="bg-primary px-large py-middle text-sm font-bold text-white transition-opacity hover:opacity-80 active:opacity-60 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Deposit
      </button>
    </div>
  );
}
