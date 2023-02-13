import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Head from "next/head";
import { api } from "../../utils/api";
import { createSSG } from "../../utils/ssg";
import CleaningTable from "../../components/cleaning/CleaningTable";
import { RoomQR } from "../../components/room/RoomQR";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  const ssTrpc = createSSG();
  const id = parseInt(context.params?.id as string);
  try {
    await ssTrpc.rooms.findById.fetch(id);
  } catch (error) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      trpcState: ssTrpc.dehydrate(),
      id,
    },
  };
}

export default function Room({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const room = api.rooms.findById.useQuery(id);

  return (
    <>
      <Head>
        <title>{room.data?.title ?? "Комната..."}</title>
      </Head>
      <div className="container mx-auto">
        <RoomHeading title={room.data?.title ?? "Комната..."} />
        <main className="m-4 flex flex-col justify-center gap-2 md:mx-auto md:w-2/3">
          {room.isSuccess && (
            <>
              <CleaningTable
                roomId={id}
                cleanings={room.data.plannedCleanings}
              />
              <h2 className="text-lg font-medium">QR-код</h2>
              <RoomQR roomId={id} />
            </>
          )}
        </main>
      </div>
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
