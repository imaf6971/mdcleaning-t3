import { useAutoAnimate } from "@formkit/auto-animate/react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { NextPage } from "next";
import Head from "next/head";
import { FormEventHandler, useState } from "react";
import Button from "~/ui/Button";
import Input from "~/ui/Input";
import Modal from "~/ui/Modal";
import Navbar from "~/ui/Navbar";
import SectionHeading from "~/ui/SectionHeading";
import Spinner from "~/ui/Spinner";
import SubmitInput from "~/ui/SubmitInput";
import { api } from "~/utils/api";

const ItemsPage: NextPage = () => {
  const { data: items, isLoading, isError, isSuccess } = api.item.list.useQuery();

  const [itemList] = useAutoAnimate();
  const [isAdding, setIsAdding] = useState(false);
  return (
    <>
      <Head>
        <title>Инвентарь</title>
      </Head>
      <Navbar />
      <SectionHeading heading="Инвентарь">
        <Button onClick={() => setIsAdding(true)}>
          <PlusCircleIcon className="h-5 w-5" />
        </Button>
      </SectionHeading>
      <main className="m-4 flex flex-col justify-center gap-2 md:mx-auto md:w-2/3">
        {isLoading && (
          <div className="w-full mx-auto">
            <Spinner />
          </div>
        )}
        {isSuccess && (
          <ul className="flex flex-col gap-2" ref={itemList}>
            {items.map((i) => (
              <li
                className="flex h-14 p-4 w-full justify-between rounded-md border transition-shadow hover:shadow"
                key={i.id}>
                {i.title}
              </li>
            ))}
          </ul>
        )}
        {isError && <span>Some error ocquired!!!</span>}
      </main>
      {isAdding && <AddItemModal onClose={() => setIsAdding(false)} />}
    </>
  )
}

type AddItemModalProps = {
  onClose: () => void
}

function AddItemModal({ onClose }: AddItemModalProps) {
  const utils = api.useContext()
  const addItem = api.item.add.useMutation();
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [img, setImg] = useState('');

  const handleAddItem: FormEventHandler = (e) => {
    e.preventDefault();
    addItem.mutate({ title, description, img }, {
      onSuccess() {
        void utils.item.list.invalidate();
      }
    })
  }
  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleAddItem} className="flex flex-col gap-2 p-2">
        <h2 className="mb-2 text-lg font-medium">Добавить Предмет</h2>
        <div>
          <Input
            id="itemTitle"
            value={title}
            label="Название"
            onChange={(e) => setTitle(e.target.value)}
            required
            minLength={3}
          />
        </div>
        <div>
          <Input
            id="itemDescription"
            value={description}
            label="Описание"
            onChange={e => setDescription(e.target.value)}
            required
            minLength={3}
          />
        </div>
        <input type='file' onChange={(e) => {
          const file = e.target.files?.[0];
          if (file === undefined) {
            return;
          }
          blobToBase64(file)
            .then((val) => setImg(val))
            .catch(err => console.log(err))
        }} />
        <SubmitInput value="Добавить" />
      </form>
    </Modal>
  )
}

function blobToBase64(blob: Blob) {
  return new Promise<string>((res) => {
    const reader = new FileReader();
    reader.onloadend = () => res(reader.result as string)
    reader.readAsDataURL(blob)
  })
}

export default ItemsPage;
