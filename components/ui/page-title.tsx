import { ReactNode } from "react";

interface PageTitleProps {
  children: ReactNode;
}

export function PageTitle({ children }: PageTitleProps) {
  return (
    <div className="mb-12 pb-6 border-b border-border/40">
      <h1 className="text-5xl font-serif font-light tracking-tight text-foreground">
        {children}
      </h1>
    </div>
  );
}
