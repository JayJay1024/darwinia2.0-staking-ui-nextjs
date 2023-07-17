import Modal from "./modal";
import CollatorInput from "./collator-input";

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
      className="lg:h-[25rem] lg:w-[45rem]"
      btnWrapClassName="lg:flex-row"
      btnClassName="lg:w-40"
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

      <CollatorInput label="Session Key" placeholder="Session key" />
      <CollatorInput
        label="Commission (%)"
        placeholder="Commission"
        suffix="%"
        tooltip="The percent a collator takes off the top of the due staking rewards."
      />
    </Modal>
  );
}
