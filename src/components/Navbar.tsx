// Modify only the navigation items to include the Rent Space link
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Building } from "lucide-react";
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

  // Add Rent Space to navigation items
  const extendedNavItems = [...navigationItems, { name: "Rent Space", path: "/rent-space" }];

  
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-700/50 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/80">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Logo />
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {extendedNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors hover:text-primary ${
                  pathname === item.path ? "text-primary" : "text-slate-200"
                }`}
              >
                {item.name === "Rent Space" ? (
                  <span className="flex items-center">
                    <Building className="mr-1 h-4 w-4" /> {item.name}
                  </span>
                ) : (
                  item.name
                )}
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
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm md:hidden">
            <div className="fixed inset-x-0 top-0 z-50 min-h-screen w-full bg-slate-900 px-6 py-6">
              <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2">
                  <Logo />
                </Link>
                <button
                  type="button"
                  className="text-slate-400 hover:text-slate-200"
                  onClick={toggleMobileMenu}
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-8 flow-root">
                <div className="-my-6 divide-y divide-slate-800">
                  <div className="space-y-2 py-6">
                    {extendedNavItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`-mx-3 block rounded-lg px-3 py-2 text-base font-medium transition-colors hover:bg-slate-800 ${
                          pathname === item.path ? "text-primary" : "text-slate-200"
                        }`}
                        onClick={toggleMobileMenu}
                      >
                        {item.name === "Rent Space" ? (
                          <span className="flex items-center">
                            <Building className="mr-2 h-4 w-4" /> {item.name}
                          </span>
                        ) : (
                          item.name
                        )}
                      </Link>
                    ))}
                  </div>

                  <div className="py-6">
                    {!session ? (
                      <>
                        <Link
                          to="/login"
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-medium text-slate-200 hover:bg-slate-800"
                          onClick={toggleMobileMenu}
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/auth"
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-medium text-slate-200 hover:bg-slate-800"
                          onClick={toggleMobileMenu}
                        >
                          Get Started
                        </Link>
                      </>
                    ) : (
                      <Link
                        to="/account"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-medium text-slate-200 hover:bg-slate-800"
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
