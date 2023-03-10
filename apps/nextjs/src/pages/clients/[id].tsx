import { Room, RoomGroup } from "@acme/db";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { NextPage } from "next"
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import AddRoomModal from "~/components/room/AddRoomModal";
import Button from "~/ui/Button";
import Input from "~/ui/Input";
import Modal from "~/ui/Modal";
import Navbar from "~/ui/Navbar";
import SectionHeading from "~/ui/SectionHeading";
import Spinner from "~/ui/Spinner";
import SubmitInput from "~/ui/SubmitInput";
import { api } from "~/utils/api"

const ClientsPage: NextPage = () => {
  const router = useRouter();
  const id = parseInt(router.query.id as string);
  const user = api.auth.getSession.useQuery();
  const { data: client, isSuccess, isLoading } = api.clients.byId.useQuery({ id }, {
    enabled: !Number.isNaN(id) && user.isSuccess
  });

  const [isAdding, setIsAdding] = useState(false);

  return (<>
    <Head>
      <title>{client?.title ?? 'Клиент...'}</title>
    </Head>
    <Navbar />
    <div className="container mx-auto">
      <SectionHeading heading={client?.title ?? 'Клиент...'}>
        <Button onClick={() => setIsAdding(true)}>
          <PlusCircleIcon className="h-5 w-5" />
        </Button>
      </SectionHeading>
      {isLoading && <Spinner />}
      {isSuccess && (
        <main className="m-4 flex flex-col justify-center gap-2 md:mx-auto md:w-2/3">
          {client.roomGroups.map((roomGroup) => (
            <RoomGroupItem key={roomGroup.id} roomGroup={roomGroup} />
          ))}
        </main>
      )}
    </div>
    {isAdding && <AddRoomGroupModal onClose={() => setIsAdding(false)} clientId={id} />}
  </>)
}

type AddRoomGroupModalProps = {
  clientId: number;
  onClose: () => void;
}

function AddRoomGroupModal({ clientId, onClose }: AddRoomGroupModalProps) {
  const utils = api.useContext();
  const addRoomGroup = api.clients.createRoomGroup.useMutation();

  const [title, setTitle] = useState('');
  const handleCreateRoomGroup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addRoomGroup.mutate({ clientId, roomGroupTitle: title }, {
      onSuccess: () => {
        utils.clients.byId.invalidate({ id: clientId })
        onClose();
      }
    })
  }
  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleCreateRoomGroup} className="flex flex-col gap-2 p-2">
        <h2 className="mb-2 text-lg font-medium">Добавить Группу</h2>
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

type RoomGroupItemProps = {
  roomGroup: RoomGroup & {
    rooms: Room[]
  }
}

function RoomGroupItem({ roomGroup }: RoomGroupItemProps) {
  const [roomsList] = useAutoAnimate();
  const [isAdding, setIsAdding] = useState(false);
  return (
    <section className="flex flex-col">
      <div className="flex justify-between">
        <h2 className="text-lg font-medium">{roomGroup.title || ""}</h2>
        <Button onClick={() => {
          setIsAdding(prev => !prev)
        }}>
          <PlusCircleIcon className="h-5 w-5" />
          <span>Добавить</span>
        </Button>
      </div>
      <ul
        ref={roomsList}
        className="m-4 flex flex-col items-center justify-center gap-2"
      >
        {roomGroup.rooms.map((room) => (
          <Link className="h-14 border rounded-md p-4 w-full hover:shadow transition-shadow"
            key={room.id}
            href={`/room/${room.id}`}
          >
            {room.title}
          </Link>
        ))}
      </ul>
      {isAdding && <AddRoomModal groupId={roomGroup.id} onClose={() => setIsAdding(false)} />}
    </section>
  )
}

export default ClientsPage;
