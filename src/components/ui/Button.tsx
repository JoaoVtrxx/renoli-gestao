import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "info" | "accent";
  size?: "default" | "lg";
  className?: string;
}

export default function Button({ 
  variant = "primary",
  size = "default",
  className, 
  children, 
  ...props 
}: ButtonProps) {
  const baseClasses = "rounded-lg font-semibold shadow-sm transition-colors";
  
  const variantClasses = {
    primary: "bg-primary text-black hover:bg-primary/90",
    secondary: "bg-white text-gray-900 hover:bg-gray-50",
    success: "bg-green-600 hover:bg-green-700 text-white",
    info: "bg-blue-600 hover:bg-blue-700 text-white",
    accent: "bg-purple-600 hover:bg-purple-700 text-white",
  };

  const sizeClasses = {
    default: "px-6 py-3 text-sm",
    lg: "p-6 text-lg text-left w-full",
  };

  const buttonClasses = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
}