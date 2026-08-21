import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-primary-50 hover:text-primary-700",
  danger: "btn-danger",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  href?: string;
}

export function Button({
  className,
  variant = "primary",
  href,
  children,
  ...props
}: ButtonProps) {
  if (href) {
    return (
      <Link href={href} className={cn(variants[variant], className)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cn(variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
