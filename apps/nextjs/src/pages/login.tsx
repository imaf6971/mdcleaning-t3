import { NextPage } from "next";
import Input from "~/ui/Input";

const LoginPage: NextPage = () => {

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="p-4 rounded-md shadow transition-shadow bg-white">
        <h1 className="text-xl font-medium mb-4">Войти</h1>
        <form className="flex flex-col gap-4">
          <Input label="Логин" id="login" />
          <Input type="password" label="Пароль" id="password" />
          <button
            className="flex gap-1 items-center justify-center rounded-md border p-2 transition-shadow hover:shadow focus:bg-gray-200 focus:outline-none focus:ring disabled:bg-gray-200"
          >Войти</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
