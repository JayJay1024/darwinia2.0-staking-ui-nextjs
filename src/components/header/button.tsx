import { forwardRef, ButtonHTMLAttributes } from "react";

export default forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(function Button(
  { children, className, ...rest },
  ref
) {
  return (
    <button
      {...rest}
      type="button"
      ref={ref}
      className={`text-sm font-light text-white h-10 px-large flex items-center border border-primary transition-opacity hover:opacity-80 active:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
});
