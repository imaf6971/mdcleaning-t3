import type { ReactNode } from "react";

export type ModalProps = {
  onClose: () => void;
  children: ReactNode;
};

// TODO: fix width on different screens
export default function Modal({ onClose, children }: ModalProps) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25 backdrop-blur transition-all"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-4/5 md:w-3/5 xl:w-1/3"
      >
        <div className="rounded-md bg-white p-2 shadow">{children}</div>
      </div>
    </div>
  );
}
