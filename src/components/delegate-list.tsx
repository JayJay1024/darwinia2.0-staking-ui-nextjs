import { Key, useEffect, useState } from "react";
import Table, { ColumnType } from "./table";

interface DataSource {
  key: Key;
  collator: string;
  stakedPower: bigint;
  bondedTokens: bigint;
  action: true;
}

const columns: ColumnType<DataSource>[] = [
  {
    key: "collator",
    dataIndex: "collator",
    width: "30%",
    title: <span>Collator</span>,
  },
  {
    key: "stakedPower",
    dataIndex: "stakedPower",
    width: "20%",
    title: <span>Your staked (Power)</span>,
    render: (row) => <span>{row.stakedPower.toString()}</span>,
  },
  {
    key: "bondedTokens",
    dataIndex: "bondedTokens",
    width: "20%",
    title: <span>Your bonded tokens</span>,
    render: (row) => <span>{row.bondedTokens.toString()}</span>,
  },
  {
    key: "action",
    dataIndex: "action",
    width: "30%",
    title: <span>Action</span>,
    render: (row) => (
      <div className="flex items-center gap-middle">
        <button className="border border-primary">One</button>
        <button className="border border-primary">Two</button>
      </div>
    ),
  },
];

export default function DelegateList() {
  const [dataSource, setDataSource] = useState<DataSource[]>([]);

  useEffect(() => {
    setDataSource(
      new Array(10).fill(0).map((_, index) => ({
        key: index,
        collator: "0xf422673CB7a673f595852f7B00906408A0b073db",
        stakedPower: BigInt(0),
        bondedTokens: BigInt(0),
        action: true,
      }))
    );
  }, []);

  return (
    <div className="p-5 bg-component flex flex-col gap-large">
      <h5 className="text-sm font-bold text-white">Staking Delegations</h5>
      <Table columns={columns} dataSource={dataSource} />
    </div>
  );
}
