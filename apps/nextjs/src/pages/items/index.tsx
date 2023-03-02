import { useAutoAnimate } from "@formkit/auto-animate/react";
import { NextPage } from "next"
import Head from "next/head";
import Navbar from "~/ui/Navbar"
import SectionHeading from "~/ui/SectionHeading";
import Spinner from "~/ui/Spinner";
import { api } from "~/utils/api";

const ItemsPage: NextPage = () => {
  const { data: items, isLoading, isError, isSuccess } = api.item.list.useQuery();

  const itemList = useAutoAnimate();
  return (
    <>
      <Head>
        <title>Инвентарь</title>
      </Head>
      <Navbar />
      <SectionHeading heading="Инвентарь" />
      <main className="m-4 flex flex-col justify-center gap-2 md:mx-auto md:w-2/3">
        {isLoading && <Spinner />}
        {isSuccess && <ul ref={itemList}>
          {items.map((i) => (
            <li key={i.id}>
              {i.title}
            </li>
          ))}
        </ul>
        }
      </main>
    </>
  )
}

export default ItemsPage;
