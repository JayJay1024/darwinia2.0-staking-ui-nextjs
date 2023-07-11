import { useState } from "react";
import Selector from "./selector";

const terms = new Array(36).fill(0).map((_, index) => index + 1);

export default function DepositTermSelector() {
  const [activeTerm, setActiveTerm] = useState(terms[0]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Selector
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      label={<span>{`${activeTerm} ${activeTerm > 1 ? "Months" : "Month"}`}</span>}
      labelClassName="border-white px-middle"
      menuClassName="border border-white bg-component max-h-52 overflow-y-auto flex flex-col"
    >
      {terms.map((term) => (
        <button
          key={term}
          type="button"
          onClick={() => {
            setActiveTerm(term);
            setIsOpen(false);
          }}
          className={`py-2 w-full transition-colors px-middle text-start hover:bg-app-black/50 ${
            activeTerm === term ? "bg-app-black" : ""
          }`}
        >
          <span className="text-sm font-light text-white">{`${term} ${term > 1 ? "Months" : "Month"}`}</span>
        </button>
      ))}
    </Selector>
  );
}
