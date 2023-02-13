import type { ChangeEventHandler } from "react";

type TimeInputProps = {
  value: string | number | readonly string[];
  onChange: ChangeEventHandler<HTMLInputElement>;
  id: string;
  label: string;
};

export default function TimeInput({
  value,
  onChange,
  id,
  label,
}: TimeInputProps) {
  return (
    <div>
      <label
        className="mb-2 block font-medium text-gray-900 dark:text-white"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        id={id}
        className="rounded-md border p-2 transition-shadow hover:shadow focus:bg-gray-200 focus:outline-none focus:ring"
        type="time"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
