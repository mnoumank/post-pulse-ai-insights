import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  BarChart3, 
  Calendar, 
  Users, 
  CheckCircle, 
  Sparkles, 
  TrendingUp,
  Edit3,
  Target,
  Shield
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { PageTransition } from '@/components/PageTransition';

export function NewLandingPage() {
  const features = [
    {
      icon: Edit3,
      title: "AI-Powered Content Creation",
      description: "Generate LinkedIn posts in your brand voice with smart cleanup and formatting"
    },
    {
      icon: BarChart3,
      title: "Virality Prediction",
      description: "A/B test your drafts and see predicted engagement before posting"
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Plan and schedule your content calendar for optimal engagement"
    },
    {
      icon: TrendingUp,
      title: "Analytics & Benchmarking",
      description: "Track performance and compare against industry standards"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Collaborate with your team with shared calendars and approval workflows"
    },
    {
      icon: Target,
      title: "Brand Voice Profiles",
      description: "Maintain consistent messaging across all your content"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Director",
      content: "PostPulse AI helped increase our LinkedIn engagement by 300%. The brand voice feature is a game-changer."
    },
    {
      name: "Mike Rodriguez",
      role: "Content Creator",
      content: "I went from struggling with content ideas to posting consistently. The AI suggestions are spot-on."
    },
    {
      name: "Emily Watson",
      role: "Startup Founder",
      content: "Finally, a tool that understands LinkedIn's algorithm. My posts now reach 10x more people."
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold">PostPulse AI</h1>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-muted-foreground hover:text-foreground">
                  Login
                </Link>
                <ThemeToggle />
                <Link to="/signup">
                  <Button>Get Started Free</Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <Badge variant="secondary" className="mb-6">
              <Sparkles className="w-4 h-4 mr-1" />
              AI-Powered LinkedIn Content Assistant
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Create 
              <span className="text-primary"> Viral LinkedIn Content</span> 
              <br />That Converts
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Transform your LinkedIn presence with AI-powered content creation, virality prediction, 
              and data-driven insights. Join 10,000+ professionals growing their personal brand.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/signup">
                <Button size="lg" className="text-lg px-8 py-4">
                  Start Free Today
                  <Zap className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  View Pricing
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Free to start
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Cancel anytime
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Everything You Need to Win on LinkedIn
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                From content creation to performance analytics, PostPulse AI has every tool 
                you need to build a powerful LinkedIn presence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <Icon className="w-12 h-12 text-primary mb-4" />
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Trusted by Growing Professionals
              </h2>
              <p className="text-xl text-muted-foreground">
                See what our users are saying about PostPulse AI
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4 italic">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Preview */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Start free, upgrade when you're ready to unlock premium features
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Free</h3>
                  <p className="text-3xl font-bold mb-4">$0<span className="text-sm text-muted-foreground">/month</span></p>
                  <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                    <li>5 cleanups per month</li>
                    <li>3 virality checks</li>
                    <li>1 brand voice profile</li>
                    <li>Basic analytics</li>
                  </ul>
                  <Link to="/signup">
                    <Button variant="outline" className="w-full">Get Started</Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Pro Plan */}
              <Card className="ring-2 ring-primary">
                <CardContent className="p-6 text-center">
                  <Badge className="mb-2">Most Popular</Badge>
                  <h3 className="text-xl font-bold mb-2">Pro</h3>
                  <p className="text-3xl font-bold mb-4">$29<span className="text-sm text-muted-foreground">/month</span></p>
                  <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                    <li>Unlimited cleanups</li>
                    <li>Unlimited virality checks</li>
                    <li>Unlimited brand voices</li>
                    <li>Advanced analytics</li>
                    <li>Content scheduling</li>
                  </ul>
                  <Link to="/signup">
                    <Button className="w-full">Upgrade to Pro</Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Team Plan */}
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Team</h3>
                  <p className="text-3xl font-bold mb-4">$99<span className="text-sm text-muted-foreground">/month</span></p>
                  <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                    <li>Everything in Pro</li>
                    <li>Team collaboration</li>
                    <li>Shared calendar</li>
                    <li>Admin controls</li>
                    <li>Priority support</li>
                  </ul>
                  <Link to="/signup">
                    <Button variant="outline" className="w-full">Upgrade to Team</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <Link to="/pricing" className="inline-block mt-8">
              <Button variant="link">View Full Pricing Details →</Button>
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to Transform Your LinkedIn Presence?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of professionals using PostPulse AI to create better content, 
                build their personal brand, and grow their business.
              </p>
              <Link to="/signup">
                <Button size="lg" className="text-lg px-12 py-4">
                  Get Started Free Today
                  <Sparkles className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground mt-4">
                No credit card required • Free to start • Cancel anytime
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-12 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-bold">PostPulse AI</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  The ultimate LinkedIn content assistant for professionals and businesses.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
                  <li><Link to="/features" className="hover:text-foreground">Features</Link></li>
                  <li><Link to="/changelog" className="hover:text-foreground">Changelog</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link to="/about" className="hover:text-foreground">About</Link></li>
                  <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
                  <li><Link to="/careers" className="hover:text-foreground">Careers</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link to="/help" className="hover:text-foreground">Help Center</Link></li>
                  <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="hover:text-foreground">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-border mt-8 pt-8 text-center">
              <p className="text-sm text-muted-foreground">
                © 2024 PostPulse AI. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}