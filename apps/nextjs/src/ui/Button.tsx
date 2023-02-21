import type { MouseEventHandler, ReactNode } from "react";

type ButtonProps = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
  disabled?: boolean;
};

export default function Button({
  onClick,
  children,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="disabled:bg-gray-200 rounded-md border p-2 transition-shadow hover:shadow focus:bg-gray-200 focus:outline-none focus:ring"
    >
      {children}
    </button>
  );
}
