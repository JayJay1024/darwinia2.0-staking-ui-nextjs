import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  useTransitionStyles,
  FloatingArrow,
  arrow,
} from "@floating-ui/react";
import { PropsWithChildren, ReactElement, useRef, useState } from "react";

interface Props {
  className?: string;
  contentClassName?: string;
  content: ReactElement | string;
}

export default function Tooltip({ children, content, className, contentClassName }: PropsWithChildren<Props>) {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "top",
    middleware: [
      offset(10),
      flip(),
      shift(),
      arrow({
        element: arrowRef,
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

  const { isMounted, styles } = useTransitionStyles(context, {
    initial: { transform: "scale(0.5)", opacity: 0 },
    open: { transform: "scale(1)", opacity: 1 },
    close: { transform: "scale(0.5)", opacity: 0 },
  });

  return (
    <>
      <div className={className} ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>
      {isMounted && (
        <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
          <FloatingArrow ref={arrowRef} style={styles} context={context} fill="#FF0083" />
          <div style={styles} className={`border border-primary bg-component p-middle ${contentClassName}`}>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
