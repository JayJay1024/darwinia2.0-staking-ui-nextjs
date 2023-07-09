import Image from "next/image";

export default function Power() {
  return (
    <div className="bg-primary flex flex-col gap-5 p-5">
      {/* power */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-middle">
          <Image alt="Icon of Power" src="/images/power.svg" width={30} height={42} />
          <span className="text-white font-bold text-3xl">Power</span>
        </div>
        <span className="text-white font-bold text-3xl">94261823</span>
      </div>

      {/* reward */}
      <div className="p-5 bg-component flex flex-col gap-middle min-h-[10rem]">
        <span className="font-bold text-sm text-white">Latest Staking Rewards</span>
        <div className="h-[1px] bg-white/20" />
        <span className="text-sm font-bold text-white/50">No Rewards Yet</span>
      </div>

      {/* see detail */}
      <div className="inline-block">
        <span className="text-white font-light text-xs">See detailed staking rewards in </span>
        <a
          target="_blank"
          href="www.subscan.io"
          rel="noopener"
          className="text-white font-normal text-xs underline font-sans transition-opacity hover:opacity-80 active:opacity-60"
        >
          Subscan→
        </a>
      </div>
    </div>
  );
}
