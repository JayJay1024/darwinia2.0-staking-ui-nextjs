import BalanceInput from "./balance-input";
import Modal from "./modal";

export default function BondMoreTokenModal({
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
      title={`Bond More ${symbol}`}
      isOpen={isOpen}
      onCancel={onCancel}
      onClose={onClose}
      onOk={onBond}
      maskClosable={false}
      okText="Bond"
    >
      <BalanceInput label="Amount" boldLabel decimals={decimals} symbol={symbol} balance={balance} power={power} />
    </Modal>
  );
}
