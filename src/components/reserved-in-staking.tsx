import { useApp, useStaking } from "@/hooks";
import { formatBlanace, getChainConfig } from "@/utils";
import Image from "next/image";

export default function ReservedInStaking() {
  const { stakingRing, stakingKton, totalOfRingInDeposit } = useStaking();
  const { activeChain } = useApp();

  const { nativeToken, ktonToken } = getChainConfig(activeChain);

  return (
    <div className="flex flex-col gap-5 bg-component p-5 lg:w-[32%] lg:shrink-0">
      <span className="text-lg font-bold text-white">Reserved in Staking</span>
      <div className="h-[1px] bg-white/20" />
      <Token
        symbol={nativeToken.symbol}
        decimals={nativeToken.decimals}
        logoPath={nativeToken.logoPath}
        bonded={stakingRing}
        inDeposit={totalOfRingInDeposit}
        isNative
      />
      <div className="h-[1px] bg-white/20" />
      {ktonToken && (
        <Token
          symbol={ktonToken.symbol}
          decimals={ktonToken.decimals}
          logoPath={ktonToken.logoPath}
          bonded={stakingKton}
        />
      )}
    </div>
  );
}

function Token({
  symbol,
  decimals,
  logoPath,
  bonded,
  inDeposit,
  isNative,
}: {
  symbol: string;
  decimals: number;
  logoPath: string;
  bonded: bigint;
  inDeposit?: bigint;
  isNative?: boolean;
}) {
  return (
    <div className="flex flex-col gap-5">
      {/* logo && symbol */}
      <div className="flex items-center gap-small">
        <Image alt={symbol} src={logoPath} width={30} height={30} />
        <span className="text-lg font-bold uppercase text-white">{symbol}</span>
      </div>

      <div className="flex flex-col gap-small">
        <div className="flex items-center justify-between">
          <span className="text-sm font-light text-white">Bonded</span>
          <span className="text-sm font-bold text-white">{formatBlanace(bonded, decimals)}</span>
        </div>
        {isNative && inDeposit !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-xs font-light text-white/50">In Deposit</span>
            <span className="text-xs font-bold text-white/50">{formatBlanace(inDeposit, decimals)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
