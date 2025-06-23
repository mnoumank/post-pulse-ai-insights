

import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/context/ThemeContext";
import { Label } from "@/components/ui/label";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-4 w-4 text-muted-foreground" />
      <Switch 
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
        id="theme-mode"
        aria-label="Toggle theme"
      />
      <Moon className="h-4 w-4 text-muted-foreground" />
      <Label htmlFor="theme-mode" className="text-sm text-muted-foreground cursor-pointer">
        Dark mode
      </Label>
    </div>
  );
}

export default ThemeToggle;

