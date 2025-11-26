import type { HTMLAttributes } from "react";
import clsx from "clsx";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "secondary" | "info" | "accent";
}

export default function Badge({ 
  variant = "secondary", 
  className,
  children,
  ...props 
}: BadgeProps) {
  const baseClasses = "px-4 py-2 text-sm font-bold rounded-full";
  
  const variantClasses = {
    success: "bg-green-500 text-white",
    warning: "bg-orange-500 text-white", 
    secondary: "bg-gray-500 text-white",
    info: "bg-blue-500 text-white",
    accent: "bg-purple-500 text-white",
  };

  const badgeClasses = clsx(
    baseClasses,
    variantClasses[variant],
    className
  );

  return (
    <span className={badgeClasses} {...props}>
      {children}
    </span>
  );
}