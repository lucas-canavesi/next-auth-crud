"use client";

import { HTMLAttributes, forwardRef } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "destructive" | "info" | "outline";
  size?: "sm" | "md";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = "default", size = "md", className = "", ...props }, ref) => {
    const variants = {
      default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
      success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      destructive: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      outline: "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 bg-transparent",
    };

    const sizes = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-1 text-xs",
    };

    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center font-medium rounded-full
          ${variants[variant]} ${sizes[size]} ${className}
        `}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";