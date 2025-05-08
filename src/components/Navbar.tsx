
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
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
              <span className="text-2xl font-bold">
                <span className="text-gradient">sponsor</span><span className="text-primary">by</span>
              </span>
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
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

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
