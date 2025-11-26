import { type LabelHTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  className?: string;
}

export function Label({ children, className, ...props }: LabelProps) {
  return (
    <label
      className={clsx(
        "text-base font-semibold text-foreground mb-2 block",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}