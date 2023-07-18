import { getChainConfig } from "@/utils";
import BondMoreTokenModal from "./bond-more-token-modal";
import { ChainID } from "@/types";
import { parseEther } from "viem";

const { nativeToken } = getChainConfig(ChainID.CRAB);

export default function BondMoreRingModal({
  isOpen,
  onClose = () => undefined,
}: {
  isOpen: boolean;
  onClose?: () => void;
}) {
  return (
    <BondMoreTokenModal
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
