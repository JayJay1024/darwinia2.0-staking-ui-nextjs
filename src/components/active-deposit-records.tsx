import { Key, useEffect, useState } from "react";
import Table, { ColumnType } from "./table";
import { formatTime } from "@/utils";
import Progress from "./progress";

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

const columns: ColumnType<DataSource>[] = [
  {
    key: "id",
    dataIndex: "id",
    title: <span>No.</span>,
    render: (row) => <span className="text-sm font-light text-primary">{`ID #${row.id}`}</span>,
  },
  {
    key: "duration",
    dataIndex: "duration",
    width: "28%",
    title: <span>Duration</span>,
    render: (row) => (
      <div className="flex flex-col gap-small w-fit">
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
    title: <span>Amount</span>,
    render: (row) => <span>{row.amount.toString()} RING</span>,
  },
  {
    key: "reward",
    dataIndex: "reward",
    title: <span>Reward</span>,
    render: (row) => <span>{row.reward.toString()} KTON</span>,
  },
  {
    key: "action",
    dataIndex: "action",
    title: <span>Action</span>,
    render: () => (
      <div>
        <button className="border border-primary">
          <span className="text-sm font-light text-white">Withdraw</span>
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
        id: index + 100,
        duration: { start: now - 80000000, end: now + index * 80000000 },
        amount: BigInt(150 * index),
        reward: BigInt(79 * index),
        action: true,
      }))
    );
  }, []);

  return (
    <div className="p-5 bg-component flex flex-col gap-large">
      <h5 className="text-sm font-bold text-white">Active Deposit Records</h5>
      <Table columns={columns} dataSource={dataSource} />
    </div>
  );
}
