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
  const [isAdding, setIsAdding] = useState(false);

  function roomLinks() {
    return rooms.map((room) => (
      <RoomItem id={room.id} title={room.title} key={room.id} />
    ));
  }

  function handleAddRoomClick() {
    setIsAdding(true);
  }

  return (
    <>
      <BasicTable
        heading="1 этаж"
        items={roomLinks}
        // isEditing={isEditing}
        editable={false}
        onAddClick={handleAddRoomClick}
        // onChangeClick={handleEditRoomClick}
      />
      {isAdding && <AddRoomModal onClose={() => setIsAdding(false)} />}
    </>
  );
}
