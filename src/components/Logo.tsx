
import React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

interface LogoProps {
  className?: string;
  variant?: "default" | "light";
}

const Logo = ({ className, variant = "default" }: LogoProps) => {
  const baseClasses = cn(
    "font-heading font-bold",
    variant === "light" ? "text-black" : "text-primary",
    className
  );

  return (
    <Link to="/" className={baseClasses}>
      <div className="flex items-center gap-2 transition-all hover:scale-105 group">
        {/* Modern geometric logo */}
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-black to-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden group-hover:shadow-lg transition-all duration-300">
            {/* Animated background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent group-hover:via-white/10 transition-all duration-500"></div>
            
            {/* Main logo mark - stylized 'S' */}
            <div className="relative z-10 w-6 h-6 text-white font-black text-lg flex items-center justify-center">
              S
            </div>
            
            {/* Subtle sparkle effect */}
            <Sparkles className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 text-yellow-400 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse" />
          </div>
          
          {/* Subtle glow effect */}
          <div className="absolute inset-0 w-10 h-10 bg-black/10 rounded-lg blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
        </div>
        
        {/* Text logo with modern typography */}
        <div className="flex items-baseline">
          <span className="text-xl font-black tracking-tight bg-gradient-to-r from-black to-gray-800 bg-clip-text text-transparent">
            sponsor
          </span>
          <span className="text-gray-500 font-light text-lg ml-0.5 italic tracking-wide">
            by
          </span>
        </div>
        
        {/* Animated underline */}
        <div className="absolute bottom-0 left-10 h-0.5 bg-gradient-to-r from-black to-gray-400 w-0 group-hover:w-16 transition-all duration-300"></div>
      </div>
    </Link>
  );
};

export default Logo;
