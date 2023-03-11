import { useAutoAnimate } from "@formkit/auto-animate/react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import Link from "next/link";
import { FormEvent, useState } from "react";
import Button from "~/ui/Button";
import Input from "~/ui/Input";
import Modal from "~/ui/Modal";
import Spinner from "~/ui/Spinner";
import SubmitInput from "~/ui/SubmitInput";
import Navbar from "../ui/Navbar";
import SectionHeading from "../ui/SectionHeading";
import { api } from "../utils/api";

export default function Home() {
  const user = api.auth.getSession.useQuery();
  const clients = api.clients.list.useQuery(undefined, {
    enabled: user.isSuccess
  });

  const [isAdding, setIsAdding] = useState(false)

  const [clientList] = useAutoAnimate();

  return (
    <>
      <Head>
        <title>Клиенты</title>
      </Head>
      <Navbar />
      <div className="container mx-auto">
        <SectionHeading heading="Клиенты">
          <Button onClick={() => setIsAdding(true)}>
            <PlusCircleIcon className="h-5 w-5" />
          </Button>
        </SectionHeading>
        {clients.isLoading && (
          <div className="w-full flex justify-center">
            <Spinner />
          </div>
        )}
        {clients.isSuccess && (
          <main className="m-4 flex flex-col justify-center gap-2 md:mx-auto md:w-2/3">
            <ul className="flex flex-col gap-2" ref={clientList}>
              {clients.data.map((client) => (
                <Link
                  href={`/clients/${client.id}`}
                  className="flex h-14 p-4 w-full justify-between rounded-md border transition-shadow hover:shadow"
                  key={client.id}
                >
                  {client.title}
                </Link>
              ))}
            </ul>
          </main>
        )}
      </div>
      {isAdding && <AddClientModal onClose={() => setIsAdding(false)} />}
    </>
  );
}

type AddClientModalProps = {
  onClose: () => void
}

function AddClientModal({ onClose }: AddClientModalProps) {
  const utils = api.useContext();
  const addClientMutation = api.clients.create.useMutation();

  const [title, setTitle] = useState('');
  const addClient = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addClientMutation.mutate({ title }, {
      onSuccess() {
        void utils.clients.list.invalidate();
        onClose()
      }
    })
  }
  return (
    <Modal onClose={onClose}>
      <form onSubmit={addClient} className="flex flex-col gap-2 p-2">
        <h2 className="mb-2 text-lg font-medium">Добавить Клиента</h2>
        <div>
          <Input
            id="roomTitle"
            value={title}
            label="Название"
            onChange={(e) => setTitle(e.target.value)}
            required={true}
            minLength={3}
          />
        </div>
        <SubmitInput value="Добавить" />
      </form>
    </Modal>
  )
}
