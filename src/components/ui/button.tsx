import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

const styles: Record<Variant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400",
  secondary: "border border-gray-700 bg-gray-800 text-gray-100 hover:bg-gray-700",
  danger: "border border-red-700 bg-red-950/40 text-red-200 hover:bg-red-900/60",
  ghost: "text-gray-200 hover:bg-gray-800",
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