import {
  ArrowLeftOnRectangleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { api } from "~/utils/api";
import Button from "./Button";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  console.log(session);

  return (
    <nav className="border-b bg-gray-800 px-8 py-2 md:flex md:items-center md:justify-between">
      <div>
        <span className="cursor-pointer text-xl text-gray-300">MDCleaning</span>
      </div>
      <ul className="text-gray-300 md:flex md:items-center md:gap-8">
        {session ?
          <>
            <Link
              href="/"
              className="my-4 flex items-center justify-between gap-1 rounded-md px-3 py-2 text-lg font-medium duration-300 hover:bg-gray-700 hover:text-white md:my-0"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 rotate-180" />
              <span>Комнаты</span>
            </Link>
            <Link
              href="/staff"
              className="my-4 flex items-center justify-between gap-1 rounded-md px-3 py-2 text-lg font-medium duration-300 hover:bg-gray-700 hover:text-white md:my-0"
            >
              <UsersIcon className="h-5 w-5" />
              <span>Сотрудники</span>
            </Link>
            <Button onClick={() => void signOut()}>Выйти</Button>
          </>
          :
          <>
            <Button onClick={() => void signIn()}>Войти</Button>
          </>}
      </ul>
    </nav>
  );
}
