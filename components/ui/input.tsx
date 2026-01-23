import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Renders a styled HTML input element with a predefined set of utility classes merged with any provided classes.
 *
 * @param className - Additional CSS class names to append to the component's computed class list.
 * @param type - Value for the input element's `type` attribute (e.g., `"text"`, `"email"`, `"password"`).
 * @param props - Remaining standard input props which are forwarded to the underlying input element.
 * @returns The rendered input element with composed classes, `data-slot="input"`, and forwarded props.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input h-11 w-full min-w-0 rounded-sm border bg-white px-4 py-2.5 text-base shadow-xs transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
        "focus:border-primary focus:ring-2 focus:ring-primary/10",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className,
      )}
      {...props}
    />
  );
}

export { Input };