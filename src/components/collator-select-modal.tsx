import { Key, useEffect, useState } from "react";
import Modal from "./modal";
import Tabs, { TabsProps } from "./tabs";
import Image from "next/image";
import { useAccount } from "wagmi";
import Table, { ColumnType } from "./table";
import Jazzicon from "./jazzicon";
import { prettyNumber, toShortAdrress } from "@/utils";
import { notification } from "./notification";

type TabKey = "active" | "waiting";

interface DataSource {
  key: Key;
  collator: string;
  power: bigint;
  commission: number;
  blocks: number;
}

const columns: ColumnType<DataSource>[] = [
  {
    key: "collator",
    dataIndex: "collator",
    width: "30%",
    title: <span className="text-xs font-bold text-white">Collator</span>,
    render: (row) => (
      <div className="flex items-center gap-small">
        <Jazzicon size={20} address={row.collator} className="hidden lg:flex" />
        <span>{toShortAdrress(row.collator)}</span>
        <Image
          alt="Copy collator"
          width={16}
          height={16}
          src="/images/copy.svg"
          className="transition-transform hover:scale-105 hover:cursor-pointer active:scale-95"
          onClick={(e) => {
            e.stopPropagation();
            notification.success({
              title: "Copy successfully",
              disabledCloseBtn: true,
              duration: 3000,
            });
          }}
        />
      </div>
    ),
  },
  {
    key: "power",
    dataIndex: "power",
    width: "25%",
    title: (
      <div className="inline-flex flex-col text-xs font-bold text-white">
        <span>Total-staked</span>
        <span>(Power)</span>
      </div>
    ),
    render: (row) => <span>{prettyNumber(row.power)}</span>,
  },
  {
    key: "commission",
    dataIndex: "commission",
    width: "20%",
    title: <span className="text-xs font-bold text-white">Commission</span>,
    render: (row) => <span>{`${row.commission.toFixed(2)}%`}</span>,
  },
  {
    key: "blocks",
    dataIndex: "blocks",
    title: (
      <div className="inline-flex flex-col text-xs font-bold text-white">
        <span>Blocks</span>
        <span>Last session</span>
      </div>
    ),
  },
];

export default function CollatorSelectModal({
  isOpen,
  onClose = () => undefined,
}: {
  isOpen: boolean;
  onClose?: () => void;
}) {
  const [activeKey, setActiveKey] = useState<TabsProps<TabKey>["activeKey"]>("active");
  const [dataSource, setDataSource] = useState<DataSource[]>([]);
  const [selectedRow, setSelectedRow] = useState(dataSource.at(0)?.key);
  const { address } = useAccount();

  useEffect(() => {
    if (address) {
      setDataSource(
        new Array(20).fill(0).map((_, index) => ({
          key: index,
          collator: address,
          power: BigInt(index * 8736),
          commission: index,
          blocks: index,
        }))
      );
    } else {
      setDataSource([]);
    }
  }, [address]);

  return (
    <Modal
      title="Select A Collator"
      isOpen={isOpen}
      okText="Confirm"
      onClose={onClose}
      onCancel={onClose}
      onOk={onClose}
    >
      <Tabs
        items={[
          {
            key: "active",
            label: <span>Active Pool</span>,
            children: (
              <div className="flex h-[40vh] flex-col gap-middle overflow-y-hidden">
                <div className="flex flex-col gap-middle">
                  <span className="text-xs font-light text-white/50">
                    These candidates are in the active collator pool of the current Session.
                  </span>
                  <SearchInput />
                </div>
                <Table
                  dataSource={dataSource}
                  columns={columns}
                  styles={{ minWidth: 560 }}
                  contentClassName="max-h-[22vh]"
                  selectedRow={selectedRow}
                  onRowSelect={setSelectedRow}
                />
              </div>
            ),
          },
          {
            key: "waiting",
            label: <span>Waiting Pool</span>,
            children: (
              <div className="flex h-[40vh] flex-col gap-middle overflow-y-hidden">
                <SearchInput />
                <Table
                  dataSource={dataSource}
                  columns={columns}
                  styles={{ minWidth: 560 }}
                  contentClassName="max-h-[28vh]"
                  selectedRow={selectedRow}
                  onRowSelect={setSelectedRow}
                />
              </div>
            ),
          },
        ]}
        activeKey={activeKey}
        onChange={setActiveKey}
      />
    </Modal>
  );
}

function SearchInput() {
  return (
    <div className="flex h-8 w-full items-center gap-middle border border-white/50 px-middle transition-colors focus-within:border-white hover:border-white">
      <Image alt="Search" width={20} height={20} src="/images/search.svg" />
      <input
        className="h-full w-full bg-transparent text-xs font-light focus-visible:outline-none"
        placeholder="search for a collator"
      />
    </div>
  );
}
