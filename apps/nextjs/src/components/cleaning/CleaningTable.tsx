import { TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { api } from "../../utils/api";
import BasicTable from "../BasicTable";
import AddCleaningModal from "./AddCleaningModal";

type Staff = {
  firstName: string;
  lastName: string;
};

type Cleaning = {
  id: number;
  from: string;
  to: string;
  cleaner: Staff;
};

type CleaningTableProps = {
  roomId: number;
  cleanings: Cleaning[];
};

export default function CleaningTable({
  roomId,
  cleanings,
}: CleaningTableProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showAddCleaningModal, setShowAddCleaningModal] = useState(false);

  const utils = api.useContext();
  const deleteCleaning = api.cleaningPlan.deleteById.useMutation({
    onSuccess: () => {
      void utils.rooms.findById.invalidate(roomId);
    },
  });

  function handleCleaningDelete(id: number) {
    deleteCleaning.mutate(id, {
      onSuccess() {
        setIsEditing(false);
      },
    });
  }

  function handleOnChangeClick() {
    setIsEditing((prev) => !prev);
  }

  function handleOnAddClick() {
    setShowAddCleaningModal(true);
  }

  function cleaningItems() {
    return cleanings.map((cleaning, idx) => (
      <div
        key={cleaning.id}
        className="flex w-full items-center justify-between rounded-md border p-3 transition-shadow hover:shadow"
      >
        <div className="">{idx + 1}.</div>
        <div className="">{`${cleaning.from} - ${cleaning.to}`}</div>
        <div className="">
          {cleaning.cleaner.firstName} {cleaning.cleaner.lastName[0]}.
        </div>
        {isEditing && (
          <button
            onClick={() => handleCleaningDelete(cleaning.id)}
            className="rounded-md border p-1 hover:cursor-pointer"
          >
            <TrashIcon className="h-6" />
          </button>
        )}
      </div>
    ));
  }

  return (
    <>
      <BasicTable
        editable={cleanings.length !== 0}
        items={cleaningItems}
        onAddClick={handleOnAddClick}
        isEditing={isEditing}
        onChangeClick={handleOnChangeClick}
        heading="График уборки"
      />
      {showAddCleaningModal && (
        <AddCleaningModal
          roomId={roomId}
          onClose={() => {
            setShowAddCleaningModal(false);
          }}
        />
      )}
    </>
  );
}
