import Head from "next/head";
import { useState } from "react";
import Button from "~/ui/Button";
import BasicTable from "../../components/BasicTable";
import AddStaffModal from "../../components/staff/AddStaffModal";
import Navbar from "../../ui/Navbar";
import SectionHeading from "../../ui/SectionHeading";
import { api } from "../../utils/api";
import { createSSG } from "../../utils/ssg";
export async function getServerSideProps() {
  const ssTrpc = createSSG();
  await ssTrpc.cleaners.list.prefetch();
  return {
    props: {
      trpcState: ssTrpc.dehydrate(),
    },
  };
}

export default function StaffIndex() {
  const { data: session } = api.auth.getSession.useQuery();
  

  const staff = api.cleaners.list.useQuery();

  if (session?.user) { console.log('lol') } else { console.log('not lol') }

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

type Staff = {
  id: number;
  firstName: string;
  lastName: string;
};

type StaffTableProps = {
  staff: Staff[];
};

function StaffTable({ staff }: StaffTableProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

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
        className="flex h-14 px-4 w-full justify-between items-center rounded-md border transition-shadow hover:shadow"
      >
        <span>{staff.firstName} {staff.lastName}</span>
        {isEditing && <Button onClick={() => {
          deleteCleanerById.mutate({ id: staff.id }, {
            onSuccess: () => setIsEditing(false),
          })
        }}>Удалить</Button>}
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
    </>
  );
}
