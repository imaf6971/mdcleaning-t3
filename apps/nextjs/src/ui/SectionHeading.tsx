import { ReactNode } from "react";

type SectionHeadingProps = {
  heading: string
  children?: ReactNode
}

export default function SectionHeading({ children, heading }: SectionHeadingProps) {
  return (
    <div className="border-b p-3">
      <div className="flex justify-between mx-auto md:w-2/3">
        <header className="text-2xl font-semibold">{heading}</header>
        {children}
      </div>
    </div>
  );
}
