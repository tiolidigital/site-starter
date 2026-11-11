import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "light" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

// Wygląd przycisków mieszka w app/skala.css (.przycisk, .przycisk-drugi, .przycisk-jasny),
// żeby te same klasy działały bez Reacta, np. przy CSS modules albo na <a>.
const variantClass: Record<Variant, string> = {
  primary: "przycisk",
  secondary: "przycisk-drugi",
  light: "przycisk-jasny",
  ghost:
    "inline-flex items-center justify-center rounded-m px-s py-xs text-s font-medium transition-colors hover:bg-marka-blady disabled:pointer-events-none disabled:opacity-50",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", children, ...props }, ref) => (
    <button ref={ref} className={`${variantClass[variant]} ${className}`} {...props}>
      {children}
    </button>
  ),
);

Button.displayName = "Button";
