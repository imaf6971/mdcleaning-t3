import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b bg-gray-800 px-8 py-2 md:flex md:items-center md:justify-between">
      <div>
        <span className="cursor-pointer text-xl text-gray-300">MDCleaning</span>
      </div>
      <ul className="text-gray-300 md:flex md:items-center md:gap-8">
        <li className="my-4 rounded-md px-3 py-2 text-lg font-medium duration-300 hover:bg-gray-700 hover:text-white md:my-0">
          <Link href="/">Комнаты</Link>
        </li>
        <li className="my-4 rounded-md px-3 py-2 text-lg font-medium duration-300 hover:bg-gray-700 hover:text-white md:my-0">
          <Link href="/staff">Сотрудники</Link>
        </li>
      </ul>
    </nav>
  );
}
