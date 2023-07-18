import { getChainConfig } from "@/utils";
import { ChainID } from "@/types";
import { parseEther } from "viem";
import UnbondTokenModal from "./unbond-token-modal";

const { nativeToken } = getChainConfig(ChainID.CRAB);

export default function UnbondRingModal({
  isOpen,
  onClose = () => undefined,
}: {
  isOpen: boolean;
  onClose?: () => void;
}) {
  return (
    <UnbondTokenModal
      isOpen={isOpen}
      symbol={nativeToken.symbol}
      decimals={nativeToken.decimals}
      power={0n}
      balance={parseEther("12345.87654")}
      onClose={onClose}
      onBond={onClose}
      onCancel={onClose}
    />
  );
}
