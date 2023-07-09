import dynamic from "next/dynamic";

const StakingDashboard = dynamic(() => import("@/components/staking-dashboard"), { ssr: false });

export default function Staking() {
  return (
    <div className="p-large">
      <StakingDashboard />
    </div>
  );
}
