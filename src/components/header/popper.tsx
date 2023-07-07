"use client";

import { Dispatch, PropsWithChildren, ReactElement, SetStateAction, useState } from "react";
import Button from "./button";
import {
  useClick,
  useFloating,
  useInteractions,
  useTransitionStyles,
  offset,
  size,
  useDismiss,
} from "@floating-ui/react";

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
      <Button className="flex items-center gap-middle" ref={refs.setReference} {...getReferenceProps()}>
        {label}
      </Button>
      {isMounted && (
        <div style={floatingStyles} ref={refs.setFloating} {...getFloatingProps()}>
          <div style={styles} className={className}>
            {children}
          </div>
        </div>
      )}
    </>
  );
}
