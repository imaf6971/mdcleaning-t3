import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import type { MouseEventHandler } from "react";
import Button from "../../ui/Button";

type RoomItemProps = {
  id: number;
  title: string;
  isEditing: boolean;
  onRedo: MouseEventHandler<HTMLButtonElement>;
  onDelete: MouseEventHandler<HTMLButtonElement>;
};

export default function RoomItem({
  id,
  title,
  isEditing,
  onRedo,
  onDelete,
}: RoomItemProps) {
  if (isEditing) {
    return (
      <div className="flex h-14 w-full items-center justify-between rounded-md border py-2 px-4 transition-shadow hover:shadow">
        <div>{title}</div>
        <div className="flex gap-2">
          <Button onClick={onRedo}>
            <PencilIcon className="h-6" />
          </Button>
          <Button onClick={onDelete}>
            <TrashIcon className="h-6" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/room/${id}`}
      className="flex h-14 w-full items-center justify-between rounded-md border py-2 px-4 transition-shadow hover:shadow"
    >
      <div>{title}</div>
    </Link>
  );
}
