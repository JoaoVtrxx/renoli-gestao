"use client";

import React, { type InputHTMLAttributes } from "react";
import clsx from "clsx";
import { useIMask } from "react-imask";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  maskOptions?: Parameters<typeof useIMask>[0];
}

export function Input({ className, maskOptions, ...props }: InputProps) {
  const inputClassName = clsx(
    "w-full bg-background border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent",
    className
  );

  const { ref } = useIMask(maskOptions ?? {});

  if (maskOptions) {
    return (
      <input
        {...props}
        ref={ref as React.RefObject<HTMLInputElement>}
        className={inputClassName}
      />
    );
  }

  return (
    <input
      className={inputClassName}
      {...props}
    />
  );
}