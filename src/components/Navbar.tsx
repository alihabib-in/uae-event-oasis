import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-background/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              {/* Redesigned logo */}
              <div className="flex items-center">
                <div className="relative">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                    {/* Abstract S shape */}
                    <path 
                      d="M6 16C6 10.4772 10.4772 6 16 6C21.5228 6 26 10.4772 26 16C26 21.5228 21.5228 26 16 26" 
                      stroke="url(#paint0_linear)" 
                      strokeWidth="3" 
                      strokeLinecap="round"
                    />
                    <path 
                      d="M16 26C13.7909 26 12 24.2091 12 22C12 19.7909 13.7909 18 16 18C18.2091 18 20 16.2091 20 14C20 11.7909 18.2091 10 16 10" 
                      stroke="url(#paint1_linear)" 
                      strokeWidth="3" 
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="paint0_linear" x1="6" y1="16" x2="26" y2="16" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#1EAEDB" />
                        <stop offset="1" stopColor="#8B5CF6" />
                      </linearGradient>
                      <linearGradient id="paint1_linear" x1="12" y1="18" x2="20" y2="18" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#8B5CF6" />
                        <stop offset="1" stopColor="#F97316" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute -right-1 -top-1 h-2 w-2 bg-accent rounded-full animate-pulse"></div>
                </div>
                <span className="text-2xl font-light ml-1">
                  <span className="text-gradient">sponsor</span><span className="text-primary font-medium">by</span>
                </span>
              </div>
            </Link>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              <Link
                to="/events"
                className="border-transparent text-gray-300 hover:text-primary hover:border-primary px-3 py-2 text-sm font-medium border-b-2"
              >
                Discover Events
              </Link>
              <Link
                to="/for-brands"
                className="border-transparent text-gray-300 hover:text-primary hover:border-primary px-3 py-2 text-sm font-medium border-b-2"
              >
                For Brands
              </Link>
              <Link
                to="/for-organizers"
                className="border-transparent text-gray-300 hover:text-primary hover:border-primary px-3 py-2 text-sm font-medium border-b-2"
              >
                For Organizers
              </Link>
              <Link
                to="/how-it-works"
                className="border-transparent text-gray-300 hover:text-primary hover:border-primary px-3 py-2 text-sm font-medium border-b-2"
              >
                How It Works
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-gray-300" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button variant="ghost">Sign In</Button>
            <Button>Sign Up</Button>
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <Menu className="h-6 w-6" />
              ) : (
                <X className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Keep existing mobile menu code */}
      {isMenuOpen && (
        <div className="sm:hidden bg-background/95 backdrop-blur-md">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/events"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-300 hover:text-primary hover:bg-gray-800 hover:border-primary"
            >
              Discover Events
            </Link>
            <Link
              to="/for-brands"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-300 hover:text-primary hover:bg-gray-800 hover:border-primary"
            >
              For Brands
            </Link>
            <Link
              to="/for-organizers"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-300 hover:text-primary hover:bg-gray-800 hover:border-primary"
            >
              For Organizers
            </Link>
            <Link
              to="/how-it-works"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-300 hover:text-primary hover:bg-gray-800 hover:border-primary"
            >
              How It Works
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-white/10">
            <div className="flex items-center px-4 space-x-3">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleTheme}
                className="rounded-full w-full flex items-center justify-center space-x-2"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="h-5 w-5 text-gray-300" />
                    <span className="text-gray-300">Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-5 w-5" />
                    <span>Dark Mode</span>
                  </>
                )}
              </Button>
              <Button variant="ghost" className="w-full">Sign In</Button>
              <Button className="w-full">Sign Up</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
