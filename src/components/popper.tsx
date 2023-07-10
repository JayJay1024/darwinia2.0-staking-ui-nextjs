"use client";

import { Dispatch, PropsWithChildren, ReactElement, SetStateAction } from "react";
import Button from "./header/button";
import {
  useClick,
  useFloating,
  useInteractions,
  useTransitionStyles,
  offset,
  size,
  useDismiss,
} from "@floating-ui/react";
import Image from "next/image";

interface Props {
  label: ReactElement;
  className: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Popper({ label, className, children, isOpen, setIsOpen }: PropsWithChildren<Props>) {
  const { refs, context, floatingStyles } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(10),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, { width: `${rects.reference.width}px` });
        },
      }),
    ],
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
      <Button
        className="flex items-center justify-between gap-middle min-w-[126px]"
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        {label}
        <Image
          src="/images/caret-down.svg"
          alt="Account profiles icon"
          width={16}
          height={16}
          className="transition-transform duration-300 translate-y-3"
          style={{ transform: isOpen ? "rotateX(180deg)" : "rotateX(0)" }}
        />
      </Button>
      {isMounted && (
        <div style={floatingStyles} ref={refs.setFloating} {...getFloatingProps()} className="z-10">
          <div style={styles} className={className}>
            {children}
          </div>
        </div>
      )}
    </>
  );
}
