
import React from 'react';
import { SignupForm } from '@/components/SignupForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <div className="text-primary-foreground font-bold text-2xl">P</div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Post Pulse AI</h1>
          <p className="text-muted-foreground text-lg">Insights</p>
        </motion.div>

        {/* Signup Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SignupForm />
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-muted-foreground">
            © 2025 Post Pulse AI Insights. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
