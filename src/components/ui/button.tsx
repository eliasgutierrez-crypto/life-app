import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

const styles: Record<Variant, string> = {
  primary: "bg-black text-white hover:bg-gray-800",
  secondary: "border bg-white text-gray-900 hover:bg-gray-50",
  danger: "border border-red-300 text-red-700 hover:bg-red-50",
  ghost: "text-gray-700 hover:bg-gray-100",
};

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type LinkProps = CommonProps & { href: string };

export function Button(props: ButtonProps | LinkProps) {
  const { variant = "primary", className = "", children, ...rest } = props;
  const base = `inline-flex items-center justify-center rounded px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${styles[variant]} ${className}`;

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={base}>
        {children}
      </Link>
    );
  }

  return (
    <button {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)} className={base}>
      {children}
    </button>
  );
}