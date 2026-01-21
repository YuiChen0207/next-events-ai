import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-1",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 border border-primary shadow-sm hover:shadow-md",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 border border-destructive shadow-sm hover:shadow-md",
        outline:
          "border border-border bg-background hover:bg-muted/50 hover:border-foreground/20 shadow-xs",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/70 border border-border",
        ghost:
          "hover:bg-muted/30 hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
      },
      size: {
        default: "h-11 px-6 py-2.5 rounded-sm has-[>svg]:px-4",
        sm: "h-9 px-4 py-2 rounded-sm gap-1.5 text-xs has-[>svg]:px-3",
        lg: "h-12 px-8 py-3 rounded-sm text-base has-[>svg]:px-6",
        icon: "size-10 rounded-sm",
        "icon-sm": "size-9 rounded-sm",
        "icon-lg": "size-11 rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
