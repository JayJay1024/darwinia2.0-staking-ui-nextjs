"use client";

import { redirect } from "next/navigation";
import { useAccount } from "wagmi";
import Power from "./power";
import StakingReserved from "./staking-reserved";

export default function StakingDashboard() {
  const { address } = useAccount();

  if (!address) {
    redirect("/");
  }

  return (
    <>
      <Power />
      <StakingReserved />
    </>
  );
}
