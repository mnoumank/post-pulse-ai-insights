
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, BarChart2, CheckCircle, LineChart, TrendingUp, Users, Zap, Target, Heart, MessageCircle, Share2, ThumbsUp } from 'lucide-react';

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
                {/* LinkedIn-style mockup with professional imagery */}
                <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                  {/* LinkedIn-style header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-24 relative">
                    <div className="absolute -bottom-12 left-6">
                      <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face" 
                          alt="Professional LinkedIn user" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Content area */}
                  <div className="pt-16 p-6">
                    <div className="mb-6">
                      <h3 className="font-semibold text-lg text-gray-900">Sarah Chen</h3>
                      <p className="text-sm text-gray-600">Senior Marketing Director at TechFlow • 12.5K followers</p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <span>5h • 🌐</span>
                      </div>
                    </div>
                    
                    {/* Before/After Post Comparison */}
                    <div className="space-y-6">
                      {/* Original Post */}
                      <div className="relative">
                        <div className="absolute -top-2 -left-2 bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                          Before AI
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                          <p className="text-sm text-gray-700 mb-3">Just launched our new product. Check it out and let me know what you think.</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <ThumbsUp className="h-3 w-3" />
                                <span>8</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MessageCircle className="h-3 w-3" />
                                <span>2</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Share2 className="h-3 w-3" />
                                <span>0</span>
                              </div>
                            </div>
                            <div className="text-xs text-red-600 font-medium">Low Engagement</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* AI Optimized Post */}
                      <div className="relative">
                        <div className="absolute -top-2 -left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center">
                          <Zap className="h-3 w-3 mr-1" />
                          AI Optimized
                        </div>
                        <div className="p-4 border-2 border-green-400 rounded-lg bg-green-50 relative">
                          <p className="text-sm text-gray-700 mb-3">
                            🚀 Thrilled to unveil our game-changing product after 6 months of relentless innovation! 
                            <br/><br/>
                            Our team tackled the #1 pain point that 73% of professionals face daily...
                            <br/><br/>
                            What's your biggest workflow challenge? Drop a comment below! 👇
                            <br/><br/>
                            #Innovation #ProductLaunch #TechSolutions
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-xs text-green-700">
                              <div className="flex items-center space-x-1">
                                <ThumbsUp className="h-3 w-3" />
                                <span className="font-semibold">247</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MessageCircle className="h-3 w-3" />
                                <span className="font-semibold">31</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Share2 className="h-3 w-3" />
                                <span className="font-semibold">18</span>
                              </div>
                            </div>
                            <div className="text-xs text-green-600 font-medium">High Engagement</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating AI insights */}
                <div className="absolute -right-6 top-1/3 bg-white rounded-xl shadow-xl p-4 border border-gray-200 max-w-48">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-semibold text-gray-900">AI Analysis</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Engagement</span>
                      <span className="text-xs font-bold text-green-600">+2,987%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Reach</span>
                      <span className="text-xs font-bold text-blue-600">+1,450%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Virality</span>
                      <span className="text-xs font-bold text-purple-600">+890%</span>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -left-6 bottom-1/3 bg-white rounded-xl shadow-xl p-4 border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Real-time</div>
                      <div className="text-xs text-gray-600">AI Insights</div>
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
