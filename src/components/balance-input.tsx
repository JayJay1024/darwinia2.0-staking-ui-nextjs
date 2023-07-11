import Image from "next/image";

export default function BalanceInput({ symbol, logoPath }: { symbol: string; logoPath: string }) {
  return (
    <div className="flex items-center justify-between gap-middle border border-white p-middle">
      <input
        type="string"
        placeholder="Balance: 18,422.4"
        className="bg-transparent text-sm font-light focus-visible:outline-none w-[72%]"
      />
      <div className="flex items-center gap-middle">
        <Image alt={symbol} width={20} height={20} src={logoPath} />
        <span className="text-sm font-light text-white">{symbol}</span>
      </div>
    </div>
  );
}
