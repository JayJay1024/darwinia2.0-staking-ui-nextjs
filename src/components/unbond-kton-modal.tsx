import { getChainConfig } from "@/utils";
import { ChainID } from "@/types";
import { parseEther } from "viem";
import UnbondTokenModal from "./unbond-token-modal";

const { ktonToken } = getChainConfig(ChainID.CRAB);

export default function UnbondKtonModal({
  isOpen,
  onClose = () => undefined,
}: {
  isOpen: boolean;
  onClose?: () => void;
}) {
  return (
    ktonToken && (
      <UnbondTokenModal
        isOpen={isOpen}
        symbol={ktonToken.symbol}
        decimals={ktonToken.decimals}
        power={0n}
        balance={parseEther("12345.87654")}
        onClose={onClose}
        onBond={onClose}
        onCancel={onClose}
      />
    )
  );
}
