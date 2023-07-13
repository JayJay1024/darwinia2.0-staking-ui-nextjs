import { getChainConfig } from "@/utils";
import BondMoreTokenModal from "./bond-more-token-modal";
import { ChainID } from "@/types";
import { parseEther } from "viem";

const { ktonToken } = getChainConfig(ChainID.CRAB);

export default function BondMoreKtonModal({
  isOpen,
  onClose = () => undefined,
}: {
  isOpen: boolean;
  onClose?: () => void;
}) {
  return (
    ktonToken && (
      <BondMoreTokenModal
        isOpen={isOpen}
        symbol={ktonToken.symbol}
        decimals={ktonToken.decimals}
        power={BigInt(0)}
        balance={parseEther("12345.87654")}
        onClose={onClose}
        onBond={onClose}
        onCancel={onClose}
      />
    )
  );
}
