export default function SubmitInput({ value }: { value: string }) {
  return (
    <input
      className="rounded-md border p-2 transition-shadow hover:shadow focus:bg-gray-200 focus:outline-none focus:ring"
      type="submit"
      value={value}
    />
  );
}
