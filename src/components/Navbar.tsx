
// Modify only the navigation items to remove the Rent Space link
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { navigationItems } from "@/data/navigationItems";
import { ModeToggle } from "./ModeToggle";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const location = useLocation();
  const pathname = location.pathname;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])
  
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Logo />
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors hover:text-primary ${
                  pathname === item.path ? "text-primary" : "text-slate-700"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center space-x-2">
            {!session ? (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/account">
                  <Button variant="outline" size="sm">
                    My Account
                  </Button>
                </Link>
              </>
            )}
            <ModeToggle />
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
            <span className="sr-only">Open menu</span>
          </Button>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm md:hidden">
            <div className="fixed inset-x-0 top-0 z-50 min-h-screen w-full bg-white px-6 py-6">
              <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2">
                  <Logo />
                </Link>
                <button
                  type="button"
                  className="text-slate-600 hover:text-slate-800"
                  onClick={toggleMobileMenu}
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-8 flow-root">
                <div className="-my-6 divide-y divide-slate-200">
                  <div className="space-y-2 py-6">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`-mx-3 block rounded-lg px-3 py-2 text-base font-medium transition-colors hover:bg-slate-100 ${
                          pathname === item.path ? "text-primary" : "text-slate-700"
                        }`}
                        onClick={toggleMobileMenu}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>

                  <div className="py-6">
                    {!session ? (
                      <>
                        <Link
                          to="/login"
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-100"
                          onClick={toggleMobileMenu}
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/auth"
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-100"
                          onClick={toggleMobileMenu}
                        >
                          Get Started
                        </Link>
                      </>
                    ) : (
                      <Link
                        to="/account"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-100"
                        onClick={toggleMobileMenu}
                      >
                        My Account
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
