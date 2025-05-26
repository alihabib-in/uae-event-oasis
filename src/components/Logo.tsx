
import React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Calendar, Sparkles, Star } from "lucide-react";

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
      <div className="flex items-center gap-3 transition-all hover:scale-105 logo-animate group">
        <div className="relative">
          {/* Main logo container */}
          <div className="w-12 h-12 bg-gradient-to-br from-black via-gray-800 to-black rounded-xl flex items-center justify-center text-white font-bold leading-none transition-all group-hover:rotate-6 shadow-lg relative overflow-hidden">
            {/* Background sparkle effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Main icon */}
            <Calendar className="w-6 h-6 relative z-10" />
            
            {/* Floating sparkles */}
            <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse" />
            <Star className="absolute -bottom-1 -left-1 w-2 h-2 text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-700 animate-bounce" />
          </div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 w-12 h-12 bg-black/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        </div>
        
        {/* Text logo */}
        <div className="flex flex-col">
          <span className="text-2xl tracking-tight transition-all leading-none">
            <span className="font-black bg-gradient-to-r from-black via-gray-700 to-black bg-clip-text text-transparent">sponsor</span>
            <span className="text-gray-600 font-light italic ml-1">by</span>
          </span>
          <div className="h-0.5 bg-gradient-to-r from-black via-gray-400 to-transparent w-0 group-hover:w-full transition-all duration-500 mt-1"></div>
        </div>
        
        {/* Animated dots */}
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="w-1 h-1 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1 h-1 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </Link>
  );
};

export default Logo;
