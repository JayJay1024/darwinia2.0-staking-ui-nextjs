import { ButtonHTMLAttributes, Key, forwardRef, useMemo, useState } from "react";
import Table, { ColumnType } from "./table";
import { formatBlanace, getChainConfig, prettyNumber } from "@/utils";
import Jazzicon from "./jazzicon";
import Image from "next/image";
import BondMoreRingModal from "./bond-more-ring-modal";
import BondMoreKtonModal from "./bond-more-kton-modal";
import UnbondRingModal from "./unbond-ring-modal";
import UnbondKtonModal from "./unbond-kton-modal";
import BondMoreDepositModal from "./bond-more-deposit-modal";
import UnbondDepositModal from "./unbond-deposit-modal";
import CollatorSelectModal from "./collator-select-modal";
import { useApp, useStaking } from "@/hooks";
import { useAccount } from "wagmi";
import Tooltip from "./tooltip";
import { UnbondingInfo } from "@/types";
import DisplayAccountName from "./display-account-name";
import UnbondingDepositTooltip from "./unbonding-deposit-tooltip";
import UnbondingTokenTooltip from "./unbonding-token-tooltip";
import { offset, useClick, useDismiss, useFloating, useInteractions, useTransitionStyles } from "@floating-ui/react";

interface DataSource {
  key: Key;
  collator: string;
  stakedPower: bigint;
  bondedTokens: {
    stakedRing: bigint;
    stakedKton: bigint;
    totalOfDepositsInStaking: bigint;
    unbondingRing: Omit<UnbondingInfo, "depositId">[];
    unbondingKton: Omit<UnbondingInfo, "depositId">[];
    unbondingDeposits: UnbondingInfo[];
  };
  isActive: boolean;
  action: true;
}

export default function DelegateList() {
  const { activeChain } = useApp();
  const {
    power,
    stakedRing,
    stakedKton,
    totalOfDepositsInStaking,
    unbondingRing,
    unbondingKton,
    unbondingDeposits,
    nominatorCollators,
    activeCollators,
  } = useStaking();
  const { address } = useAccount();

  const { nativeToken, ktonToken } = getChainConfig(activeChain);

  const columns: ColumnType<DataSource>[] = [
    {
      key: "collator",
      dataIndex: "collator",
      width: "24%",
      title: <span>Collator</span>,
      render: (row) => {
        if (row.collator) {
          return (
            <div className="flex items-center gap-small">
              <Jazzicon address={row.collator} size={24} className="hidden lg:flex" />
              <DisplayAccountName address={row.collator} />
              {!row.isActive && (
                <Tooltip
                  content={
                    <span className="text-xs font-light text-white">
                      This collator is currently in the waiting pool. The rewards will not be earned until the collator
                      joins the active pool.
                    </span>
                  }
                  className="w-fit shrink-0"
                  contentClassName="w-64"
                >
                  <Image
                    alt="Collator tooltip"
                    width={16}
                    height={16}
                    src="/images/warning.svg"
                    className="transition-transform hover:scale-105"
                  />
                </Tooltip>
              )}
            </div>
          );
        }

        return <SelectCollator text="Select a collator" />;
      },
    },
    {
      key: "stakedPower",
      dataIndex: "stakedPower",
      title: <span>Your staked (Power)</span>,
      render: (row) => {
        if (row.collator) {
          return <span className="truncate">{prettyNumber(row.stakedPower)}</span>;
        }

        return (
          <div className="flex items-center gap-middle">
            <span className="truncate text-white/50">{prettyNumber(row.stakedPower)}</span>
            <Tooltip
              content={
                <span className="text-xs font-light text-white">
                  The power is not working yet, You can delegate a collator to complete staking.
                </span>
              }
              className="w-fit"
              contentClassName="w-64"
            >
              <Image
                alt="Collator tooltip"
                width={16}
                height={16}
                src="/images/help.svg"
                className="transition-transform hover:scale-105"
              />
            </Tooltip>
          </div>
        );
      },
    },
    {
      key: "bondedTokens",
      dataIndex: "bondedTokens",
      width: "30%",
      title: <span>Your bonded tokens</span>,
      render: (row) => (
        <div className="flex flex-col">
          {/* ring */}
          <div className="flex items-center gap-small">
            <UnbondingTokenTooltip unbondings={row.bondedTokens.unbondingRing} token={nativeToken}>
              <span
                className={`truncate ${row.bondedTokens.unbondingRing.length > 0 ? "text-white/50" : "text-white"}`}
              >
                {formatBlanace(row.bondedTokens.stakedRing, nativeToken.decimals, { keepZero: false })}{" "}
                {nativeToken.symbol}
              </span>
            </UnbondingTokenTooltip>
            {row.collator.length > 0 && (
              <>
                <BondMoreRing />
                <UnbondRing />
              </>
            )}
          </div>
          {/* deposit */}
          <div className="flex items-center gap-small">
            <UnbondingDepositTooltip unbondings={row.bondedTokens.unbondingDeposits} token={nativeToken}>
              <span
                className={`truncate ${row.bondedTokens.unbondingDeposits.length > 0 ? "text-white/50" : "text-white"}`}
              >
                {formatBlanace(row.bondedTokens.totalOfDepositsInStaking, nativeToken.decimals, { keepZero: false })}{" "}
                Deposit {nativeToken.symbol}
              </span>
            </UnbondingDepositTooltip>
            {row.collator.length > 0 && (
              <>
                <BondMoreDeposit />
                <UnbondDeposit />
              </>
            )}
          </div>
          {/* kton */}
          <div className="flex items-center gap-small">
            <UnbondingTokenTooltip unbondings={row.bondedTokens.unbondingKton} token={ktonToken || nativeToken}>
              <span
                className={`truncate ${row.bondedTokens.unbondingKton.length > 0 ? "text-white/50" : "text-white"}`}
              >
                {formatBlanace(row.bondedTokens.stakedKton, ktonToken?.decimals, { keepZero: false })}{" "}
                {ktonToken?.symbol}
              </span>
            </UnbondingTokenTooltip>
            {row.collator.length > 0 && (
              <>
                <BondMoreKton />
                <UnbondKton />
              </>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "action",
      dataIndex: "action",
      width: "26%",
      title: <span>Action</span>,
      render: (row) => {
        if (row.collator) {
          return (
            <div className="flex items-center gap-middle">
              <SelectCollator text="Change collator" />
              <MoreAction />
            </div>
          );
        }

        return <BaseButton>Unbond all</BaseButton>;
      },
    },
  ];

  const dataSource: DataSource[] = useMemo(() => {
    const hasStaking =
      stakedRing > 0 ||
      stakedKton > 0 ||
      totalOfDepositsInStaking > 0 ||
      unbondingRing.length > 0 ||
      unbondingKton.length > 0 ||
      unbondingDeposits.length > 0;

    if (address && hasStaking) {
      const collator = nominatorCollators[address]?.at(0);

      return [
        {
          key: collator || "0",
          collator: collator || "",
          stakedPower: power,
          bondedTokens: {
            stakedRing,
            stakedKton,
            totalOfDepositsInStaking,
            unbondingRing,
            unbondingKton,
            unbondingDeposits,
          },
          isActive: activeCollators.some((item) => item.toLowerCase() === (collator || "").toLowerCase()),
          action: true,
        },
      ];
    }

    return [];
  }, [
    address,
    power,
    stakedRing,
    stakedKton,
    totalOfDepositsInStaking,
    unbondingRing,
    unbondingKton,
    unbondingDeposits,
    nominatorCollators,
    activeCollators,
  ]);

  return (
    <div className="flex flex-col gap-large bg-component p-5">
      <h5 className="text-sm font-bold text-white">Staking Delegations</h5>
      <Table columns={columns} dataSource={dataSource} />
    </div>
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

function UnbondDeposit() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <ActionButton action="unbond" onClick={() => setIsOpen(true)} />
      <UnbondDepositModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

function SelectCollator({ text }: { text: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <BaseButton onClick={() => setIsOpen(true)}>{text}</BaseButton>
      <CollatorSelectModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

function MoreAction() {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, context, floatingStyles } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-end",
    middleware: [offset(10)],
  });

  const { styles, isMounted } = useTransitionStyles(context, {
    initial: { transform: "translateY(-20px)", opacity: 0 },
    open: { transform: "translateY(0)", opacity: 1 },
    close: { transform: "translateY(-20px)", opacity: 0 },
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  return (
    <>
      <BaseButton ref={refs.setReference} {...getReferenceProps()}>
        ...
      </BaseButton>
      {isMounted && (
        <div style={floatingStyles} ref={refs.setFloating} {...getFloatingProps()} className="z-10">
          <div style={styles}>
            <BaseButton>Undelegate</BaseButton>
          </div>
        </div>
      )}
    </>
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

const BaseButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(function BaseButton(
  { children, className, ...rest },
  ref
) {
  return (
    <button
      className={`w-fit border border-primary px-middle py-small transition-opacity hover:opacity-80 active:opacity-60 ${className}`}
      ref={ref}
      {...rest}
    >
      {children}
    </button>
  );
});
