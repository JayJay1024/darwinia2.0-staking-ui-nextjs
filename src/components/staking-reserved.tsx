import { ChainID } from "@/types";
import { getChainConfig } from "@/utils";
import Image from "next/image";

const { nativeToken, ktonToken } = getChainConfig(ChainID.DARWINIA);

export default function StakingReserved() {
  return (
    <div className="p-5 bg-component flex flex-col gap-5">
      <span className="font-bold text-lg text-white">Reserved in Staking</span>
      <div className="h-[1px] bg-white/20" />
      <Token symbol={nativeToken.symbol} logoPath={nativeToken.logoPath} isNative />
      <div className="h-[1px] bg-white/20" />
      {ktonToken && <Token symbol={ktonToken.symbol} logoPath={ktonToken.logoPath} />}
    </div>
  );
}

function Token({ symbol, logoPath, isNative }: { symbol: string; logoPath: string; isNative?: boolean }) {
  return (
    <div className="flex flex-col gap-5">
      {/* logo && symbol */}
      <div className="flex items-center gap-small">
        <Image alt={symbol} src={logoPath} width={30} height={30} />
        <span className="uppercase text-white text-lg font-bold">{symbol}</span>
      </div>

      <div className="flex flex-col gap-small">
        <div className="flex items-center justify-between">
          <span className="font-light text-sm text-white">Bonded</span>
          <span className="font-bold text-sm text-white">23,130</span>
        </div>
        {isNative && (
          <div className="flex items-center justify-between">
            <span className="font-light text-sm text-white">In Deposit</span>
            <span className="font-bold text-sm text-white">0</span>
          </div>
        )}
      </div>
    </div>
  );
}
