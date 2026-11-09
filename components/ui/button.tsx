import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClass: Record<Variant, string> = {
  primary: "bg-marka text-na-marce hover:bg-marka-hover",
  secondary: "border border-obramowanie hover:bg-marka-blady",
  ghost: "hover:bg-marka-blady",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", children, ...props }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-md px-s py-xs text-s font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 ${variantClass[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  ),
);

Button.displayName = "Button";
