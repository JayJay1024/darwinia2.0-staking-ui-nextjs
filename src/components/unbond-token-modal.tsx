import BalanceInput from "./balance-input";
import Modal from "./modal";

export default function UnbondTokenModal({
  isOpen,
  symbol,
  decimals,
  balance,
  power,
  onCancel = () => undefined,
  onBond = () => undefined,
  onClose = () => undefined,
}: {
  isOpen: boolean;
  symbol: string;
  decimals: number;
  balance: bigint;
  power: bigint;
  onCancel?: () => void;
  onBond?: () => void;
  onClose?: () => void;
}) {
  return (
    <Modal
      title={`Unbond ${symbol}`}
      isOpen={isOpen}
      onCancel={onCancel}
      onClose={onClose}
      onOk={onBond}
      maskClosable={false}
      okText="Bond"
      className="lg:w-[25rem]"
    >
      <>
        <p className="text-xs font-light text-white">This unbonding process will take 14 days to complete.</p>
        <div className="h-[1px] bg-white/20" />
        <BalanceInput
          label="Amount"
          boldLabel
          decimals={decimals}
          symbol={symbol}
          balance={balance}
          power={power}
          powerChanges="less"
        />
      </>
    </Modal>
  );
}
