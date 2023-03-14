import { Cleaner } from "@acme/db";
import { EyeIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import { useState } from "react";
import Button from "~/ui/Button";
import Modal from "~/ui/Modal";
import BasicTable from "../../components/BasicTable";
import AddStaffModal from "../../components/staff/AddStaffModal";
import Navbar from "../../ui/Navbar";
import SectionHeading from "../../ui/SectionHeading";

import { api } from "../../utils/api";

export default function StaffIndex() {
  const staff = api.cleaners.list.useQuery();

  return (
    <>
      <Head>
        <title>Сотрудники</title>
      </Head>
      <Navbar />
      <div className="container mx-auto">
        <SectionHeading heading="Сотрудники" />
        {staff.isSuccess && (
          <main className="m-4 flex flex-col justify-center gap-2 md:mx-auto md:w-2/3">
            <StaffTable staff={staff.data} />
          </main>
        )}
        {staff.isLoading && <div>Loading...</div>}

      </div>
    </>
  );
}

type StaffTableProps = {
  staff: Cleaner[];
};

function StaffTable({ staff }: StaffTableProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isShowingToken, setIsShowingToken] = useState(false);
  const [currentToken, setCurrentToken] = useState('');

  const utils = api.useContext();
  const deleteCleanerById = api.cleaners.deleteById.useMutation();

  function handleAddClick() {
    setIsAdding(true);
  }

  function handleChangeClick() {
    setIsEditing((prev) => !prev);
  }

  function staffItems() {
    return staff.map((staff) => (
      <li
        key={staff.id}
        className="flex group h-14 px-4 w-full justify-between items-center rounded-md border transition-shadow hover:shadow"
      >
        <span>{staff.firstName} {staff.lastName}</span>
        <span className="hidden group-hover:transition-all group-hover:block">
          <Button onClick={() => {
            setIsShowingToken(true)
            setCurrentToken(staff.token)
          }}>
            <EyeIcon className="h-5 w-5" />
            <span>Show Token</span>
          </Button>
        </span>
        {isEditing && (
          <Button onClick={() => {
            deleteCleanerById.mutate({ id: staff.id }, {
              async onSuccess() {
                await utils.cleaners.list.invalidate();
                setIsEditing(false);
              }
            })
          }}
          >
            Удалить
          </Button>
        )}
      </li>
    ));
  }

  return (
    <>
      <BasicTable
        heading="Клинеры"
        editable={staff.length !== 0}
        items={staffItems}
        isEditing={isEditing}
        onAddClick={handleAddClick}
        onChangeClick={handleChangeClick}
      />
      {isAdding && <AddStaffModal onClose={() => setIsAdding(false)} />}
      {isShowingToken && (
        <ShowTokenModal
          onClose={() => setIsShowingToken(false)}
          token={currentToken}
        />
      )}
    </>
  );
}

type ShowTokenModalProps = {
  token: string
  onClose: () => void
}

function ShowTokenModal({ token, onClose }: ShowTokenModalProps) {
  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col gap-2 p-2">
        <h2 className="font-medium text-lg">Token</h2>
        <div>{token}</div>
      </div>
    </Modal>
  )
}
