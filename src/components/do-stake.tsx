import { getChainConfig, stakingToPower } from "@/utils";
import ActiveDepositSelector from "./active-deposit-selector";
import CollatorSelector from "./collator-selector";
import BalanceInput, { ExtraPower } from "./balance-input";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useApp, useStaking } from "@/hooks";
import { useAccount, useBalance } from "wagmi";

export default function DoStake() {
  const { deposits, ringPool, ktonPool, nominatorCollators } = useStaking();
  const [delegateCollator, setDelegateCollator] = useState<string | undefined>(undefined);
  const [delegateRing, setDelegateRing] = useState(0n);
  const [delegateKton, setDelegateKton] = useState(0n);
  const [delegateDeposits, setDelegateDeposits] = useState<number[]>([]);

  const { activeChain } = useApp();
  const { nativeToken, ktonToken } = getChainConfig(activeChain);

  const { address } = useAccount();
  const { data: ringBalance } = useBalance({ address, watch: true });
  const { data: ktonBalance } = useBalance({ address, watch: true, token: ktonToken?.address });

  const calcExtraPower = useCallback(
    (stakingRing: bigint, stakingKton: bigint) =>
      stakingToPower(stakingRing, stakingKton, ringPool + stakingRing, ktonPool + stakingKton) -
      stakingToPower(0n, 0n, ringPool, ktonPool),
    [ringPool, ktonPool]
  );

  const ringExtraPower = useMemo(() => calcExtraPower(delegateRing, 0n), [delegateRing, calcExtraPower]);
  const ktonExtraPower = useMemo(() => calcExtraPower(0n, delegateKton), [delegateKton, calcExtraPower]);
  const depositsExtraPower = useMemo(
    () =>
      calcExtraPower(
        deposits.filter(({ id }) => delegateDeposits.includes(id)).reduce((acc, cur) => acc + cur.value, 0n),
        0n
      ),
    [delegateDeposits, deposits, calcExtraPower]
  );

  useEffect(() => {
    if (address && nominatorCollators[address]?.length) {
      setDelegateCollator((prev) => prev ?? nominatorCollators[address]?.at(0));
    }
  }, [address, nominatorCollators]);

  return (
    <div className="flex flex-col gap-middle bg-component p-5">
      <h5 className="text-sm font-bold text-white">Delegate</h5>
      <span className="text-xs font-light text-white/50">
        Note that it takes 1 Session(~24 hours) to get rewards if your collator get elected. The delegation locks your
        tokens, and You need to unbond in order for your staked tokens to be transferrable again, which takes ~14 days.
      </span>

      <div className="h-[1px] bg-white/20" />

      {/* collator */}
      <CollatorSelector collator={delegateCollator} onSelect={setDelegateCollator} />

      <div className="flex flex-col gap-middle lg:flex-row">
        {/* ring */}
        <BalanceInput
          balance={ringBalance?.value || 0n}
          symbol={nativeToken.symbol}
          logoPath={nativeToken.logoPath}
          decimals={nativeToken.decimals}
          power={ringExtraPower}
          className="lg:flex-1"
          onChange={setDelegateRing}
          isReset={delegateRing <= 0}
        />

        {/* kton */}
        {ktonToken && (
          <>
            <BalanceInput
              balance={ktonBalance?.value || 0n}
              symbol={ktonToken.symbol}
              logoPath={ktonToken.logoPath}
              decimals={ktonToken.decimals}
              power={ktonExtraPower}
              className="lg:flex-1"
              onChange={setDelegateKton}
              isReset={delegateKton <= 0}
            />
          </>
        )}

        {/* active deposit */}
        <div className="flex flex-col gap-middle lg:flex-1">
          <ActiveDepositSelector checkedDeposits={delegateDeposits} onChange={setDelegateDeposits} />
          <ExtraPower power={depositsExtraPower} />
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
