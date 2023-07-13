import { formatBlanace, prettyNumber } from "@/utils";
import Image from "next/image";
import InputLabel from "./input-label";

export default function BalanceInput({
  balance,
  symbol,
  decimals,
  logoPath,
  power,
  label,
}: {
  balance: bigint;
  symbol: string;
  decimals: number;
  logoPath?: string;
  power?: bigint;
  label?: string;
}) {
  return (
    <div className="flex flex-col gap-middle">
      {label && <InputLabel label={label} />}
      <div className="flex h-10 items-center justify-between gap-middle border border-white px-middle">
        <input
          type="string"
          placeholder={`Balance: ${formatBlanace(balance, decimals, { keepZero: false })}`}
          className="h-full w-[72%] bg-transparent text-sm font-light focus-visible:outline-none"
        />
        <div className="flex items-center gap-middle">
          {logoPath && <Image alt={symbol} width={20} height={20} src={logoPath} />}
          <span className="text-sm font-light text-white">{symbol}</span>
        </div>
      </div>
      {power !== undefined && <ExtraPower power={power} />}
    </div>
  );
}

export function ExtraPower({ power }: { power: bigint }) {
  return <span className="text-xs font-bold text-primary">{`+${prettyNumber(power)} Power`}</span>;
}
