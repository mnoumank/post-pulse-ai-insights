
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BarChart2, User, LogOut } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center">
            <BarChart2 className="h-6 w-6 text-primary mr-2" />
            <span className="hidden font-bold sm:inline-block">PostPulse AI</span>
          </Link>
          
          {user && (
            <nav className="hidden md:flex gap-6">
              <Link
                to="/create"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/create' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Create Post
              </Link>
              <Link
                to="/compare"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/compare' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Compare Posts
              </Link>
              <Link
                to="/history"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/history' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                History
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
                <DropdownMenuItem onClick={() => navigate('/admin')}>
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
