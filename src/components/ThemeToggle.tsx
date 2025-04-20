
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/context/ThemeContext";
import { Label } from "@/components/ui/label";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <Switch 
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
        id="theme-mode"
        aria-label="Toggle theme"
      />
      <Label htmlFor="theme-mode" className="sr-only">
        Toggle theme
      </Label>
    </div>
  );
}

export default ThemeToggle;
