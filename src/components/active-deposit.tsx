import { useState } from "react";
import Popper from "./popper";

export default function ActiveDeposit() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popper
      className="border border-primary p-large bg-app-black max-h-32 overflow-y-auto"
      label={<span className="text-sm font-bold text-white">Use A Deposit</span>}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <span className="text-sm font-normal text-white/50">No active deposit</span>
    </Popper>
  );
}
