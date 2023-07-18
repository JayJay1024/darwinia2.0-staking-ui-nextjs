import { useStaking } from "@/hooks";
import { prettyNumber } from "@/utils";
import Image from "next/image";

export default function Power() {
  const { power } = useStaking();

  return (
    <div className="flex flex-1 flex-col gap-5 bg-primary p-5">
      {/* power */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-middle">
          <Image alt="Icon of Power" src="/images/power.svg" width={30} height={42} />
          <span className="text-3xl font-bold text-white">Power</span>
        </div>
        <span className="text-3xl font-bold text-white">{prettyNumber(power)}</span>
      </div>

      {/* reward */}
      <div className="flex flex-col gap-middle bg-component p-5">
        <span className="text-sm font-bold text-white">Latest Staking Rewards</span>
        <div className="h-[1px] shrink-0 bg-white/20" />
        <div className="flex h-[6rem] flex-col overflow-y-auto">
          <span className="text-sm font-bold text-white/50">No Rewards Yet</span>
          {/* <div className="flex flex-col gap-small">
            <span className="text-sm font-bold text-white/50">No Rewards Yet</span>
            <span className="text-sm font-bold text-white/50">No Rewards Yet</span>
            <span className="text-sm font-bold text-white/50">No Rewards Yet</span>
            <span className="text-sm font-bold text-white/50">No Rewards Yet</span>
            <span className="text-sm font-bold text-white/50">No Rewards Yet</span>
            <span className="text-sm font-bold text-white/50">No Rewards Yet</span>
            <span className="text-sm font-bold text-white/50">No Rewards Yet</span>
            <span className="text-sm font-bold text-white/50">No Rewards Yet</span>
            <span className="text-sm font-bold text-white/50">No Rewards Yet</span>
            <span className="text-sm font-bold text-white/50">No Rewards Yet</span>
          </div> */}
        </div>
      </div>

      {/* see detail */}
      <div className="inline-block">
        <span className="text-xs font-light text-white">See detailed staking rewards in </span>
        <a
          target="_blank"
          href="www.subscan.io"
          rel="noopener"
          className="font-sans text-xs font-normal text-white underline transition-opacity hover:opacity-80 active:opacity-60"
        >
          Subscan→
        </a>
      </div>
    </div>
  );
}
