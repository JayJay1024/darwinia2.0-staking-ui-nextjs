import { ChainID } from "@/types";
import { getChainConfig } from "@/utils";
import BalanceInput from "./balance-input";
import DepositTermSelector from "./deposit-term-selector";

const { nativeToken } = getChainConfig(ChainID.DARWINIA);

export default function TermDeposit() {
  return (
    <div className="p-5 bg-component flex flex-col gap-middle">
      <h5 className="text-sm font-bold text-white">Term Deposit</h5>
      <span className="text-xs font-light text-white/50">
        Deposit RING for a fixed term and earn KTON, and the RING in deposit can used in Staking as Well. Note that if
        you withdraw the funds before the term ends, you have to pay 3 times the reward as a penalty.
      </span>

      <div className="h-[1px] bg-white/20" />

      {/* amount */}
      <Label text="Amount" />
      <BalanceInput symbol={nativeToken.symbol} logoPath={nativeToken.logoPath} />

      {/* deposit term */}
      <Label text="Deposit term" />
      <DepositTermSelector />

      {/* reward */}
      <Label text="Reward you'll receive" />
      <div className="bg-primary flex items-center justify-between h-10 px-middle">
        <span className="text-sm font-bold text-white">7.614213</span>
        <span className="text-sm font-bold text-white">KTON</span>
      </div>

      <div className="h-[1px] bg-white/20" />

      <button
        disabled
        className="px-large py-middle bg-primary transition-opacity hover:opacity-80 active:opacity-60 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-bold text-white"
      >
        Deposit
      </button>
    </div>
  );
}

function Label({ text }: { text: string }) {
  return <span className="text-xs font-light text-white">{text}</span>;
}
