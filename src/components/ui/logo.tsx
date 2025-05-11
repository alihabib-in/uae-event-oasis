
import { BookMarked, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "light";
}

const Logo = ({ size = "md", variant = "default" }: LogoProps) => {
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

  return (
    <Link to="/" className="flex items-center">
      <div className={`flex items-center gap-2 ${variantClasses[variant]}`}>
        <div className="relative">
          <Calendar className={`${sizeClasses[size]} text-primary`} strokeWidth={1.5} />
          <div className="absolute -right-0.5 -bottom-0.5 bg-accent rounded-full p-0.5 border-2 border-background">
            <BookMarked className="h-3 w-3 text-white" />
          </div>
        </div>
        
        <div className={`font-bold font-grotesk tracking-tight ${textClasses[size]}`}>
          <span className="text-primary">sponsor</span>
          <span className="opacity-90">by</span>
        </div>
      </div>
    </Link>
  );
};

export default Logo;
