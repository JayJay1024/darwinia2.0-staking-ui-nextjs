import Image from "next/image";
import { ButtonHTMLAttributes, PropsWithChildren, useRef } from "react";
import { createPortal } from "react-dom";
import { CSSTransition } from "react-transition-group";

interface Props {
  isOpen: boolean;
  title: string;
  cancelText?: string;
  okText?: string;
  disabled?: boolean;
  maskClosable?: boolean;
  className?: string;
  btnWrapClassName?: string;
  btnClassName?: string;
  onClose?: () => void;
  onCancel?: () => void;
  onOk?: () => void;
}

export default function Modal({
  isOpen,
  title,
  children,
  cancelText,
  okText,
  disabled,
  className,
  btnClassName,
  btnWrapClassName,
  maskClosable = true,
  onClose = () => undefined,
  onCancel,
  onOk,
}: PropsWithChildren<Props>) {
  const nodeRef = useRef<HTMLDivElement | null>(null);

  return createPortal(
    <CSSTransition
      in={isOpen}
      timeout={300}
      nodeRef={nodeRef}
      classNames="modal-fade"
      unmountOnExit
      onEnter={() => {
        document.body.style.overflow = "hidden";
      }}
      onExited={() => {
        document.body.style.overflow = "auto";
      }}
    >
      <div
        ref={nodeRef}
        className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-app-black/90 px-large"
        onClick={() => {
          if (maskClosable) {
            onClose();
          }
        }}
      >
        <div className={`flex w-full flex-col border border-primary ${className}`} onClick={(e) => e.stopPropagation()}>
          {/* header */}
          <div className="flex h-11 items-center justify-between bg-primary px-middle">
            <span className="text-sm font-bold text-white">{title}</span>
            <Image
              alt="Close modal"
              width={24}
              height={24}
              src="/images/close-white.svg"
              className="transition-transform hover:scale-105 hover:cursor-pointer active:scale-95"
              onClick={onClose}
            />
          </div>
          {/* content */}
          <div className={`h-full bg-component p-large ${onCancel || onOk ? "flex flex-col gap-large" : ""}`}>
            {children}{" "}
            {(onCancel || onOk) && (
              <>
                <div className="h-[1px] bg-white/20" />

                {(onOk || onCancel) && (
                  <div className={`flex flex-col gap-large ${btnWrapClassName}`}>
                    {onOk && (
                      <Button className={`bg-primary ${btnClassName}`} onClick={onOk} disabled={disabled}>{`${
                        okText || "Ok"
                      }`}</Button>
                    )}
                    {onCancel && (
                      <Button className={`bg-transparent ${btnClassName}`} onClick={onCancel}>{`${
                        cancelText || "Cancel"
                      }`}</Button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </CSSTransition>,
    document.body
  );
}

function Button({ className, children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`h-10 shrink-0 border border-primary text-sm font-bold text-white transition-opacity hover:opacity-80 active:opacity-60 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}
