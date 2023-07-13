import { Key, useEffect, useState } from "react";
import Selector from "./selector";
import { parseEther } from "viem";
import CheckboxGroup from "./checkbox-group";
import { formatBlanace, getChainConfig, prettyNumber } from "@/utils";
import { ChainID } from "@/types";

const { nativeToken } = getChainConfig(ChainID.CRAB);

export default function ActiveDepositSelector() {
  const [deposits, setDeposits] = useState<{ id: number; balance: bigint }[]>([]);
  const [checkedValues, setCheckedValues] = useState<Key[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setDeposits(
      new Array(20).fill(0).map((_, index) => ({ id: index + 100, balance: parseEther((index * 1762.354).toString()) }))
    );
  }, []);

  return (
    <Selector
      labelClassName="border-white px-middle"
      menuClassName="border border-white p-middle bg-app-black max-h-72 overflow-y-auto"
      label={
        checkedValues.length ? (
          <div className="inline-flex items-center gap-middle truncate">
            <span className="text-sm font-bold text-white">{`${checkedValues.length} Deposits Selected`}</span>
            <span className="truncate text-xs font-bold text-white/50">{`+${prettyNumber(
              checkedValues.length * 1298834
            )} Power`}</span>
          </div>
        ) : (
          <span className="text-sm font-bold text-white">Use A Deposit</span>
        )
      }
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      {deposits.length ? (
        <CheckboxGroup
          options={deposits.map(({ id, balance }) => ({
            value: id,
            label: (
              <div key={id} className="flex w-full items-center justify-between">
                <span className="text-sm font-light text-white">{`ID#${id}`}</span>
                <span className="text-sm font-light text-white">{`${formatBlanace(balance, nativeToken.decimals, {
                  keepZero: false,
                })} ${nativeToken.symbol}`}</span>
              </div>
            ),
          }))}
          checkedValues={checkedValues}
          onChange={setCheckedValues}
        />
      ) : (
        <span className="text-sm font-normal text-white/50">No active deposit</span>
      )}
    </Selector>
  );
}
