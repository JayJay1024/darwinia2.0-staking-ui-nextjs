import dynamic from "next/dynamic";

const StakingDashboard = dynamic(() => import("@/components/staking-dashboard"), { ssr: false });

export default function Staking() {
  return (
    <div className="flex flex-col gap-10 p-large">
      <StakingDashboard />
    </div>
  );
}
