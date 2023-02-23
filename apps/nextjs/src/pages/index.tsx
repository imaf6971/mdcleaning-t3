import Head from "next/head";
import RoomTable from "../components/room/RoomTable";
import Navbar from "../ui/Navbar";
import SectionHeading from "../ui/SectionHeading";
import { api } from "../utils/api";

// export async function getServerSideProps() {
//   const ssTrpc = createSSG();
//   await ssTrpc.rooms.list.prefetch();
//   return {
//     props: {
//       trpcState: ssTrpc.dehydrate(),
//     },
//   };
// }

// TODO: add navigation, login screen and animations
export default function Home() {
  const rooms = api.rooms.list.useQuery();

  return (
    <>
      <Head>
        <title>Комнаты</title>
      </Head>
      <Navbar />
      <div className="container mx-auto">
        <SectionHeading heading={'ООО "Рога и Копыта"'} />
        {rooms.isSuccess && (
          <main className="m-4 flex flex-col justify-center gap-2 md:mx-auto md:w-2/3">
            <RoomTable rooms={rooms.data} />
          </main>
        )}
        {rooms.isLoading && <div>Loading...</div>}
      </div>
    </>
  );
}
