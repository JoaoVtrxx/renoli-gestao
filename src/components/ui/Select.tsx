import { type SelectHTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
  className?: string;
}

export function Select({ children, className, ...props }: SelectProps) {
  return (
    <select
      className={clsx(
        "w-full bg-background border-2 border-border rounded-lg px-5 py-4 text-base min-h-[52px] focus:ring-2 focus:ring-primary focus:border-transparent",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}