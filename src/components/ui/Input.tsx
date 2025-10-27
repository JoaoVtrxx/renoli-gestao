import { type InputHTMLAttributes } from "react";
import clsx from "clsx";
import InputMask from "react-input-mask";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  mask?: string;
}

export function Input({ className, mask, ...props }: InputProps) {
  const inputClassName = clsx(
    "w-full bg-background border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent",
    className
  );

  if (mask) {
    return (
      <InputMask mask={mask} {...props}>
        {(inputProps: InputHTMLAttributes<HTMLInputElement>) => (
          <input
            {...inputProps}
            className={inputClassName}
          />
        )}
      </InputMask>
    );
  }

  return (
    <input
      className={inputClassName}
      {...props}
    />
  );
}