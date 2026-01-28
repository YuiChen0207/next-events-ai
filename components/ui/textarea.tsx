import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-sm border border-input bg-white px-4 py-3 text-base placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40 transition-all duration-200 resize-y shadow-xs",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
