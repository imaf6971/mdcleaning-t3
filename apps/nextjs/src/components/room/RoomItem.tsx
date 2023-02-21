import Link from "next/link";

type RoomItemProps = {
  id: number;
  title: string;
};

export default function RoomItem({ id, title }: RoomItemProps) {
  return (
    <li className="flex w-full justify-between rounded-md border transition-shadow hover:shadow">
      <Link
        className="flex h-14 w-full items-center justify-between px-4"
        href={`/room/${id}`}
      >
        <div>{title}</div>
      </Link>
    </li>
  );
}
