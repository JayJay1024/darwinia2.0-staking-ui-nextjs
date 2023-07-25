import { formatBlanace, prettyNumber } from "@/utils";
import Image from "next/image";
import InputLabel from "./input-label";
import { parseUnits } from "viem";

type PowerChanges = "more" | "less";

export default function BalanceInput({
  balance,
  symbol,
  decimals,
  logoPath,
  power,
  label,
  boldLabel,
  className,
  powerChanges = "more",
  onChange = () => undefined,
}: {
  balance: bigint;
  symbol: string;
  decimals: number;
  logoPath?: string;
  power?: bigint;
  powerChanges?: PowerChanges;
  label?: string;
  boldLabel?: boolean;
  className?: string;
  onChange?: (amount: bigint) => void;
}) {
  return (
    <div className={`flex flex-col gap-middle ${className}`}>
      {label && <InputLabel label={label} bold={boldLabel} />}
      <div className="flex h-10 items-center justify-between gap-middle border border-white px-middle">
        <input
          type="string"
          placeholder={`Balance: ${formatBlanace(balance, decimals, { keepZero: false, precision: 4 })}`}
          className="h-full w-[72%] bg-transparent text-sm font-light focus-visible:outline-none"
          onChange={(e) => {
            if (!Number.isNaN(Number(e.target.value))) {
              onChange(parseUnits(e.target.value, decimals));
            }
          }}
        />
        <div className="flex items-center gap-middle">
          {logoPath && <Image alt={symbol} width={20} height={20} src={logoPath} />}
          <span className="text-sm font-light text-white">{symbol}</span>
        </div>
      </div>
      {power !== undefined && <ExtraPower power={power} powerChanges={powerChanges} />}
    </div>
  );
}

export function ExtraPower({ power, powerChanges }: { power: bigint; powerChanges?: PowerChanges }) {
  return (
    <span className="text-xs font-bold text-primary">{`${powerChanges === "more" ? "+" : "-"}${prettyNumber(
      power
    )} Power`}</span>
  );
}
