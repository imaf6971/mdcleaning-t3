import Head from "next/head";
import { useRouter } from "next/router";
import type { FormEvent } from "react";
import { useRef } from "react";
import Input from "../../../ui/Input";
import SectionHeading from "../../../ui/SectionHeading";
import Spinner from "../../../ui/Spinner";
import SubmitInput from "../../../ui/SubmitInput";
import TextArea from "../../../ui/TextArea";
import { api } from "../../../utils/api";

// TODO: getServerSideProps an roomId: number
// TODO use react-hook-form
export default function RoomReviewPage() {
  const addReview = api.rooms.addReview.useMutation();
  const router = useRouter();
  const roomId = parseInt(router.query.id as string);
  const form = useRef<HTMLFormElement>(null); // TODO: properly type it

  function handleReviewFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { reviewName, reviewText } = form.current.elements;
    addReview.mutate({
      roomId,
      name: reviewName.value,
      text: reviewText.value,
    });
  }

  return (
    <>
      <Head>
        <title>Оставить отзыв</title>
      </Head>
      <div className="container mx-auto">
        <SectionHeading heading="Оставить отзыв" />
        <main
          className={`m-4 flex h-[80vh] ${
            addReview.isLoading ? "items-center justify-center" : ""
          } flex-col gap-2 md:mx-auto md:w-2/3`}
        >
          {addReview.isSuccess && (
            <div>
              <div>Спасибо за отзыв!</div>
              <div>Страницу можно закрыть :)</div>
            </div>
          )}
          {addReview.isLoading && <Spinner />}
          {addReview.isIdle && (
            <form
              ref={form}
              className="flex flex-col gap-4"
              onSubmit={handleReviewFormSubmit}
            >
              <Input
                minLength={3}
                id="reviewName"
                label="Ваше имя:"
                required
                // value={name}
                // onChange={(e) => setName(e.target.value)}
              />
              <TextArea
                id="reviewText"
                label="Оставьте отзыв о нашей работе:"
                required
                // value={text}
                // onChange={(e) => setText(e.target.value)}
              />
              <SubmitInput value="Отправить" />
            </form>
          )}
        </main>
      </div>
    </>
  );
}
