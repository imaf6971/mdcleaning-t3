import { useState } from "react";
import { api } from "../../utils/api";
import BasicTable from "../BasicTable";
import AddRoomModal from "./AddRoomModal";
import RoomItem from "./RoomItem";

type Room = {
  id: number;
  title: string;
};

type RoomTableProps = {
  rooms: Room[];
};

export default function RoomTable({ rooms }: RoomTableProps) {
  const utils = api.useContext();
  const deleteRoom = api.rooms.deleteById.useMutation({
    onSuccess() {
      void utils.rooms.list.invalidate();
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  function roomLinks() {
    return rooms.map((room) => (
      <RoomItem
        isEditing={isEditing}
        onRedo={() => {
          // make ts happy
        }}
        onDelete={() => handleRoomDeleteClick(room.id)}
        id={room.id}
        title={room.title}
        key={room.id}
      />
    ));
  }

  function handleRoomDeleteClick(roomId: number) {
    deleteRoom.mutate(roomId);
  }

  function handleAddRoomClick() {
    setIsAdding(true);
  }

  function handleEditRoomClick() {
    setIsEditing((prev) => !prev);
  }

  return (
    <>
      <BasicTable
        heading="1 этаж"
        items={roomLinks}
        isEditing={isEditing}
        onAddClick={handleAddRoomClick}
        onChangeClick={handleEditRoomClick}
      />
      {isAdding && <AddRoomModal onClose={() => setIsAdding(false)} />}
    </>
  );
}
