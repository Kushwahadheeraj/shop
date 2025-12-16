"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Lightweight separator without Radix dependency for better stability
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  const isVertical = orientation === "vertical";

  return (
    <div
      data-slot="separator"
      role={decorative ? "none" : "separator"}
      aria-orientation={orientation}
      className={cn(
        "bg-border shrink-0",
        isVertical ? "w-px h-full" : "h-px w-full",
        className
      )}
      {...props}
    />
  );
}

export { Separator };
