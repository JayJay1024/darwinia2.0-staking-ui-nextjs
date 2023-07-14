import { ButtonHTMLAttributes, Key, useEffect, useState } from "react";
import Table, { ColumnType } from "./table";
import EllipsisText from "./ellipsis-text";
import { formatBlanace, getChainConfig, prettyNumber } from "@/utils";
import Jazzicon from "./jazzicon";
import Image from "next/image";
import { parseEther } from "viem";
import { ChainID } from "@/types";
import BondMoreRingModal from "./bond-more-ring-modal";
import BondMoreKtonModal from "./bond-more-kton-modal";
import UnbondRingModal from "./unbond-ring-modal";
import UnbondKtonModal from "./unbond-kton-modal";
import BondMoreDepositModal from "./bond-more-deposit-modal";

interface DataSource {
  key: Key;
  collator: string;
  stakedPower: bigint;
  bondedTokens: bigint;
  action: true;
}

const { nativeToken, ktonToken } = getChainConfig(ChainID.DARWINIA);

const columns: ColumnType<DataSource>[] = [
  {
    key: "collator",
    dataIndex: "collator",
    width: "22%",
    title: <span>Collator</span>,
    render: (row) => (
      <div className="flex items-center gap-small">
        <Jazzicon address={row.collator} size={30} className="hidden lg:flex" />
        <EllipsisText text={row.collator} textClassName="text-white" />
        <Image alt="Collator tooltip" width={20} height={20} src="/images/warning.svg" />
      </div>
    ),
  },
  {
    key: "stakedPower",
    dataIndex: "stakedPower",
    width: "14%",
    title: <span>Your staked (Power)</span>,
    render: (row) => <span className="truncate">{prettyNumber(row.stakedPower)}</span>,
  },
  {
    key: "bondedTokens",
    dataIndex: "bondedTokens",
    width: "30%",
    title: <span>Your bonded tokens</span>,
    render: (row) => (
      <div className="flex flex-col">
        <div className="flex items-center gap-small">
          <span className="truncate">
            {formatBlanace(parseEther("570.5"), nativeToken.decimals, { keepZero: false })} RING
          </span>
          <BondMoreRing />
          <UnbondRing />
        </div>
        <div className="flex items-center gap-small">
          <span className="truncate">
            {formatBlanace(parseEther("80098765987642.172653"), nativeToken.decimals, { keepZero: false })} Deposit RING
          </span>
          <BondMoreDeposit />
          <ActionButton action="unbond" />
        </div>
        <div className="flex items-center gap-small">
          <span className="truncate">
            {formatBlanace(parseEther("0"), ktonToken?.decimals, { keepZero: false })} KTON
          </span>
          <BondMoreKton />
          <UnbondKton />
        </div>
      </div>
    ),
  },
  {
    key: "action",
    dataIndex: "action",
    title: <span>Action</span>,
    render: (row) => (
      <div className="flex items-center gap-middle">
        <button className="border border-primary px-middle py-small">Change collator</button>
        <button className="border border-primary px-middle py-small">...</button>
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
        stakedPower: BigInt(index * 1928768765),
        bondedTokens: BigInt(0),
        action: true,
      }))
    );
  }, []);

  return (
    <div className="flex flex-col gap-large bg-component p-5">
      <h5 className="text-sm font-bold text-white">Staking Delegations</h5>
      <Table columns={columns} dataSource={dataSource} />
    </div>
  );
}

function ActionButton({ action, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { action: "bond" | "unbond" }) {
  return (
    <button
      type="button"
      {...rest}
      className="inline-flex h-[14px] w-[14px] shrink-0 items-center justify-center border border-white/40 transition-transform hover:scale-105 active:scale-95"
    >
      <span className="text-xs">{action === "bond" ? "+" : "-"}</span>
    </button>
  );
}

function BondMoreRing() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <ActionButton action="bond" onClick={() => setIsOpen(true)} />
      <BondMoreRingModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

function BondMoreKton() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <ActionButton action="bond" onClick={() => setIsOpen(true)} />
      <BondMoreKtonModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

function BondMoreDeposit() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <ActionButton action="bond" onClick={() => setIsOpen(true)} />
      <BondMoreDepositModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

function UnbondRing() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <ActionButton action="unbond" onClick={() => setIsOpen(true)} />
      <UnbondRingModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

function UnbondKton() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <ActionButton action="unbond" onClick={() => setIsOpen(true)} />
      <UnbondKtonModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
