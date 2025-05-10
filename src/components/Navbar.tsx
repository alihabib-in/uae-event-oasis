import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "./AuthProvider";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const links = [
  { name: "Home", href: "/", isExternal: false },
  { name: "Events", href: "/events", isExternal: false },
  { name: "For Brands", href: "/for-brands", isExternal: false },
  { name: "For Organizers", href: "/for-organizers", isExternal: false },
];

const Navbar = () => {
  const { user, signOut, isLoading, isAdmin } = useAuth();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  return (
    <div className="bg-background/90 backdrop-blur-md sticky top-0 z-50 border-b">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="font-bold text-xl tracking-tight">
          sponsor<span className="text-primary font-medium">by</span>
        </Link>

        {isSmallScreen ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="sm:w-2/3 md:w-1/2">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Explore sponsorby and manage your account.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                {links.map((link) => (
                  <Button key={link.name} asChild variant="ghost" className="justify-start">
                    <Link to={link.href}>{link.name}</Link>
                  </Button>
                ))}
                {!isLoading && (
                  <>
                    {user ? (
                      <>
                        <Button asChild variant="ghost" className="justify-start">
                          <Link to="/account">Profile</Link>
                        </Button>
                        {isAdmin && (
                          <Button asChild variant="ghost" className="justify-start">
                            <Link to="/admin">Admin Dashboard</Link>
                          </Button>
                        )}
                        <Button asChild variant="ghost" className="justify-start">
                          <Link to="/post-event">Post an Event</Link>
                        </Button>
                        <Button variant="ghost" className="justify-start" onClick={signOut}>
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <Button asChild variant="default" className="justify-start">
                        <Link to="/login">Sign In</Link>
                      </Button>
                    )}
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="flex items-center gap-6">
            {links.map((link) => (
              <Link key={link.name} to={link.href} className="hover:text-primary transition-colors">
                {link.name}
              </Link>
            ))}
            {!isLoading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link to="/account">Profile</Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link to="/admin">Admin Dashboard</Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild>
                        <Link to="/post-event">Post an Event</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={signOut}>Sign Out</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex gap-4">
                    <Button asChild variant="default">
                      <Link to="/login">Sign In</Link>
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
