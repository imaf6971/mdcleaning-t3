import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import Modal from "../../ui/Modal";
import type { SelectOption } from "../../ui/Select";
import Select from "../../ui/Select";
import Spinner from "../../ui/Spinner";
import SubmitInput from "../../ui/SubmitInput";
import TimeInput from "../../ui/TimeInput";
import { api } from "../../utils/api";

type AddCleaningModalProps = {
  roomId: number;
  onClose: () => void;
};

type Cleaner = {
  id: number;
  firstName: string;
  lastName: string;
};

// TODO: add validation
export default function AddCleaningModal({
  roomId,
  onClose,
}: AddCleaningModalProps) {
  const utils = api.useContext();
  const addCleaning = api.cleaningPlan.create.useMutation({
    onSuccess: () => {
      void utils.rooms.findById.invalidate(roomId);
    },
  });
  const cleaners = api.cleaners.list.useQuery();

  const [from, setFrom] = useState("12:00");
  const [to, setTo] = useState("12:00");
  const [cleanerId, setCleanerId] = useState<number | undefined>(undefined);

  function handleToTimeInputChange(e: ChangeEvent<HTMLInputElement>) {
    setTo(() => e.target.value);
  }

  function handleFromTimeInputChange(e: ChangeEvent<HTMLInputElement>) {
    setFrom(() => e.target.value);
  }

  function handleAddCleaningSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (cleanerId !== undefined) {
      addCleaning.mutate({ roomId, from, to, cleanerId });
    }
    onClose();
  }

  function selectedCleanerOption() {
    const search = cleaners.data?.find((cleaner) => cleaner.id === cleanerId);
    if (search === undefined) {
      return undefined;
    }
    return cleanerToOption(search);
  }

  function cleanerToOption(cleaner: Cleaner): SelectOption {
    return {
      label: `${cleaner.firstName} ${cleaner.lastName}`,
      value: cleaner.id,
    };
  }

  function mapCleanersToSelectOptions() {
    if (cleaners.isSuccess) {
      return cleaners.data.map(cleanerToOption);
    }
    return [];
  }

  function handleCleanerChange(option?: SelectOption) {
    if (option === undefined) {
      setCleanerId(undefined);
      return;
    }
    setCleanerId(option.value);
  }

  return (
    <Modal onClose={onClose}>
      <form
        onSubmit={handleAddCleaningSubmit}
        className="flex flex-col gap-2 p-2"
      >
        <h2 className="mb-2 text-lg font-medium">Назначить уборку</h2>
        <div className="flex justify-between">
          <TimeInput
            label="C:"
            id="fromCleaning"
            value={from}
            onChange={handleFromTimeInputChange}
          />
          <TimeInput
            label="По:"
            id="toCleaning"
            value={to}
            onChange={handleToTimeInputChange}
          />
        </div>
        {cleaners.isSuccess && (
          <Select
            label="Клинер"
            selectedOption={selectedCleanerOption()}
            options={mapCleanersToSelectOptions()}
            onChange={handleCleanerChange}
          />
        )}
        {cleaners.isLoading && <Spinner />}
        {cleaners.isError && <div>Error!</div>}
        <SubmitInput value="Добавить" />
      </form>
    </Modal>
  );
}
