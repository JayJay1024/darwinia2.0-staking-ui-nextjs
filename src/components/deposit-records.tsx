import Table, { ColumnType } from "./table";
import { formatBlanace, formatTime, getChainConfig } from "@/utils";
import Progress from "./progress";
import { Deposit } from "@/types";
import { useApp, useStaking } from "@/hooks";
import { ButtonHTMLAttributes, Key, forwardRef, useState } from "react";
import Tooltip from "./tooltip";
import WithdrawModal, { WithdrawType } from "./withdraw-modal";

type DataSource = Deposit & { key: Key };

export default function DepositRecords() {
  const [openWithdraw, setOpenWithdraw] = useState<{ type: WithdrawType; deposit: Deposit } | null>(null);
  const { deposits } = useStaking();
  const { activeChain } = useApp();

  const { nativeToken, ktonToken } = getChainConfig(activeChain);

  const columns: ColumnType<DataSource>[] = [
    {
      key: "id",
      dataIndex: "id",
      width: "12%",
      title: <span>No.</span>,
      render: (row) => <span className="truncate text-sm font-light text-primary">{`ID #${row.id}`}</span>,
    },
    {
      key: "duration",
      dataIndex: "startTime",
      width: "26%",
      title: <span>Duration</span>,
      render: (row) => (
        <div className="flex w-fit flex-col gap-small">
          <div className="flex items-center gap-small text-sm font-light text-white">
            <span>{formatTime(row.startTime)}</span>
            <span>-</span>
            <span>{formatTime(row.expiredTime)}</span>
          </div>
          <Progress start={row.startTime} end={row.expiredTime} />
        </div>
      ),
    },
    {
      key: "amount",
      dataIndex: "value",
      width: "20%",
      title: <span>Amount (RING)</span>,
      render: (row) => (
        <span className="truncate">{formatBlanace(row.value, nativeToken.decimals, { precision: 4 })}</span>
      ),
    },
    {
      key: "reward",
      dataIndex: "reward",
      title: <span>Reward (KTON)</span>,
      render: (row) => (
        <span className="truncate">{formatBlanace(row.reward, ktonToken?.decimals, { precision: 4 })}</span>
      ),
    },
    {
      key: "action",
      dataIndex: "accountId",
      width: "20%",
      title: <span>Action</span>,
      render: (row) => {
        if (row.canEarlyWithdraw) {
          if (row.inUse) {
            return (
              <Tooltip
                content={
                  <span className="text-xs font-light text-white">
                    This deposit is used in staking, you should unbond it first then release it to be able to withdraw
                    it.
                  </span>
                }
                className="w-fit"
                contentClassName="w-64"
              >
                <Button disabled>Withdraw Earlier</Button>
              </Tooltip>
            );
          }
          return <Button onClick={() => setOpenWithdraw({ type: "early", deposit: row })}>Withdraw Earlier</Button>;
        } else if (row.inUse) {
          return (
            <Tooltip
              content={
                <span className="text-xs font-light text-white">
                  This deposit is used in staking, you should unbond it first then release it to be able to withdraw it.
                </span>
              }
              className="w-fit"
              contentClassName="w-64"
            >
              <Button disabled>Withdraw</Button>
            </Tooltip>
          );
        } else {
          return <Button onClick={() => setOpenWithdraw({ type: "regular", deposit: row })}>Withdraw</Button>;
        }
      },
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-large bg-component p-5">
        <h5 className="text-sm font-bold text-white">Active Deposit Records</h5>
        <Table columns={columns} dataSource={deposits.map((item) => ({ ...item, key: item.id }))} />
      </div>
      <WithdrawModal
        isOpen={!!openWithdraw}
        onClose={() => setOpenWithdraw(null)}
        type={openWithdraw?.type}
        deposit={openWithdraw?.deposit}
      />
    </>
  );
}

const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(function Button(
  { children, ...rest },
  ref
) {
  return (
    <button
      className="w-fit border border-primary px-middle py-small transition-opacity hover:opacity-80 active:opacity-60 disabled:cursor-not-allowed disabled:opacity-60"
      ref={ref}
      {...rest}
    >
      <span className="text-sm font-light text-white">{children}</span>
    </button>
  );
});
