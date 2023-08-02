import { ButtonHTMLAttributes, forwardRef } from "react";

export default forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { busy?: boolean }>(
  function OpacityButton({ children, className, busy, ...rest }, ref) {
    return (
      <button
        className={`relative transition-opacity hover:opacity-80 active:opacity-60 disabled:cursor-not-allowed disabled:opacity-60 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-60 ${className}`}
        ref={ref}
        {...rest}
      >
        {busy && (
          <div className="absolute bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-[2px] border-b-white/50 border-l-white/50 border-r-white border-t-white" />
          </div>
        )}
        {children}
      </button>
    );
  }
);
