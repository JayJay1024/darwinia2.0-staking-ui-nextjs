import { useState } from "react";
import Tabs, { TabsProps } from "./tabs";
import Delegate from "./delegate";
import DelegateList from "./delegate-list";
import TermDeposit from "./term-deposit";
import ActiveDepositRecords from "./active-deposit-records";

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
              <Delegate />
              <DelegateList />
            </div>
          ),
        },
        {
          key: "deposit",
          label: <span>Deposit</span>,
          children: (
            <div className="flex flex-col gap-5">
              <TermDeposit />
              <ActiveDepositRecords />
            </div>
          ),
        },
      ]}
      activeKey={activeKey}
      onChange={setActiveKey}
    />
  );
}
