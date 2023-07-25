import { calcKtonReward, formatBlanace, getChainConfig } from "@/utils";
import BalanceInput from "./balance-input";
import DepositTermSelector from "./deposit-term-selector";
import InputLabel from "./input-label";
import { useAccount, useBalance } from "wagmi";
import { useApp } from "@/hooks";
import { useState } from "react";

export default function TermDeposit() {
  const [depositRing, setDepositRing] = useState(0n);
  const [depositTerm, setDepositTerm] = useState(1);

  const { address } = useAccount();
  const { data: balanceData } = useBalance({ address });
  const { activeChain } = useApp();

  const { nativeToken, ktonToken } = getChainConfig(activeChain);

  return (
    <div className="flex flex-col gap-middle bg-component p-5">
      <h5 className="text-sm font-bold text-white">Term Deposit</h5>
      <span className="text-xs font-light text-white/50">
        Deposit RING for a fixed term and earn KTON, and the RING in deposit can used in Staking as Well. Note that if
        you withdraw the funds before the term ends, you have to pay 3 times the reward as a penalty.
      </span>

      <div className="h-[1px] bg-white/20" />

      <div className="flex flex-col gap-middle lg:flex-row">
        {/* amount */}
        <BalanceInput
          label="Amount"
          balance={balanceData?.value || 0n}
          symbol={nativeToken.symbol}
          decimals={nativeToken.decimals}
          logoPath={nativeToken.logoPath}
          className="lg:flex-1"
          onChange={setDepositRing}
        />

        {/* deposit term */}
        <div className="flex flex-col gap-middle lg:flex-1">
          <InputLabel label="Deposit term" />
          <DepositTermSelector activeTerm={depositTerm} onChange={setDepositTerm} />
        </div>

        {/* reward */}
        <div className="flex flex-col gap-middle lg:flex-1">
          <InputLabel label="Reward you'll receive" />
          <div className="flex h-10 items-center justify-between bg-primary px-middle">
            <span className="text-sm font-bold text-white">
              {formatBlanace(calcKtonReward(depositRing, depositTerm), ktonToken?.decimals, { precision: 4 })}
            </span>
            <span className="text-sm font-bold text-white">{ktonToken?.symbol}</span>
          </div>
        </div>
      </div>

      <div className="h-[1px] bg-white/20" />

      <button
        disabled={!(depositRing > 0)}
        className="bg-primary px-large py-middle text-sm font-bold text-white transition-opacity hover:opacity-80 active:opacity-60 disabled:cursor-not-allowed disabled:opacity-60 lg:w-40"
      >
        Deposit
      </button>
    </div>
  );
}
