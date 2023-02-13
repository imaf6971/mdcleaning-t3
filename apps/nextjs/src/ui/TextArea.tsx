import type { ChangeEventHandler } from "react";

type TextAreaProps = {
  value?: string;
  label: string;
  id: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  required: boolean;
};

export default function TextArea({
  value,
  onChange,
  label,
  id,
  required,
}: TextAreaProps) {
  return (
    <div className="flex flex-col items-start justify-between text-center">
      <label className="mb-2 block font-medium text-gray-900" htmlFor={id}>
        {label}
      </label>
      <textarea
        required={required}
        id={id}
        className="w-full rounded-md border p-2 transition-shadow invalid:ring-red-300 hover:shadow focus:bg-gray-200 focus:outline-none focus:ring"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
