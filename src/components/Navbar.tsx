
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart2 } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const location = useLocation();

  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center">
            <BarChart2 className="h-6 w-6 text-primary mr-2" />
            <span className="hidden font-bold sm:inline-block">PostPulse AI</span>
          </Link>
          
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
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
