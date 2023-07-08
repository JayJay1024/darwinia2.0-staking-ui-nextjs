"use client";

import { MouseEventHandler } from "react";
import Icon, { jsNumberForAddress } from "react-jazzicon";

interface Props {
  size: number;
  address: string;
  onCopy?: () => void;
}

export default function Jazzicon({ address, size = 24, onCopy = () => undefined }: Props) {
  const handleClick: MouseEventHandler<HTMLDivElement> = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(address);
      onCopy();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="cursor-copy flex items-center transition-transform hover:scale-105 active:scale-95"
      onClick={handleClick}
    >
      <Icon diameter={size} seed={jsNumberForAddress(address)} />
    </div>
  );
}
