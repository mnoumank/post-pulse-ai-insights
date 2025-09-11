import React from 'react';
import { Navbar } from '@/components/Navbar';
import { PageTransition } from '@/components/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Zap, Users, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

const pricingPlans = [
  {
    name: 'Free',
    icon: Zap,
    price: '$0',
    period: '/month',
    description: 'Perfect for individuals getting started',
    features: [
      { name: '5 post cleanups per month', included: true },
      { name: '3 virality checks per month', included: true },
      { name: '1 saved brand voice profile', included: true },
      { name: 'Basic analytics', included: true },
      { name: 'Post scheduling', included: false },
      { name: 'Industry benchmarking', included: false },
      { name: 'Unlimited brand voices', included: false },
      { name: 'Team collaboration', included: false },
      { name: 'Priority support', included: false }
    ],
    cta: 'Get Started Free',
    popular: false
  },
  {
    name: 'Pro',
    icon: Crown,
    price: '$29',
    period: '/month',
    description: 'For content creators and professionals',
    features: [
      { name: 'Unlimited post cleanups', included: true },
      { name: 'Unlimited virality checks', included: true },
      { name: 'Unlimited brand voice profiles', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Post scheduling & calendar', included: true },
      { name: 'Industry benchmarking', included: true },
      { name: 'Content templates', included: true },
      { name: 'Team collaboration', included: false },
      { name: 'Priority support', included: true }
    ],
    cta: 'Upgrade to Pro',
    popular: true
  },
  {
    name: 'Team',
    icon: Users,
    price: '$99',
    period: '/month',
    description: 'For businesses and marketing teams',
    features: [
      { name: 'Everything in Pro', included: true },
      { name: 'Team accounts (up to 5 users)', included: true },
      { name: 'Shared calendar & collaboration', included: true },
      { name: 'Advanced reporting & export', included: true },
      { name: 'Admin controls & permissions', included: true },
      { name: 'Brand consistency tools', included: true },
      { name: 'Approval workflows', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'Dedicated support', included: true }
    ],
    cta: 'Upgrade to Team',
    popular: false
  }
];

export function PricingPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan for your LinkedIn content strategy. 
              Upgrade or downgrade at any time.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {pricingPlans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <Card 
                  key={plan.name} 
                  className={`relative ${plan.popular ? 'ring-2 ring-primary shadow-lg' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-3 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <Icon className={`w-8 h-8 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          {feature.included ? (
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <X className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          )}
                          <span className={`text-sm ${feature.included ? '' : 'text-muted-foreground'}`}>
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      asChild
                    >
                      <Link to={index === 0 ? '/signup' : '/dashboard'}>
                        {plan.cta}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I change my plan anytime?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes! You can upgrade or downgrade your plan at any time. 
                    Changes take effect immediately, and you'll only pay the difference.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What happens if I exceed my limits?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    On the Free plan, you'll be prompted to upgrade once you hit your limits. 
                    Pro and Team plans have unlimited usage for core features.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is there a free trial?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our Free plan gives you full access to core features with usage limits. 
                    Pro and Team plans come with a 14-day money-back guarantee.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How does team collaboration work?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Team plans include shared calendars, approval workflows, and role-based permissions. 
                    Team members can collaborate on content while maintaining brand consistency.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16 py-12 bg-muted rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Ready to supercharge your LinkedIn presence?</h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of professionals using PostPulse AI to create better content
            </p>
            <Link to="/signup">
              <Button size="lg">
                Start Free Today
              </Button>
            </Link>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}