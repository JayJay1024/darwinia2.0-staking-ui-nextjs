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
  deposits: Deposit[];
  power: bigint;
  ringPool: bigint;
  ktonPool: bigint;
  stakedRing: bigint;
  stakedKton: bigint;
  totalOfDepositsInStaking: bigint;
}

const defaultValue: StakingCtx = {
  deposits: [],
  power: 0n,
  ringPool: 0n,
  ktonPool: 0n,
  stakedRing: 0n,
  stakedKton: 0n,
  totalOfDepositsInStaking: 0n,
};

export const StakingContext = createContext(defaultValue);

export function StakingProvider({ children }: PropsWithChildren<unknown>) {
  const [deposits, setDeposits] = useState(defaultValue.deposits);
  const [ringPool, setRingPool] = useState(defaultValue.ringPool);
  const [ktonPool, setKtonPool] = useState(defaultValue.ktonPool);
  const [stakedRing, setStakedRing] = useState(defaultValue.stakedRing);
  const [stakedKton, setStakedKton] = useState(defaultValue.stakedKton);
  const [totalOfDepositsInStaking, setTotalOfDepositsInStaking] = useState(defaultValue.totalOfDepositsInStaking);

  const { address } = useAccount();
  const { polkadotApi } = useApi();
  const { blockTimestamp } = useBlock();

  const power = useMemo(
    () => stakingToPower(stakedRing + totalOfDepositsInStaking, stakedKton, ringPool, ktonPool),
    [stakedRing, stakedKton, ringPool, ktonPool, totalOfDepositsInStaking]
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

            setTotalOfDepositsInStaking(
              deposits
                .filter(({ id }) => ledgerData.stakedDeposits?.includes(id))
                .reduce((acc, cur) => acc + cur.value, 0n)
            );

            setStakedRing(BigInt(ledgerData.stakedRing));
            setStakedKton(BigInt(ledgerData.stakedKton));
          } else {
            setTotalOfDepositsInStaking(0n);
            setStakedRing(0n);
            setStakedKton(0n);
          }
        },
        error: console.error,
      });
    } else {
      setTotalOfDepositsInStaking(0n);
      setStakedRing(0n);
      setStakedKton(0n);
    }

    return () => sub$$?.unsubscribe();
  }, [address, deposits, polkadotApi]);

  return (
    <StakingContext.Provider
      value={{ power, deposits, ringPool, ktonPool, stakedRing, stakedKton, totalOfDepositsInStaking }}
    >
      {children}
    </StakingContext.Provider>
  );
}
