import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "light" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

// Wygląd przycisków mieszka w app/skala.css (.przycisk, .przycisk-drugi, .przycisk-jasny,
// .przycisk-cichy), żeby te same klasy działały bez Reacta, np. przy CSS modules albo na <a>.
const variantClass: Record<Variant, string> = {
  primary: "przycisk",
  secondary: "przycisk-drugi",
  light: "przycisk-jasny",
  ghost: "przycisk-cichy",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", children, ...props }, ref) => (
    <button ref={ref} className={`${variantClass[variant]} ${className}`} {...props}>
      {children}
    </button>
  ),
);

Button.displayName = "Button";
