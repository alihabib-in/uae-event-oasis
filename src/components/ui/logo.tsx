
import { CalendarHeart } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "light";
}

const Logo = ({ size = "md", variant = "default" }: LogoProps) => {
  const iconRef = useRef<SVGSVGElement>(null);

  const sizeClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
  };

  const textClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const variantClasses = {
    default: "text-white",
    light: "text-primary-foreground",
  };
  
  // Animation effect
  useEffect(() => {
    const icon = iconRef.current;
    if (!icon) return;
    
    const animateIcon = () => {
      // Gentle pulse animation
      icon.animate([
        { transform: 'scale(1)', opacity: 0.9 },
        { transform: 'scale(1.1)', opacity: 1 },
        { transform: 'scale(1)', opacity: 0.9 }
      ], {
        duration: 2000,
        iterations: Infinity,
        easing: 'ease-in-out'
      });
    };
    
    animateIcon();
  }, []);

  return (
    <Link to="/" className="flex items-center">
      <div className={`flex items-center gap-2 ${variantClasses[variant]}`}>
        <div className="relative">
          <CalendarHeart 
            ref={iconRef} 
            className={`${sizeClasses[size]} text-primary`} 
            strokeWidth={1.5} 
          />
          <div className="absolute -right-1 -bottom-1 bg-accent rounded-full p-0.5 border-2 border-background animate-pulse">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
              <path d="M18 8a1 1 0 0 1-1-1V5h-2a1 1 0 0 1 0-2h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1Z" fill="currentColor" />
              <path d="M21 22H3c-1.103 0-2-.897-2-2V7c0-1.103.897-2 2-2h7v2H3v13h18v-6h2v6c0 1.103-.897 2-2 2Z" fill="currentColor" />
              <path d="M7 14a1 1 0 0 1-.707-1.707l8.5-8.5a1 1 0 0 1 1.414 1.414l-8.5 8.5A.997.997 0 0 1 7 14Z" fill="currentColor" />
            </svg>
          </div>
        </div>
        
        <div className={`font-extrabold font-grotesk tracking-tight ${textClasses[size]} flex items-baseline`}>
          <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">sponsor</span>
          <span className="opacity-90 font-light italic">by</span>
        </div>
      </div>
    </Link>
  );
};

export default Logo;
