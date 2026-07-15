import { Link, useLocation } from "react-router-dom";
import { Server, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { setTheme } = useTheme();
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Analytics", path: "/analytics" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 text-primary hover:opacity-90 transition-opacity">
            <Server className="h-6 w-6 stroke-[2]" />
            <span className="text-xl font-bold tracking-tight text-foreground font-sans">
              Servora
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-foreground/95 ${
                isActive(link.path)
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions / Auth & Theme Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="default" size="sm" className="bg-primary hover:bg-primary/95 text-white">
                Sign up
              </Button>
            </Link>
          </div>

          {/* Theme Toggler */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 border border-border/40 hover:bg-muted dark:hover:bg-muted/50 rounded-full">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")} className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                <span>System</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

