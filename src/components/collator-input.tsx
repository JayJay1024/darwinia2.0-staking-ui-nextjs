import Image from "next/image";
import Tooltip from "./tooltip";

export default function CollatorInput({
  label,
  tooltip,
  suffix,
  placeholder,
}: {
  label: string;
  tooltip?: string;
  suffix?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-small">
      <div className="inline-flex items-center gap-middle">
        <span className="text-xs font-bold text-white">{label}</span>
        {tooltip && (
          <Tooltip content={<span className="text-xs font-light text-white">{tooltip}</span>} contentClassName="w-64">
            <Image alt="Tooltip" width={16} height={16} src="/images/help.svg" />
          </Tooltip>
        )}
      </div>
      <div className="flex h-10 shrink-0 items-center justify-between border border-white px-middle">
        <input
          placeholder={placeholder}
          className={`h-full bg-transparent text-sm font-bold focus-visible:outline-none ${
            suffix ? "w-11/12" : "w-full"
          }`}
        />
        {suffix && <span className="text-xs font-bold text-white">{suffix}</span>}
      </div>
    </div>
  );
}