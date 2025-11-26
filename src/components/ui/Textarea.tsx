import { type TextareaHTMLAttributes } from "react";
import clsx from "clsx";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={clsx(
        "w-full bg-background border-2 border-border rounded-lg px-5 py-4 text-base min-h-[120px] focus:ring-2 focus:ring-primary focus:border-transparent",
        className
      )}
      {...props}
    />
  );
}