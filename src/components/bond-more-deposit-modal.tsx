import { Key, useEffect, useState } from "react";
import Modal from "./modal";
import CheckboxGroup from "./checkbox-group";
import { formatBlanace, getChainConfig } from "@/utils";
import { ChainID } from "@/types";
import { parseEther } from "viem";
import { ExtraPower } from "./balance-input";

const { nativeToken } = getChainConfig(ChainID.CRAB);

export default function BondMoreDepositModal({
  isOpen,
  onClose = () => undefined,
}: {
  isOpen: boolean;
  onClose?: () => void;
}) {
  const [deposits, setDeposits] = useState<{ id: number; balance: bigint }[]>([]);
  const [checkedValues, setCheckedValues] = useState<Key[]>([]);

  useEffect(() => {
    setDeposits(
      new Array(20).fill(0).map((_, index) => ({ id: index + 100, balance: parseEther((index * 1762.354).toString()) }))
    );
  }, []);

  return (
    <Modal
      title="Bond More Deposits"
      isOpen={isOpen}
      maskClosable={false}
      okText="Bond"
      onCancel={onClose}
      onClose={onClose}
      onOk={onClose}
      className="lg:w-[25rem]"
    >
      {deposits.length ? (
        <>
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
            className="max-h-80 overflow-y-auto"
          />

          <div className="h-[1px] bg-white/20" />

          <ExtraPower power={BigInt(checkedValues.length * 12345)} powerChanges="more" />
        </>
      ) : (
        <span className="text-xs font-light text-white">No more deposits to bond</span>
      )}
    </Modal>
  );
}
