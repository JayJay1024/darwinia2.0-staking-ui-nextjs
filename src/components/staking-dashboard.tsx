"use client";

import { redirect } from "next/navigation";
import { useAccount } from "wagmi";

export default function StakingDashboard() {
  const { address } = useAccount();

  if (!address) {
    redirect("/");
  }

  return <div>Staking Component</div>;
}
