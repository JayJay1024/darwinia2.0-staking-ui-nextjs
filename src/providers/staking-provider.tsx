"use client";

import { useApi, useBlock } from "@/hooks";
import { calcKtonReward, calcMonths, stakingToPower } from "@/utils";
import { PropsWithChildren, createContext, useEffect, useMemo, useState } from "react";
import type { Balance } from "@polkadot/types/interfaces";
import type { Option, Vec, StorageKey } from "@polkadot/types";
import type { AnyTuple, Codec } from "@polkadot/types/types";
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
  activeCollators: string[];
  collatorCommission: { [collator: string]: string };
  collatorLastSessionBlocks: { [collator: string]: number };
  collatorNominators: {
    [collator: string]: {
      totalStakedPower: bigint;
      nominators: { address: string; stakedPower: bigint }[];
    };
  };
  nominatorCollators: { [nominator: string]: string[] };
}

const defaultValue: StakingCtx = {
  deposits: [],
  power: 0n,
  ringPool: 0n,
  ktonPool: 0n,
  stakedRing: 0n,
  stakedKton: 0n,
  totalOfDepositsInStaking: 0n,
  activeCollators: [],
  collatorCommission: {},
  collatorLastSessionBlocks: {},
  collatorNominators: {},
  nominatorCollators: {},
};

export const StakingContext = createContext(defaultValue);

export function StakingProvider({ children }: PropsWithChildren<unknown>) {
  const [deposits, setDeposits] = useState(defaultValue.deposits);
  const [ringPool, setRingPool] = useState(defaultValue.ringPool);
  const [ktonPool, setKtonPool] = useState(defaultValue.ktonPool);
  const [stakedRing, setStakedRing] = useState(defaultValue.stakedRing);
  const [stakedKton, setStakedKton] = useState(defaultValue.stakedKton);
  const [totalOfDepositsInStaking, setTotalOfDepositsInStaking] = useState(defaultValue.totalOfDepositsInStaking);
  const [activeCollators, setActiveCollators] = useState(defaultValue.activeCollators);
  const [collatorCommission, setCollatorCommission] = useState(defaultValue.collatorCommission);
  const [collatorLastSessionBlocks, setCollatorLastSessionBlocks] = useState(defaultValue.collatorLastSessionBlocks);
  const [collatorNominators, setCollatorNominators] = useState(defaultValue.collatorNominators);
  const [nominatorCollators, setNominatorCollators] = useState(defaultValue.nominatorCollators);

  const { address } = useAccount();
  const { polkadotApi } = useApi();
  const { blockTimestamp } = useBlock();

  const power = useMemo(
    () => stakingToPower(stakedRing + totalOfDepositsInStaking, stakedKton, ringPool, ktonPool),
    [stakedRing, stakedKton, ringPool, ktonPool, totalOfDepositsInStaking]
  );

  // active collators
  useEffect(() => {
    let unsub = () => undefined;

    polkadotApi?.query.session
      .validators((addresses: Codec) => {
        // these are the collators that are active in this session
        setActiveCollators(addresses.toJSON() as string[]);
      })
      .then((_unsub) => {
        unsub = _unsub as unknown as typeof unsub;
      })
      .catch(console.error);

    return () => unsub();
  }, [polkadotApi]);

  // collator commission
  useEffect(() => {
    let unsub = () => undefined;

    polkadotApi?.query.darwiniaStaking.collators
      .entries((entries: [StorageKey<AnyTuple>, Codec][]) => {
        setCollatorCommission(
          entries.reduce((acc, cur) => {
            const [key, result] = cur;
            const collator = key.args[0].toHuman() as string;
            const commission = `${result.toHuman()}`;
            return { ...acc, [collator]: commission };
          }, {})
        );
      })
      .then((_unsub) => {
        unsub = _unsub as unknown as typeof unsub;
      })
      .catch(console.error);

    return () => unsub();
  }, [polkadotApi]);

  // collator's nominators
  useEffect(() => {
    let unsub = () => undefined;

    polkadotApi?.query.darwiniaStaking.exposures
      .entries((entries: [StorageKey<AnyTuple>, Codec][]) => {
        setCollatorNominators(
          entries.reduce((acc, cur) => {
            const [key, result] = cur;
            const collator = key.args[0].toHuman() as string;
            const exposure = result.toJSON() as {
              total: number | string;
              nominators: { value: number | string; who: string }[];
            };
            return {
              ...acc,
              [collator]: {
                totalStakedPower: BigInt(exposure.total),
                nominators: exposure.nominators.map(({ value, who }) => ({ address: who, stakedPower: BigInt(value) })),
              },
            };
          }, {})
        );
      })
      .then((_unsub) => {
        unsub = _unsub as unknown as typeof unsub;
      })
      .catch(console.error);

    return () => unsub();
  }, [polkadotApi]);

  // collator last session blocks
  useEffect(() => {
    let unsub = () => undefined;

    polkadotApi?.query.darwiniaStaking
      .rewardPoints((points: Codec) => {
        const [_, collatorPoints] = points.toJSON() as [number, { [address: string]: number }]; // [totalPoint, { collator: collatorPoint }]
        const staticNumber = 20; // this staticNumber = 20 was given by the backend

        setCollatorLastSessionBlocks(
          Object.keys(collatorPoints).reduce((acc, cur) => {
            const collatorPoint = collatorPoints[cur];
            const blocks = collatorPoint / staticNumber;
            return { ...acc, [cur]: blocks };
          }, {})
        );
      })
      .then((_unsub) => {
        unsub = _unsub as unknown as typeof unsub;
      })
      .catch(console.error);

    return () => unsub();
  }, [polkadotApi]);

  // nominator's collator
  useEffect(() => {
    let unsub = () => undefined;

    polkadotApi?.query.darwiniaStaking.nominators
      .entries((entries: [StorageKey<AnyTuple>, Option<Codec>][]) => {
        setNominatorCollators(
          entries.reduce((acc, cur) => {
            const [key, result] = cur;
            const nominator = key.args[0].toHuman() as string;
            if (result.isSome) {
              const collator = result.unwrap().toHuman() as string;
              return { ...acc, [nominator]: [collator] };
            }
            return acc;
          }, {})
        );
      })
      .then((_unsub) => {
        unsub = _unsub as unknown as typeof unsub;
      })
      .catch(console.error);

    return () => unsub();
  }, [polkadotApi]);

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
      value={{
        power,
        deposits,
        ringPool,
        ktonPool,
        stakedRing,
        stakedKton,
        totalOfDepositsInStaking,
        activeCollators,
        collatorCommission,
        collatorLastSessionBlocks,
        collatorNominators,
        nominatorCollators,
      }}
    >
      {children}
    </StakingContext.Provider>
  );
}
