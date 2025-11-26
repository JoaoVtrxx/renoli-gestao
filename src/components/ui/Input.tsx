"use client";

import React, { type InputHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";
import { IMaskInput } from "react-imask";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  maskOptions?: Record<string, unknown>; // Tipo mais específico que any
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, maskOptions, ...props }, ref) => {
  const inputClassName = clsx(
    "w-full bg-background border-2 border-border rounded-lg px-5 py-4 text-base min-h-[52px] focus:ring-2 focus:ring-primary focus:border-transparent",
    className
  );

  if (maskOptions) {
    return (
      <IMaskInput
        ref={ref}
        className={inputClassName}
        {...maskOptions}
        // Sobrescrever com props específicas
        value={typeof props.value === 'string' ? props.value : ''}
        onChange={props.onChange}
        onBlur={props.onBlur}
        onFocus={props.onFocus}
        name={props.name}
        placeholder={props.placeholder}
        disabled={props.disabled}
        readOnly={props.readOnly}
      />
    );
  }

  return (
    <input
      {...props}
      ref={ref}
      className={inputClassName}
    />
  );
});

Input.displayName = "Input";