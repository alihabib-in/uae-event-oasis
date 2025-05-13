
import React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  variant?: "default" | "light";
}

const Logo = ({ className, variant = "default" }: LogoProps) => {
  const baseClasses = cn(
    "font-heading font-bold",
    variant === "light" ? "text-white" : "text-primary",
    className
  );

  return (
    <Link to="/" className={baseClasses}>
      <div className="flex items-center gap-2 transition-all hover:scale-105 logo-animate group">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold leading-none transition-all group-hover:rotate-6">
          <span className="text-sm">S</span>
        </div>
        <span className="text-xl tracking-tight transition-all">
          sponsor<span className="text-primary font-bold">by</span>
        </span>
      </div>
    </Link>
  );
};

export default Logo;
