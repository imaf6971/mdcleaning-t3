import type { FormEvent } from "react";
import { useState } from "react";
import Input from "../../ui/Input";
import Modal from "../../ui/Modal";
import SubmitInput from "../../ui/SubmitInput";
import { api } from "../../utils/api";

type AddStaffModalProps = {
  onClose: () => void;
};

export default function AddStaffModal({ onClose }: AddStaffModalProps) {
  const utils = api.useContext();
  const addStaff = api.cleaners.add.useMutation({
    onSuccess() {
      void utils.cleaners.invalidate();
    },
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [patronymic, setPatronymic] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    addStaff.mutate({ firstName, lastName, patronymic });
    onClose();
  }

  return (
    <Modal onClose={onClose}>
      <form className="flex flex-col gap-2 p-2" onSubmit={handleSubmit}>
        <Input
          id="addStaffFirstName"
          label="Имя"
          minLength={1}
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Input
          id="addStaffLastName"
          label="Фамилия"
          minLength={1}
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <Input
          id="addStaffPatronymic"
          label="Отчество (при наличии)"
          value={patronymic}
          onChange={(e) => setPatronymic(e.target.value)}
        />
        <SubmitInput value="Добавить" />
      </form>
    </Modal>
  );
}
