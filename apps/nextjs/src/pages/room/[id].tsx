import { ActualCleaning } from "@acme/db";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { ChevronLeftIcon, ChevronRightIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEventHandler, useMemo, useState } from "react";
import Button from "~/ui/Button";
import Modal from "~/ui/Modal";
import Select from "~/ui/Select";
import SubmitInput from "~/ui/SubmitInput";
import CleaningTable from "../../components/cleaning/CleaningTable";
import { RoomQR } from "../../components/room/RoomQR";
import { api } from "../../utils/api";

export default function Room() {
  const router = useRouter();
  const id = parseInt(router.query.id as string);
  const { data: room, isSuccess } = api.rooms.findById.useQuery(id);

  const [animate] = useAutoAnimate();
  const [hintsList] = useAutoAnimate();

  const [isAddingHint, setIsAddingHint] = useState(false);
  return (
    <>
      <Head>
        <title>{room?.title ?? "Комната..."}</title>
      </Head>
      <div className="container mx-auto">
        <RoomHeading title={room?.title ?? "Комната..."} />
        <main className="m-4 flex flex-col justify-center gap-2 md:mx-auto md:w-2/3">
          {isSuccess && (
            <>
              <CleaningTable roomId={id} cleanings={room.plannedCleanings} />
              <h2 className="text-lg font-medium">QR-код</h2>
              <RoomQR roomId={id} />
              <h2 className="text-lg font-medium">Чистки</h2>
              {room.actualCleanings.length === 0 ? (
                "Нет чисток!"
              ) : (
                <ActualCleaningTable cleanings={room.actualCleanings} />
              )}
              <h2 className="text-lg font-medium">Отзывы</h2>
              {room.reviews.length === 0 ? (
                "Нет отзывов!"
              ) : (
                <ul ref={animate}>
                  {room.reviews.map((review) => (
                    <li key={review.id}
                      className="border rounded-md flex flex-col gap-2 p-4"
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">{review.name}</span>
                        <span>{review.createdAt.toLocaleString()}</span>
                      </div>
                      <div>{review.text}</div>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex justify-between">
                <h2 className="text-lg font-medium">Подсказки</h2>
                <Button onClick={() => setIsAddingHint(true)}>
                  <PlusCircleIcon className="h-5 w-5" />
                  <span>Добавить</span>
                </Button>
                {isAddingHint && <AddHintModal roomId={room.id} onClose={() => setIsAddingHint(false)} />}
              </div>
              <ul ref={hintsList}>
                {room.items.map((hint) => (
                  <li className="h-14 rounded-md border px-2 flex items-center justify-between" key={hint.id}>
                    {hint.title}
                  </li>
                ))}
              </ul>
            </>
          )}
        </main>
      </div>
    </>
  );
}

type AddHintModalProps = {
  roomId: number;
  onClose: () => void;
}

function AddHintModal({ roomId, onClose }: AddHintModalProps) {
  const { data: items } = api.item.list.useQuery();

  const [selectedItem, setSelectedItem] = useState<number>();
  const options = items?.map(item => ({
    label: item.title,
    value: item.id
  })) ?? [];
  const selectedOption = options.find((option) => option.value === selectedItem)

  const utils = api.useContext();
  const addHintToRoom = api.rooms.addHint.useMutation();
  const handleAddItem: FormEventHandler = (e) => {
    e.preventDefault();
    if (selectedItem === undefined) {
      return;
    }
    addHintToRoom.mutate({ roomId, itemId: selectedItem }, {
      onSuccess() {
        utils.rooms.findById.invalidate(roomId)
          .then(onClose)
          .catch(onClose)
      }
    })
  }

  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleAddItem} className="flex flex-col gap-2 p-2">
        <h2 className="mb-2 text-lg font-medium">Добавить Hint</h2>
        <Select
          selectedOption={selectedOption}
          label=""
          onChange={(opt) => setSelectedItem(opt?.value ?? -1)}
          options={options} />
        <SubmitInput value="Add" />
      </form>
    </Modal>
  )
}

const pageArray = <T,>(page: number, pageSize: number, arr: T[]) =>
  arr.filter(
    (_, idx) => idx + 1 > (page - 1) * pageSize && idx + 1 < page * pageSize,
  );

function ActualCleaningTable({ cleanings }: { cleanings: ActualCleaning[] }) {
  const [animate] = useAutoAnimate();
  const [page, setPage] = useState(1);
  const maxPage = Math.ceil(cleanings.length / 10);
  const filteredCleanings = useMemo(
    () => pageArray(page, 10, cleanings),
    [cleanings, page],
  );
  return (
    <>
      <nav
        className="flex items-center justify-between pt-4"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          Показано{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {page * 10 - 9}-{page === maxPage ? cleanings.length : page * 10}{" "}
          </span>
          из{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {cleanings.length}
          </span>
        </span>
        <ul className="inline-flex items-center -space-x-px">
          <li>
            <button
              onClick={(e) => {
                e.preventDefault();
                setPage((page) => {
                  if (page - 1 === 0) {
                    return page;
                  }
                  return page - 1;
                });
              }}
              className="ml-0 block rounded-l-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
          </li>
          <li>
            <a
              href="#"
              className="border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              1
            </a>
          </li>
          <li>
            <a
              href="#"
              className="border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              2
            </a>
          </li>
          <li>
            <a
              href="#"
              aria-current="page"
              className="z-10 border border-blue-300 bg-blue-50 px-3 py-2 leading-tight text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            >
              {page}
            </a>
          </li>
          <li>
            <a
              href="#"
              className="border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              ...
            </a>
          </li>
          <li>
            <a
              href="#"
              className="border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              {maxPage}
            </a>
          </li>
          <li>
            <button
              onClick={(e) => {
                e.preventDefault();
                setPage((page) => {
                  if (page + 1 >= maxPage) {
                    return maxPage;
                  }
                  return page + 1;
                });
              }}
              className="block rounded-r-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </li>
        </ul>
      </nav>
      <table className="w-full text-left text-sm text-gray-500">
        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
          <tr>
            <th scope="col" className="rounded-l-lg px-6 py-3">
              Клинер
            </th>
            <th scope="col" className="px-6 py-3">
              Время начала
            </th>
            <th scope="col" className="px-6 py-3">
              Время конца
            </th>
            <th scope="col" className="px-6 py-3">
              Статус
            </th>
            <th scope="col" className="rounded-r-lg px-6 py-3">
              Действия
            </th>
          </tr>
        </thead>
        <tbody ref={animate}>
          {filteredCleanings.map((cleaning) => (
            <tr className="border-b bg-white" key={cleaning.id}>
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900"
              >
                Маликов В. А.
              </th>
              <td className="px-4 py-4">
                {cleaning.startTime.toLocaleString()}
              </td>
              <td className="px-4 py-4">
                {cleaning.finishTime?.toLocaleString()}
              </td>
              <td className="px-6 py-4 text-white">
                {cleaning.finishTime === null ? (
                  <span className="rounded-md bg-orange-500 p-2">
                    В процессе
                  </span>
                ) : (
                  <span className="rounded-md bg-green-500 p-2">Выполнено</span>
                )}
              </td>
              <td className="px-6 py-4">
                <Link
                  className="rounded-md border p-2 transition-shadow hover:shadow focus:bg-gray-200 focus:outline-none focus:ring"
                  href={`/cleanings/${cleaning.id}`}
                >
                  Подробнее
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function RoomHeading({ title }: { title: string }) {
  return (
    <header className="border-b p-3 md:px-0">
      <div className="mx-auto md:w-2/3">
        <Link className="flex items-center gap-2" href="/">
          <ArrowLeftIcon className="h-5 w-5" />
          <h1 className="text-2xl font-semibold">{title}</h1>
        </Link>
      </div>
    </header>
  );
}
