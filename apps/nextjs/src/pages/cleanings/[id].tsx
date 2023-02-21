import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import SectionHeading from "~/ui/SectionHeading";
import Spinner from "~/ui/Spinner";
import { api } from "~/utils/api";

const Cleaning: NextPage = () => {
  const router = useRouter();
  const cleaningId = parseInt(router.query.id as string);
  const {
    data: cleaning,
    isLoading,
    isError,
    isSuccess,
  } = api.cleanings.byId.useQuery(cleaningId);

  return (
    <>
      <SectionHeading
        heading={`Чистка от ${
          cleaning?.startTime.toLocaleString() ?? "..."
        } в ${cleaning?.room.title ?? "..."}`}
      />
      {isLoading && <Spinner />}
      {isError && <span>Some internal server error...</span>}
      {isSuccess && (
        <main className="m-4 flex flex-col justify-center gap-2 md:mx-auto md:w-2/3">
          <h2 className="text-lg font-medium">Клинер ...</h2>
          <h2 className="text-lg font-medium">Фото</h2>
          <ul>
            {cleaning.cleaningPhotos.map((photo) => (
              <li key={photo.path}>
                <Image width={100} height={100} alt='cleaningPhoto' src={`/uploads/${photo.path}`} />
              </li>
            ))}
          </ul>
        </main>
      )}
    </>
  );
};

export default Cleaning;
