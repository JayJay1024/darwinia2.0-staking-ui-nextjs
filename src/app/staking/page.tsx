import dynamic from "next/dynamic";

const StakingDashboard = dynamic(() => import("@/components/staking-dashboard"), { ssr: false });

export default function Staking() {
  return (
    <div className="flex flex-col gap-10 p-large lg:container lg:mx-auto lg:gap-5 lg:px-0 lg:py-5">
      <StakingDashboard />
    </div>
  );
}
