
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, BarChart2, CheckCircle, LineChart, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Next-Gen LinkedIn Content Optimization
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Compare & Optimize Your LinkedIn Posts with AI
                </h1>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Predict which of your LinkedIn posts will perform better. Get real-time feedback
                  and actionable suggestions to maximize engagement and reach.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button 
                    size="lg" 
                    onClick={() => navigate(user ? '/compare' : '/signup')}
                    className="bg-linkedin hover:bg-linkedin-dark"
                  >
                    {user ? 'Compare Posts' : 'Get Started Free'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  {!user && (
                    <Button 
                      variant="outline" 
                      size="lg" 
                      onClick={() => navigate('/login')}
                    >
                      Log in
                    </Button>
                  )}
                </div>
              </div>
              <div className="mx-auto lg:mr-0 flex items-center justify-center">
                {/* Showcase image or illustration of the app */}
                <div className="relative w-full max-w-[500px] h-[300px] lg:h-[400px] bg-muted rounded-lg overflow-hidden border shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-tr from-muted/80 to-background/90 p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-lg font-semibold">Post Performance Prediction</div>
                      <LineChart className="h-5 w-5 text-primary" />
                    </div>
                    
                    <div className="flex-grow flex flex-col gap-4">
                      <div className="flex-1 bg-background rounded-md border shadow-sm p-3 text-sm text-left">
                        Just launched our new product! Check out the features...
                      </div>
                      
                      <div className="flex-1 bg-background rounded-md border-2 border-green-500 shadow-sm p-3 text-sm text-left">
                        🚀 Thrilled to announce our new product launch! After months of hard work, our team has created something truly innovative. 
                        <span className="text-green-500 font-medium block mt-1">Predicted to perform 43% better</span>
                      </div>
                      
                      <div className="mt-auto flex gap-2">
                        <div className="h-16 flex-1 bg-background rounded-md border p-2 flex flex-col items-center justify-center">
                          <BarChart2 className="h-4 w-4 text-primary mb-1" />
                          <span className="text-xs">Analytics</span>
                        </div>
                        <div className="h-16 flex-1 bg-background rounded-md border p-2 flex flex-col items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mb-1" />
                          <span className="text-xs">Suggestions</span>
                        </div>
                        <div className="h-16 flex-1 bg-background rounded-md border p-2 flex flex-col items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-blue-500 mb-1" />
                          <span className="text-xs">Optimization</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Everything You Need to Create Viral Content
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Powerful tools to help you craft, test, and optimize your LinkedIn content for maximum engagement.
                </p>
              </div>
            </div>
            
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
              {/* Feature 1 */}
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Real-Time Predictions</h3>
                <p className="text-sm text-muted-foreground text-center">
                  See how your content will perform before you post it, with detailed metrics and engagement forecasts.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <BarChart2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Side-by-Side Comparison</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Test different versions of your content to find the optimal wording, format, and call-to-action.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">AI-Powered Suggestions</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Receive actionable recommendations to improve your content engagement and reach.
                </p>
              </div>
              
              {/* Feature 4 */}
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Performance Tracking</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Save and track your content performance over time to continuously improve your strategy.
                </p>
              </div>
              
              {/* Feature 5 */}
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Advanced Analytics</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Fine-tune predictions based on your industry, follower count, and typical engagement levels.
                </p>
              </div>
              
              {/* Feature 6 */}
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <History className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Content History</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Access your previously analyzed posts and their performance metrics at any time.
                </p>
              </div>
            </div>
            
            <div className="mt-12 flex justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate(user ? '/compare' : '/signup')}
                className="bg-linkedin hover:bg-linkedin-dark"
              >
                {user ? 'Start Comparing Now' : 'Sign Up & Start Optimizing'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 PostPulse AI. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="underline underline-offset-4">Terms</a>
            <a href="#" className="underline underline-offset-4">Privacy</a>
            <a href="#" className="underline underline-offset-4">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// For the benefit of Lucide component import
import { User, History } from 'lucide-react';
