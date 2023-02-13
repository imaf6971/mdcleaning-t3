import type { MouseEventHandler, ReactNode } from "react";

type ButtonProps = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
};

export default function Button({ onClick, children }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="rounded-md border p-2 transition-shadow hover:shadow focus:bg-gray-200 focus:outline-none focus:ring"
    >
      {children}
    </button>
  );
}
