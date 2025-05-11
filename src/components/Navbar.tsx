
// Adding the contact page link to the Navbar
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { navigationItems } from "@/data/navigationItems";
import { ModeToggle } from "@/components/ModeToggle";
import { Menu, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/AuthProvider";
import { useMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { user, signOut, isAdmin } = useAuth();
  const location = useLocation();
  const isMobile = useMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-background/70 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2 mr-6">
            <img src="/logo.svg" alt="sponsorby logo" className="h-8 w-8" />
            <span className="text-xl font-bold tracking-tighter">sponsorby</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/events"
              className={`text-sm hover:text-primary transition-colors ${location.pathname === "/events" ? "text-primary font-medium" : ""}`}
            >
              Events
            </Link>
            <Link
              to="/for-brands"
              className={`text-sm hover:text-primary transition-colors ${location.pathname === "/for-brands" ? "text-primary font-medium" : ""}`}
            >
              For Brands
            </Link>
            <Link
              to="/for-organizers"
              className={`text-sm hover:text-primary transition-colors ${location.pathname === "/for-organizers" ? "text-primary font-medium" : ""}`}
            >
              For Organizers
            </Link>
            <Link
              to="/contact"
              className={`text-sm hover:text-primary transition-colors ${location.pathname === "/contact" ? "text-primary font-medium" : ""}`}
            >
              Contact Us
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className={`text-sm text-primary font-medium hover:text-primary transition-colors ${location.pathname === "/admin" ? "underline" : ""}`}
              >
                Admin
              </Link>
            )}
          </nav>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <ModeToggle />
            {!user ? (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/auth">Sign up</Link>
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={user.email || ""} />
                      <AvatarFallback>
                        {user.email?.substring(0, 2).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user.email && (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/account">Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/post-event">Post Event</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile navigation */}
          <div className="md:hidden flex items-center">
            <ModeToggle />

            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && isMobile && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-4 flex flex-col">
            <Link
              to="/events"
              className="py-2 text-sm hover:text-primary transition-colors"
            >
              Events
            </Link>
            <Link
              to="/for-brands"
              className="py-2 text-sm hover:text-primary transition-colors"
            >
              For Brands
            </Link>
            <Link
              to="/for-organizers"
              className="py-2 text-sm hover:text-primary transition-colors"
            >
              For Organizers
            </Link>
            <Link
              to="/contact"
              className="py-2 text-sm hover:text-primary transition-colors"
            >
              Contact Us
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="py-2 text-sm text-primary hover:text-primary transition-colors"
              >
                Admin
              </Link>
            )}
            <div className="border-t my-2 pt-2">
              {!user ? (
                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/login">Log in</Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link to="/auth">Sign up</Link>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={user.email || ""} />
                      <AvatarFallback>
                        {user.email?.substring(0, 2).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm font-medium">{user.email}</div>
                  </div>
                  <Link
                    to="/account"
                    className="py-2 text-sm hover:text-primary transition-colors"
                  >
                    Account
                  </Link>
                  <Link
                    to="/post-event"
                    className="py-2 text-sm hover:text-primary transition-colors"
                  >
                    Post Event
                  </Link>
                  <button
                    onClick={signOut}
                    className="py-2 text-sm hover:text-primary transition-colors text-left"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
