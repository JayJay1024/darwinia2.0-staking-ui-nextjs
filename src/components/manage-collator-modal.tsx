import { ButtonHTMLAttributes, useState } from "react";
import Modal from "./modal";
import Tabs from "./tabs";
import CollatorInput from "./collator-input";

enum TabKey {
  UPDATE_SESSION_KEY,
  UPDATE_COMMISSION,
  STOP_COLLATION,
}

export default function ManageCollator({ isOpen, onClose }: { isOpen: boolean; onClose?: () => void }) {
  const [activeKey, setActiveKey] = useState(TabKey.UPDATE_SESSION_KEY);

  return (
    <Modal title="Manage Collator" isOpen={isOpen} onClose={onClose} maskClosable={false}>
      <Tabs
        items={[
          {
            key: TabKey.UPDATE_SESSION_KEY,
            label: <span>Update Session Key</span>,
            children: (
              <div className="flex flex-col gap-large">
                <CollatorInput label="Session Key" placeholder="Session key" />
                <div className="h-[1px] bg-white/20" />
                <Button>
                  <span>Update</span>
                </Button>
              </div>
            ),
          },
          {
            key: TabKey.UPDATE_COMMISSION,
            label: <span>Update Commission</span>,
            children: (
              <div className="flex flex-col gap-large">
                <CollatorInput
                  label="Commission (%)"
                  placeholder="Commission"
                  suffix="%"
                  tooltip="The percent a collator takes off the top of the due staking rewards."
                />
                <div className="h-[1px] bg-white/20" />
                <Button>
                  <span>Update</span>
                </Button>
              </div>
            ),
          },
          {
            key: TabKey.STOP_COLLATION,
            label: <span>Stop Collation</span>,
            children: (
              <div className="flex flex-col gap-large">
                <p className="text-xs font-light text-white">
                  Collators maintain parachains by collecting parachain transactions from users and producing state
                  transition proofs for Relay Chain validators. Sure to stop collation now?
                </p>
                <div className="h-[1px] bg-white/20" />
                <Button disabled>
                  <span>Stop</span>
                </Button>
              </div>
            ),
          },
        ]}
        activeKey={activeKey}
        onChange={setActiveKey}
        labelClassName="min-w-[32rem]"
      />
    </Modal>
  );
}

function Button({ children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="h-10 w-full bg-primary text-xs font-bold text-white transition-opacity hover:opacity-80 active:opacity-60 disabled:cursor-not-allowed disabled:opacity-60"
      {...rest}
    >
      {children}
    </button>
  );
}
