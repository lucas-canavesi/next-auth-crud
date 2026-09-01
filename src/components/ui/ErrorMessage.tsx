"use client";

import { HTMLAttributes, forwardRef } from "react";
import { Button } from "./Button";

export interface ErrorMessageProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const ErrorMessage = forwardRef<HTMLDivElement, ErrorMessageProps>(
  ({ title = "Erro", message, onRetry, retryLabel = "Tentar novamente", dismissible = false, onDismiss, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          p-4 rounded-lg border bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800
          flex items-start gap-3
          ${className}
        `}
        role="alert"
        {...props}
      >
        <svg
          className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-red-800 dark:text-red-200">{title}</h4>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300">{message}</p>
          <div className="mt-3 flex items-center gap-2">
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry}>
                {retryLabel}
              </Button>
            )}
            {dismissible && onDismiss && (
              <Button variant="ghost" size="sm" onClick={onDismiss}>
                Dispensar
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ErrorMessage.displayName = "ErrorMessage";

// Inline error for forms
export interface InlineErrorProps {
  message: string;
}

export function InlineError({ message }: InlineErrorProps) {
  return (
    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5" role="alert">
      <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {message}
    </p>
  );
}