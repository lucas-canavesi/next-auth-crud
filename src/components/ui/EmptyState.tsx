"use client";

import { HTMLAttributes, forwardRef } from "react";
import { Button, LinkButton } from "./Button";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
    variant?: "primary" | "secondary" | "outline";
  };
  icon?: React.ReactNode;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ title, description, action, icon, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          flex flex-col items-center justify-center text-center py-12 px-4
          ${className}
        `}
        {...props}
      >
        <div className="mb-4 text-gray-400 dark:text-gray-500" aria-hidden="true">
          {icon || (
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          )}
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">{description}</p>
        )}
        {action && (
          <>
            {action.href ? (
              <LinkButton as="a" variant={action.variant || "primary"} href={action.href}>
                {action.label}
              </LinkButton>
            ) : (
              <Button variant={action.variant || "primary"} onClick={action.onClick}>
                {action.label}
              </Button>
            )}
          </>
        )}
      </div>
    );
  }
);

EmptyState.displayName = "EmptyState";