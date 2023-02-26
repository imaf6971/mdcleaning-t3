import { NextPage } from "next"
import Head from "next/head";
import Navbar from "~/ui/Navbar"

const ItemsPage: NextPage = () => {
  return (
    <>
    <Head>
      <title>Инвентарь</title>
    </Head>
    <Navbar />
    </>
  )
}

export default ItemsPage;
