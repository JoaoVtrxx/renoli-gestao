import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  const baseClasses = "bg-white rounded-lg shadow-sm p-8";
  const combinedClasses = className 
    ? `${baseClasses} ${className}` 
    : baseClasses;

  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
}