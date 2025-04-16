
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { ChevronDown, History, LogOut, User, BarChart2 } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="max-w-[100px] overflow-hidden text-ellipsis">{user.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/compare')}>
                  <BarChart2 className="mr-2 h-4 w-4" />
                  <span>Compare Posts</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/history')}>
                  <History className="mr-2 h-4 w-4" />
                  <span>History</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/login')}>
                Log in
              </Button>
              <Button onClick={() => navigate('/signup')}>Sign up</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
