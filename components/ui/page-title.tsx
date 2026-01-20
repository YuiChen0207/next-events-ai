import { ReactNode } from "react";

interface PageTitleProps {
  children: ReactNode;
}

export function PageTitle({ children }: PageTitleProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold">{children}</h1>
    </div>
  );
}
