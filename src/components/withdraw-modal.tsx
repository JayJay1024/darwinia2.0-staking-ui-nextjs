import { useApp } from "@/hooks";
import Modal from "./modal";
import { formatBlanace, getChainConfig } from "@/utils";
import { Deposit } from "@/types";
import { useMemo } from "react";

export type WithdrawType = "early" | "regular";

export default function WithdrawModal({
  deposit,
  type,
  isOpen,
  onClose = () => undefined,
}: {
  deposit?: Deposit;
  type?: WithdrawType;
  isOpen: boolean;
  onClose?: () => void;
}) {
  const { activeChain } = useApp();

  const { nativeToken, ktonToken } = getChainConfig(activeChain);

  const okText = useMemo(() => {
    if (type === "early" && deposit) {
      return `Pay ${formatBlanace(deposit.reward * 3n, ktonToken?.decimals, { keepZero: false })} ${ktonToken?.symbol}`;
    }
    return "Withdraw";
  }, [type, deposit, ktonToken]);

  return (
    <Modal
      title="Sure to withdraw now?"
      isOpen={isOpen}
      okText={okText}
      onOk={onClose}
      onCancel={onClose}
      onClose={onClose}
      className="lg:w-[560px]"
    >
      {type === "early" ? (
        <p className="text-sm font-light text-white">{`Since the Deposit Term doesn't end yet, you'll be charged a penalty of 3 times the ${ktonToken?.symbol} reward if you try to withdraw the ${nativeToken.symbol}s in advance.`}</p>
      ) : (
        <p className="text-sm font-light text-white">Withdraw at a regular time</p>
      )}
    </Modal>
  );
}
