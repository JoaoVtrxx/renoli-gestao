import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "info" | "accent";
  className?: string;
}

export default function Button({ 
  variant = "primary", 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  const baseClasses = "rounded-lg text-lg font-semibold shadow-sm transition-colors p-6 text-left w-full";
  
  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-white text-gray-900 hover:bg-gray-50",
    success: "bg-green-600 hover:bg-green-700 text-white",
    info: "bg-blue-600 hover:bg-blue-700 text-white",
    accent: "bg-purple-600 hover:bg-purple-700 text-white",
  };

  const buttonClasses = clsx(
    baseClasses,
    variantClasses[variant],
    className
  );

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
}