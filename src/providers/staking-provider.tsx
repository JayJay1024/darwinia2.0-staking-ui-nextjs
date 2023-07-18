"use client";

import { useApi, useBlock } from "@/hooks";
import { calcKtonReward, calcMonths, stakingToPower } from "@/utils";
import { PropsWithChildren, createContext, useEffect, useMemo, useState } from "react";
import type { Balance } from "@polkadot/types/interfaces";
import type { Option, Vec } from "@polkadot/types";
import { useAccount } from "wagmi";
import { Subscription, from } from "rxjs";
import type { DarwiniaStakingLedger, Deposit, DepositCodec } from "@/types";

interface StakingCtx {
  power: bigint;
  ringPool: bigint;
  ktonPool: bigint;
  stakingRing: bigint;
  stakingKton: bigint;
}

const defaultValue: StakingCtx = {
  power: 0n,
  ringPool: 0n,
  ktonPool: 0n,
  stakingRing: 0n,
  stakingKton: 0n,
};

export const StakingContext = createContext(defaultValue);

export function StakingProvider({ children }: PropsWithChildren<unknown>) {
  const [ringPool, setRingPool] = useState(defaultValue.ringPool);
  const [ktonPool, setKtonPool] = useState(defaultValue.ktonPool);
  const [stakingRing, setStakingRing] = useState(defaultValue.stakingRing);
  const [stakingKton, setStakingKton] = useState(defaultValue.stakingKton);
  const [deposits, setDeposits] = useState<Deposit[]>([]);

  const { address } = useAccount();
  const { polkadotApi } = useApi();
  const { blockTimestamp } = useBlock();

  const power = useMemo(
    () => stakingToPower(stakingRing, stakingKton, ringPool, ktonPool),
    [stakingRing, stakingKton, ringPool, ktonPool]
  );

  // ring pool
  useEffect(() => {
    let unsub = () => undefined;

    polkadotApi?.query.darwiniaStaking
      .ringPool((value: Balance) => setRingPool(value.toBigInt()))
      .then((_unsub) => {
        unsub = _unsub as unknown as typeof unsub;
      })
      .catch(console.error);

    return () => unsub();
  }, [polkadotApi]);

  // kton pool
  useEffect(() => {
    let unsub = () => undefined;

    polkadotApi?.query.darwiniaStaking
      .ktonPool((value: Balance) => setKtonPool(value.toBigInt()))
      .then((_unsub) => {
        unsub = _unsub as unknown as typeof unsub;
      })
      .catch(console.error);

    return () => unsub();
  }, [polkadotApi]);

  // deposits (every block)
  useEffect(() => {
    let sub$$: Subscription | undefined;

    if (address && polkadotApi && blockTimestamp) {
      sub$$ = from(polkadotApi.query.deposit.deposits(address) as Promise<Option<Vec<DepositCodec>>>).subscribe({
        next: (depositsOpt) => {
          if (depositsOpt.isSome) {
            setDeposits(
              depositsOpt.unwrap().map((item) => {
                const startTime = item.startTime.toNumber();
                const expiredTime = item.expiredTime.toNumber();
                const depositRing = item.value.toBigInt();

                return {
                  id: item.id.toNumber(),
                  startTime,
                  accountId: address,
                  reward: calcKtonReward(depositRing, calcMonths(startTime, expiredTime)),
                  expiredTime,
                  value: depositRing,
                  canEarlyWithdraw: blockTimestamp < expiredTime,
                  inUse: item.inUse.isTrue,
                };
              })
            );
          } else {
            setDeposits([]);
          }
        },
        error: console.error,
      });
    } else {
      setDeposits([]);
    }

    return () => sub$$?.unsubscribe();
  }, [address, polkadotApi, blockTimestamp]);

  // ledgers
  useEffect(() => {
    let sub$$: Subscription | undefined;

    if (address && polkadotApi) {
      from(polkadotApi.query.darwiniaStaking.ledgers(address) as Promise<Option<DarwiniaStakingLedger>>).subscribe({
        next: (ledgerOpt) => {
          if (ledgerOpt.isSome) {
            const ledgerData = ledgerOpt.unwrap().toJSON() as unknown as DarwiniaStakingLedger;

            const totalOfDepositsInStaking = deposits
              .filter(({ id }) => ledgerData.stakedDeposits?.includes(id))
              .reduce((acc, cur) => acc + cur.value, 0n);

            setStakingRing(BigInt(ledgerData.stakedRing) + totalOfDepositsInStaking);
            setStakingKton(BigInt(ledgerData.stakedKton));
          } else {
            setStakingRing(0n);
            setStakingKton(0n);
          }
        },
        error: console.error,
      });
    } else {
      setStakingRing(0n);
      setStakingKton(0n);
    }

    return () => sub$$?.unsubscribe();
  }, [address, deposits, polkadotApi]);

  return (
    <StakingContext.Provider value={{ power, ringPool, ktonPool, stakingRing, stakingKton }}>
      {children}
    </StakingContext.Provider>
  );
}
