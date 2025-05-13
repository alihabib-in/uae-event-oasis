
import { BookMarked, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

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
    default: "text-primary",
    light: "text-primary-foreground",
  };

  const logoRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<SVGSVGElement>(null);
  const bookmarkRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Add pulse animation to calendar icon
    if (calendarRef.current) {
      calendarRef.current.animate([
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(1.05)', opacity: 1 },
        { transform: 'scale(1)', opacity: 1 }
      ], {
        duration: 2000,
        iterations: Infinity,
        easing: 'ease-in-out'
      });
    }

    // Add subtle rotation to bookmark icon
    if (bookmarkRef.current) {
      bookmarkRef.current.animate([
        { transform: 'rotate(-5deg)' },
        { transform: 'rotate(5deg)' },
        { transform: 'rotate(-5deg)' }
      ], {
        duration: 3000,
        iterations: Infinity,
        easing: 'ease-in-out'
      });
    }

    // Add hover effect to the entire logo
    if (logoRef.current) {
      logoRef.current.addEventListener('mouseenter', () => {
        // Scale up slightly on hover
        logoRef.current?.animate([
          { transform: 'scale(1)' },
          { transform: 'scale(1.05)' }
        ], {
          duration: 300,
          fill: 'forwards',
          easing: 'ease-out'
        });
      });
      
      logoRef.current.addEventListener('mouseleave', () => {
        // Scale back down when not hovering
        logoRef.current?.animate([
          { transform: 'scale(1.05)' },
          { transform: 'scale(1)' }
        ], {
          duration: 300,
          fill: 'forwards',
          easing: 'ease-out'
        });
      });
    }
  }, []);

  return (
    <Link to="/" className="flex items-center">
      <div ref={logoRef} className={`flex items-center gap-2 ${variantClasses[variant]} transition-all duration-300 ease-in-out`}>
        <div className="relative">
          <Calendar 
            ref={calendarRef}
            className={`${sizeClasses[size]} text-primary`} 
            strokeWidth={1.5} 
          />
          <div className="absolute -right-0.5 -bottom-0.5 bg-accent rounded-full p-0.5 border-2 border-background">
            <BookMarked 
              ref={bookmarkRef}
              className="h-3 w-3 text-white" 
            />
          </div>
        </div>
        
        <div className={`font-bold font-grotesk tracking-tight ${textClasses[size]}`}>
          <span className="text-primary bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">sponsor</span>
          <span className="italic font-light opacity-90">by</span>
        </div>
      </div>
    </Link>
  );
};

export default Logo;
