import { ButtonHTMLAttributes, forwardRef } from "react";

export default forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(function OpacityButton(
  { children, className, ...rest },
  ref
) {
  return (
    <button
      className={`transition-opacity hover:opacity-80 active:opacity-60 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      ref={ref}
      {...rest}
    >
      {children}
    </button>
  );
});
