"use client";

import { HTMLAttributes, forwardRef } from "react";

export interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  label?: string;
}

export const LoadingSpinner = forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ size = "md", label = "Carregando...", className = "", ...props }, ref) => {
    const sizes = {
      sm: "h-4 w-4",
      md: "h-8 w-8",
      lg: "h-12 w-12",
    };

    return (
      <div
        ref={ref}
        className={`
          inline-flex items-center justify-center
          ${className}
        `}
        role="status"
        aria-live="polite"
        {...props}
      >
        <svg
          className={`animate-spin text-blue-600 ${sizes[size]}`}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span className="sr-only">{label}</span>
      </div>
    );
  }
);

LoadingSpinner.displayName = "LoadingSpinner";

// Full page loading overlay
export interface LoadingOverlayProps {
  label?: string;
}

export function LoadingOverlay({ label = "Carregando..." }: LoadingOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" label={label} />
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </div>
  );
}