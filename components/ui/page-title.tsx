import { ReactNode } from "react";

interface PageTitleProps {
  children: ReactNode;
}

/**
 * Renders the page-level title as a styled <h1>.
 *
 * @param children - Content to display inside the title
 * @returns The heading element containing `children`
 */
export function PageTitle({ children }: PageTitleProps) {
  return (
    <div className="mb-12 pb-6 border-b border-border/40">
      <h1 className="text-5xl font-serif font-light tracking-tight text-foreground">
        {children}
      </h1>
    </div>
  );
}