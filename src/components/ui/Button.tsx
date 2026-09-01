"use client";

import { ButtonHTMLAttributes, AnchorHTMLAttributes, forwardRef } from "react";

interface ButtonBaseProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "success";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
}

type ButtonProps = ButtonBaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button"; href?: never };
type LinkProps = ButtonBaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a"; href: string };

export type PolymorphicButtonProps = ButtonProps | LinkProps;

const baseStyles = `
  inline-flex items-center justify-center gap-2 font-medium rounded-lg
  focus:outline-none focus:ring-2 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-colors duration-200
`;

const variants: Record<string, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
  outline: "border border-gray-300 bg-transparent hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-600 dark:hover:bg-gray-800 dark:text-gray-100",
  ghost: "bg-transparent hover:bg-gray-100 focus:ring-gray-500 dark:hover:bg-gray-800",
  destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
};

const sizes: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

const loadingSvg = (
  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "primary", size = "md", loading, disabled = false, className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        aria-busy={loading}
        disabled={disabled || loading}
        {...props}
      >
        {loading && loadingSvg}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

const LinkButton = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ children, variant = "primary", size = "md", loading, disabled = false, className = "", href, ...props }, ref) => {
    return (
      <a
        ref={ref}
        href={href}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        tabIndex={disabled || loading ? -1 : undefined}
        {...props}
      >
        {loading && loadingSvg}
        {children}
      </a>
    );
  }
);

LinkButton.displayName = "LinkButton";

export { Button, LinkButton };
export type { ButtonProps, LinkProps };