import { useState } from "react";
import Selector from "./selector";

export default function ActiveDepositSelector() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Selector
      labelClassName="border-white px-middle"
      menuClassName="border border-white p-middle bg-app-black max-h-32 overflow-y-auto"
      label={<span className="text-sm font-bold text-white">Use A Deposit</span>}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <span className="text-sm font-normal text-white/50">No active deposit</span>
    </Selector>
  );
}
