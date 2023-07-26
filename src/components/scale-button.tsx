import { ButtonHTMLAttributes, forwardRef } from "react";

export default forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(function ScaleButton(
  { children, className, ...rest },
  ref
) {
  return (
    <button
      className={`transition-transform hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      ref={ref}
      {...rest}
    >
      {children}
    </button>
  );
});
