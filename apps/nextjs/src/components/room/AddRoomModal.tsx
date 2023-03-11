import Input from "../../ui/Input";
import Modal from "../../ui/Modal";
import SubmitInput from "../../ui/SubmitInput";
import { api } from "../../utils/api";
import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";

type AddRoomModalProps = {
  onClose: () => void;
  groupId: number;
};

export default function AddRoomModal({ onClose, groupId }: AddRoomModalProps) {
  const utils = api.useContext();
  const addRooms = api.rooms.add.useMutation({
    onSuccess() {
      void utils.clients.byId.invalidate();
    }
  });
  const [roomTitle, setRoomTitle] = useState("");

  function handleAddRoomSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    addRooms.mutate({ title: roomTitle, groupId });
    onClose();
  }

  function handleRoomTitleChange(e: ChangeEvent<HTMLInputElement>) {
    setRoomTitle(e.target.value);
  }

  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleAddRoomSubmit} className="flex flex-col gap-2 p-2">
        <h2 className="mb-2 text-lg font-medium">Добавить Комнату</h2>
        <div>
          <Input
            id="roomTitle"
            value={roomTitle}
            label="Название"
            onChange={handleRoomTitleChange}
            required={true}
            minLength={3}
          />
        </div>
        <SubmitInput value="Добавить" />
      </form>
    </Modal>
  );
}
