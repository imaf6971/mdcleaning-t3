export default function SectionHeading({ heading }: { heading: string }) {
  return (
    <div className="border-b p-3">
      <div className="mx-auto md:w-2/3">
        <header className="text-2xl font-semibold">{heading}</header>
      </div>
    </div>
  );
}
