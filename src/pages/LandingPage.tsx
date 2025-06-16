
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, BarChart2, CheckCircle, LineChart, TrendingUp, Users, Zap, Target } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                  <Zap className="mr-2 h-4 w-4" />
                  AI-Powered LinkedIn Optimization
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-gray-900">
                  Transform Your LinkedIn Content with 
                  <span className="text-blue-600"> AI Insights</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Stop guessing what will work. Our AI analyzes your LinkedIn posts before you publish, 
                  predicting engagement and providing actionable recommendations to maximize your reach.
                </p>
                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                  <Button 
                    size="lg" 
                    onClick={() => navigate(user ? '/compare' : '/signup')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {user ? 'Start Analyzing Posts' : 'Get Started Free'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  {!user && (
                    <Button 
                      variant="outline" 
                      size="lg" 
                      onClick={() => navigate('/login')}
                      className="px-8 py-4 text-lg font-semibold border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                    >
                      Sign In
                    </Button>
                  )}
                </div>
                <div className="flex items-center space-x-6 pt-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span className="text-sm text-gray-600">10,000+ professionals</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-600">94% accuracy rate</span>
                  </div>
                </div>
              </div>
              
              <div className="relative lg:ml-8">
                {/* Professional LinkedIn-style mockup */}
                <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                  {/* LinkedIn-style header */}
                  <div className="bg-blue-600 h-20 relative">
                    <div className="absolute -bottom-10 left-6">
                      <div className="w-20 h-20 bg-white rounded-full border-4 border-white shadow-lg overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" 
                          alt="Professional profile" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Content area */}
                  <div className="pt-12 p-6">
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-900">Alex Johnson</h3>
                      <p className="text-sm text-gray-600">Marketing Director at TechCorp</p>
                    </div>
                    
                    {/* Post comparison */}
                    <div className="space-y-4">
                      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <p className="text-sm text-gray-700">Just launched our new product! Check it out...</p>
                        <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                          <span>12 likes</span>
                          <span>3 comments</span>
                        </div>
                      </div>
                      
                      <div className="p-4 border-2 border-green-400 rounded-lg bg-green-50 relative">
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          AI Optimized
                        </div>
                        <p className="text-sm text-gray-700">🚀 Excited to unveil our game-changing product! After months of innovation, we've created something that will revolutionize how teams collaborate...</p>
                        <div className="mt-2 flex items-center space-x-4 text-xs text-green-700">
                          <span className="font-semibold">187 likes (+1458%)</span>
                          <span className="font-semibold">23 comments (+667%)</span>
                          <span className="font-semibold">12 shares</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating stats */}
                <div className="absolute -right-4 top-1/4 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">+243%</div>
                      <div className="text-xs text-gray-600">Engagement</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -left-4 bottom-1/4 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <BarChart2 className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Real-time</div>
                      <div className="text-xs text-gray-600">Analysis</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="w-full py-16 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 mb-4">
                Powerful Features
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-gray-900 mb-4">
                Everything You Need for LinkedIn Success
              </h2>
              <p className="mx-auto max-w-3xl text-xl text-gray-600">
                Advanced AI technology meets LinkedIn expertise to help you create content that drives real results.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Feature 1 */}
              <div className="group p-8 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                  <LineChart className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Predictions</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get accurate engagement forecasts before you post. Our AI analyzes millions of LinkedIn posts to predict performance.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="group p-8 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
                  <BarChart2 className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Comparisons</h3>
                <p className="text-gray-600 leading-relaxed">
                  Test multiple versions side-by-side to find the perfect wording, format, and timing for maximum impact.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="group p-8 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Actionable Insights</h3>
                <p className="text-gray-600 leading-relaxed">
                  Receive specific recommendations on hashtags, timing, content structure, and engagement strategies.
                </p>
              </div>
              
              {/* Feature 4 */}
              <div className="group p-8 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-200 transition-colors">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Performance Tracking</h3>
                <p className="text-gray-600 leading-relaxed">
                  Monitor your content's success over time and refine your strategy based on real performance data.
                </p>
              </div>
              
              {/* Feature 5 */}
              <div className="group p-8 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-200 transition-colors">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Industry Intelligence</h3>
                <p className="text-gray-600 leading-relaxed">
                  Tailored insights based on your industry, role, and target audience for maximum relevance.
                </p>
              </div>
              
              {/* Feature 6 */}
              <div className="group p-8 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-200 transition-colors">
                  <Target className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Content Optimization</h3>
                <p className="text-gray-600 leading-relaxed">
                  Automatically optimize your posts for LinkedIn's algorithm to increase visibility and reach.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-16">
              <Button 
                size="lg" 
                onClick={() => navigate(user ? '/compare' : '/signup')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {user ? 'Start Optimizing Now' : 'Join 10,000+ Professionals'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="w-full py-16 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Trusted by LinkedIn Professionals Worldwide</h2>
              <div className="flex justify-center items-center space-x-8 flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-gray-600">10,000+ Users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-600">2M+ Posts Analyzed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Target className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-gray-600">94% Accuracy Rate</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="w-full border-t bg-white py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-gray-600">
            © 2025 PostPulse AI. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
