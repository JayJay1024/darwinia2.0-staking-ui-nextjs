import Table, { ColumnType } from "./table";
import { formatBlanace, formatTime, getChainConfig } from "@/utils";
import Progress from "./progress";
import { Deposit } from "@/types";
import { useApp, useStaking } from "@/hooks";
import { Key } from "react";

type DataSource = Deposit & { key: Key };

export default function ActiveDepositRecords() {
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
      render: () => (
        <div>
          <button className="border border-primary px-middle py-small">
            <span className="text-sm font-light text-white">Withdraw Earlier</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-large bg-component p-5">
      <h5 className="text-sm font-bold text-white">Active Deposit Records</h5>
      <Table columns={columns} dataSource={deposits.map((item) => ({ ...item, key: item.id }))} />
    </div>
  );
}
