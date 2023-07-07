import { FC, ButtonHTMLAttributes } from "react";

const ActionButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...rest }) => (
  <button
    {...rest}
    className="text-sm font-light text-white hover:opacity-80 active:opacity-60 disabled:opacity-100 disabled:text-white/50 disabled:cursor-not-allowed"
  >
    {children}
  </button>
);

export default ActionButton;
