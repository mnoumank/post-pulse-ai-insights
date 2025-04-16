
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { SignupForm } from '@/components/SignupForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export default function SignupPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // If user is already logged in, redirect to compare page
  useEffect(() => {
    if (user) {
      navigate('/compare');
    }
  }, [user, navigate]);
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <SignupForm />
      </main>
      
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 PostPulse AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
