import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';
import { BarChart2, Target, TrendingUp, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section with Professional Headshot */}
        <section className="relative py-20 px-4 md:py-32 md:px-8 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="container mx-auto">
            <div className="flex items-center justify-center gap-12 max-w-6xl mx-auto">
              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <Badge variant="outline" className="mb-4">
                  <Zap className="mr-1 h-3 w-3" />
                  AI-Powered LinkedIn Optimization
                </Badge>
                <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
                  Transform Your LinkedIn Posts with{' '}
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    AI-Powered Analysis
                  </span>
                </h1>
                <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
                  Compare different versions of your LinkedIn posts and discover which performs better. 
                  Get AI-driven insights on engagement, reach, and virality to maximize your professional impact.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row lg:justify-start justify-center">
                  <Button size="lg" onClick={() => navigate('/compare')} className="h-12 px-8">
                    Start Analyzing Posts
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => navigate('/create')} className="h-12 px-8">
                    Create AI Posts
                  </Button>
                </div>
              </div>
              
              {/* Professional headshot */}
              <div className="hidden lg:block flex-shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face" 
                  alt="LinkedIn Professional"
                  className="w-72 h-72 rounded-full object-cover border-4 border-white shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Post Comparison Preview */}
        <section className="py-20 px-4 md:px-8">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">See The Difference</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Compare two versions of the same post and see which one performs better with our AI analysis
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Post A */}
              <Card className="relative">
                <div className="absolute -top-3 left-4">
                  <Badge variant="secondary">Original Post</Badge>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                      JP
                    </div>
                    <div>
                      <p className="font-semibold">John Professional</p>
                      <p className="text-sm text-muted-foreground">Senior Developer</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Just finished a project. Used React and Node.js. It was challenging but fun.
                  </p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>👍 12 likes</span>
                    <span>💬 2 comments</span>
                    <span>🔄 1 share</span>
                  </div>
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm text-red-800">
                      <strong>AI Score: 3.2/10</strong> - Low engagement potential
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Post B */}
              <Card className="relative border-green-200 bg-green-50/50">
                <div className="absolute -top-3 left-4">
                  <Badge className="bg-green-600">Optimized Post</Badge>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                      JP
                    </div>
                    <div>
                      <p className="font-semibold">John Professional</p>
                      <p className="text-sm text-muted-foreground">Senior Developer</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    🚀 Just shipped a game-changing project that reduced load times by 60%!
                    
                    The challenge? Building a real-time collaboration tool that could handle 1000+ concurrent users.
                    
                    The solution? A React frontend with a Node.js microservices backend.
                    
                    Key lessons learned:
                    ✅ Performance optimization is everything
                    ✅ User feedback shapes the best features
                    ✅ Sometimes the simple solution wins
                    
                    What's your biggest project win this quarter? 👇
                    
                    #WebDevelopment #React #NodeJS #TechLeadership
                  </p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>👍 247 likes</span>
                    <span>💬 18 comments</span>
                    <span>🔄 12 shares</span>
                  </div>
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm text-green-800">
                      <strong>AI Score: 8.7/10</strong> - High engagement potential
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <Button onClick={() => navigate('/compare')} size="lg">
                Try It Yourself
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 md:px-8 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why PostPulse AI?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our AI analyzes your posts across multiple dimensions to give you actionable insights
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card>
                <CardHeader>
                  <BarChart2 className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Engagement Analysis</CardTitle>
                  <CardDescription>
                    Get detailed insights on likes, comments, and shares potential
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Hook effectiveness scoring
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Call-to-action optimization
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Emotional impact analysis
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Target className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Reach Optimization</CardTitle>
                  <CardDescription>
                    Maximize your post's visibility and algorithmic performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Hashtag recommendations
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Timing suggestions
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Algorithm-friendly formatting
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <TrendingUp className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Virality Potential</CardTitle>
                  <CardDescription>
                    Discover what makes content shareable and memorable
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Shareability scoring
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Trend alignment analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Content structure optimization
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 md:px-8">
          <div className="container mx-auto text-center">
            <div className="mx-auto max-w-2xl">
              <h2 className="mb-4 text-3xl font-bold">
                Ready to Boost Your LinkedIn Presence?
              </h2>
              <p className="mb-8 text-muted-foreground">
                Start optimizing your LinkedIn posts today with AI-powered insights.
                No sign-up required - just start analyzing!
              </p>
              <Button size="lg" onClick={() => navigate('/compare')} className="h-12 px-8">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 PostPulse AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
