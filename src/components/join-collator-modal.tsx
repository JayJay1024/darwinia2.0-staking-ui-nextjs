import Image from "next/image";
import Modal from "./modal";
import Tooltip from "./tooltip";

export default function JoinCollatorModal({ isOpen, onClose }: { isOpen: boolean; onClose?: () => void }) {
  return (
    <Modal
      title="Join Collator"
      isOpen={isOpen}
      onClose={onClose}
      onOk={onClose}
      okText="Confirm"
      disabled
      maskClosable={false}
    >
      <p className="text-xs font-light text-white/90">
        Note that you need to complete two steps in sequence, setup [Session Key] and setup [Commission] before becoming
        a collator. Please{" "}
        <a
          className="text-primary transition-all hover:underline"
          target="_blank"
          rel="noopener"
          href="https://docs.darwinia.network/how-to-become-a-collator-679e363b68ab47189bde7826c8258c1d"
        >
          Run A Node
        </a>{" "}
        first and get the session key of your running node.{" "}
        <a
          className="text-primary transition-all hover:underline"
          target="_blank"
          rel="noopener"
          href="https://docs.darwinia.network/how-to-become-a-collator-679e363b68ab47189bde7826c8258c1d"
        >
          Tutorial
        </a>
      </p>
      <div className="h-[1px] bg-white/20" />

      <Input label="Session Key" placeholder="Session key" />
      <Input
        label="Commission (%)"
        placeholder="Commission"
        suffix="%"
        tooltip="The percent a collator takes off the top of the due staking rewards."
      />
    </Modal>
  );
}

function Input({
  label,
  tooltip,
  suffix,
  placeholder,
}: {
  label: string;
  tooltip?: string;
  suffix?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-small">
      <div className="inline-flex items-center gap-middle">
        <span className="text-xs font-bold text-white">{label}</span>
        {tooltip && (
          <Tooltip content={<span className="text-xs font-light text-white">{tooltip}</span>} contentClassName="w-64">
            <Image alt="Tooltip" width={16} height={16} src="/images/help.svg" />
          </Tooltip>
        )}
      </div>
      <div className="flex h-10 shrink-0 items-center justify-between border border-white px-middle">
        <input
          placeholder={placeholder}
          className={`bg-transparent text-sm font-bold focus-visible:outline-none ${suffix ? "w-11/12" : "w-full"}`}
        />
        {suffix && <span className="text-xs font-bold text-white">{suffix}</span>}
      </div>
    </div>
  );
}
