"use client";

import { MouseEventHandler } from "react";
import Icon, { jsNumberForAddress } from "react-jazzicon";

interface Props {
  size: number;
  address: string;
  className?: string;
  onCopy?: () => void;
}

export default function Jazzicon({ address, className, size = 24, onCopy = () => undefined }: Props) {
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
      className={`flex cursor-copy items-center transition-transform hover:scale-105 active:scale-95 ${className}`}
      onClick={handleClick}
    >
      <Icon diameter={size} seed={jsNumberForAddress(address)} />
    </div>
  );
}
