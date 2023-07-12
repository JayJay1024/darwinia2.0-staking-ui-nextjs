import { Key, useEffect, useState } from "react";
import Table, { ColumnType } from "./table";
import { formatBlanace, formatTime, getChainConfig } from "@/utils";
import Progress from "./progress";
import { ChainID } from "@/types";
import { parseEther } from "viem";

interface DataSource {
  key: Key;
  id: number;
  duration: {
    start: number;
    end: number;
  };
  amount: bigint;
  reward: bigint;
  action: true;
}

const { nativeToken, ktonToken } = getChainConfig(ChainID.DARWINIA);

const columns: ColumnType<DataSource>[] = [
  {
    key: "id",
    dataIndex: "id",
    width: "10%",
    title: <span>No.</span>,
    render: (row) => <span className="truncate text-sm font-light text-primary">{`ID #${row.id}`}</span>,
  },
  {
    key: "duration",
    dataIndex: "duration",
    width: "28%",
    title: <span>Duration</span>,
    render: (row) => (
      <div className="flex w-fit flex-col gap-small">
        <div className="flex items-center gap-small text-sm font-light text-white">
          <span>{formatTime(row.duration.start)}</span>
          <span>-</span>
          <span>{formatTime(row.duration.end)}</span>
        </div>
        <Progress start={row.duration.start} end={row.duration.end} />
      </div>
    ),
  },
  {
    key: "amount",
    dataIndex: "amount",
    width: "18%",
    title: <span>Amount (RING)</span>,
    render: (row) => <span className="truncate">{formatBlanace(row.amount, nativeToken.decimals)}</span>,
  },
  {
    key: "reward",
    dataIndex: "reward",
    width: "15%",
    title: <span>Reward (KTON)</span>,
    render: (row) => <span className="truncate">{formatBlanace(row.reward, ktonToken?.decimals)}</span>,
  },
  {
    key: "action",
    dataIndex: "action",
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

export default function ActiveDepositRecords() {
  const [dataSource, setDataSource] = useState<DataSource[]>([]);

  useEffect(() => {
    const now = Date.now();

    setDataSource(
      new Array(10).fill(0).map((_, index) => ({
        key: index,
        id: index + 100000,
        duration: { start: now - 80000000, end: now + index * 80000000 },
        amount: parseEther((index * 20000000.09873).toString()),
        reward: parseEther((index * 9900000001.16376452).toString()),
        action: true,
      }))
    );
  }, []);

  return (
    <div className="flex flex-col gap-large bg-component p-5">
      <h5 className="text-sm font-bold text-white">Active Deposit Records</h5>
      <Table columns={columns} dataSource={dataSource} />
    </div>
  );
}
