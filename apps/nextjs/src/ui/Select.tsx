import { useState } from "react";

export type SelectOption = {
  label: string;
  value: number;
};

type SelectProps = {
  label: string;
  options: SelectOption[];
  selectedOption?: SelectOption;
  onChange: (value?: SelectOption) => void;
};

export default function Select({
  label,
  options,
  selectedOption,
  onChange,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  function clearOptions() {
    onChange(undefined);
  }

  function selectOption(option: SelectOption) {
    onChange(option);
  }

  function isOptionSelected(option: SelectOption): boolean {
    return option.value === selectedOption?.value;
  }

  return (
    <div className="flex flex-col items-start justify-between text-center">
      <span className="mb-2 block font-medium text-gray-900 dark:text-white">
        {label}
      </span>
      <div
        onBlur={() => setIsOpen(false)}
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex min-h-[1.5em] w-full items-center gap-2 rounded-md border p-2 transition-shadow hover:shadow focus:bg-gray-200 focus:outline-none focus:ring"
      >
        <span className="grow">{selectedOption?.label}</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            clearOptions();
          }}
          className="cursor-pointer p-0 text-xl hover:text-gray-200 focus:text-gray-200"
        >
          &times;
        </button>
        <div className="w-[.05em] self-stretch bg-gray-200" />
        <div className="border-[.25em] border-solid border-transparent border-t-gray-200" />
        <ul
          className={`absolute left-0 top-full m-0 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-200 bg-white p-0 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          {options.map((option) => (
            <li
              onClick={(e) => {
                e.stopPropagation();
                selectOption(option);
                setIsOpen(false);
              }}
              key={option.value}
              className={`cursor-pointer py-1 px-2 hover:bg-gray-200 ${
                isOptionSelected(option) ? "bg-gray-400 hover:bg-gray-500" : ""
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
