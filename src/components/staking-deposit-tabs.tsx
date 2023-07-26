import { useState } from "react";
import Tabs, { TabsProps } from "./tabs";
import DoStake from "./do-stake";
import StakingRecords from "./staking-records";
import DoDeposit from "./do-deposit";
import DepositRecords from "./deposit-records";

type TabKey = "staking" | "deposit";

export default function StakingDepositTabs() {
  const [activeKey, setActiveKey] = useState<TabsProps<TabKey>["activeKey"]>("staking");

  return (
    <Tabs
      items={[
        {
          key: "staking",
          label: <span>Staking</span>,
          children: (
            <div className="flex flex-col gap-5">
              <DoStake />
              <StakingRecords />
            </div>
          ),
        },
        {
          key: "deposit",
          label: <span>Deposit</span>,
          children: (
            <div className="flex flex-col gap-5">
              <DoDeposit />
              <DepositRecords />
            </div>
          ),
        },
      ]}
      activeKey={activeKey}
      onChange={setActiveKey}
    />
  );
}
