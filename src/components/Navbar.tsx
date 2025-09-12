
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BarChart2, User, LogOut, Home, Edit3, BarChart3, BookOpen, Calendar, Settings, CreditCard } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/landing');
  };

  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/landing" className="flex items-center">
            <BarChart2 className="h-6 w-6 text-primary mr-2" />
            <span className="hidden font-bold sm:inline-block">PostPulse AI</span>
          </Link>
          
          {user && (
            <nav className="hidden lg:flex gap-6">
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/create"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/create' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Create
              </Link>
              <Link
                to="/library"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/library' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Library
              </Link>
              <Link
                to="/analytics"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/analytics' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Analytics
              </Link>
              <Link
                to="/calendar"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/calendar' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Calendar
              </Link>
            </nav>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  {user.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/pricing')}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pricing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/admin')}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Log In
              </Button>
              <Button size="sm" onClick={() => navigate('/signup')}>
                Create Account
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
