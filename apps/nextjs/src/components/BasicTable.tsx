import { useAutoAnimate } from "@formkit/auto-animate/react";
import type { MouseEventHandler } from "react";
import Button from "../ui/Button";

type BasicTableProps = {
  heading?: string;
  items: () => JSX.Element[] | undefined;
  isEditing?: boolean;
  onChangeClick?: MouseEventHandler<HTMLButtonElement>;
  onAddClick: MouseEventHandler<HTMLButtonElement>;
  editable: boolean;
};

export default function BasicTable({
  heading,
  items,
  isEditing,
  onChangeClick,
  onAddClick,
  editable,
}: BasicTableProps) {
  const [list] = useAutoAnimate();
  return (
    <section className="flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">{heading || " "}</h2>
        <div className="flex gap-2">
          {editable &&
            (isEditing ? (
              <Button onClick={onChangeClick}>Отмена</Button>
            ) : (
              <Button onClick={onChangeClick}>Изменить</Button>
            ))}
          <Button onClick={onAddClick}>Добавить</Button>
        </div>
      </div>
      <ul
        ref={list}
        className="m-4 flex flex-col items-center justify-center gap-2"
      >
        {items()}
      </ul>
    </section>
  );
}
