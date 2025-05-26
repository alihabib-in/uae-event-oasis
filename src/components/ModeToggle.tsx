
import { Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "./ui/button";

export function ModeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="text-gray-300"
    >
      <Moon className="h-4 w-4 rotate-0 scale-100 transition-all" />
      <span className="sr-only">Toggle theme (dark mode enforced)</span>
    </Button>
  );
}
