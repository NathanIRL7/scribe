"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export function Card({
  children,
  className = "",
  padding = "md",
  onClick,
}: CardProps) {
  const paddings = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`bg-card rounded-lg border border-border ${paddings[padding]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
