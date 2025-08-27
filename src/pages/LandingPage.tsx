import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';
import { BarChart2, Target, TrendingUp, Zap, CheckCircle2, ArrowRight, Users, Star, Quote, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import dashboardMockup from '@/assets/dashboard-mockup.jpg';
import trustLogos from '@/assets/trust-logos.jpg';
export default function LandingPage() {
  const navigate = useNavigate();
  return <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section with Product Mockup */}
        <section className="relative py-20 px-4 md:py-32 md:px-8 bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden">
          <div className="container mx-auto">
            <div className="flex items-center justify-center gap-12 max-w-6xl mx-auto">
              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <motion.div initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.6
              }}>
                  <Badge variant="outline" className="mb-4">
                    <Zap className="mr-1 h-3 w-3" />
                    AI-Powered LinkedIn Optimization
                  </Badge>
                  <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl leading-tight">
                    Write LinkedIn posts that{' '}
                    <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      go viral
                    </span>
                    <br />with AI analysis
                  </h1>
                  <p className="mb-8 max-w-2xl text-xl text-muted-foreground leading-relaxed">
                    The only tool that compares multiple LinkedIn drafts in real-time. Unlike generic AI tools, PostPulse is built specifically for LinkedIn success.
                    <span className="font-semibold text-foreground"> Trusted by LinkedIn creators, marketers, and founders.</span>
                  </p>
                  <div className="flex flex-col gap-4 sm:flex-row lg:justify-start justify-center">
                    <Button size="lg" onClick={() => navigate('/signup')} className="h-14 px-8 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-lg">
                      Start Free Analysis
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => navigate('/create')} className="h-14 px-8 text-lg">
                      <Play className="mr-2 h-4 w-4" />
                      Try Demo (No Signup)
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    💡 Want LinkedIn growth tips? <button className="underline hover:text-foreground transition-colors">Get our weekly newsletter</button>
                  </p>
                </motion.div>
              </div>
              
              {/* Product Dashboard Mockup */}
              <motion.div className="hidden lg:block flex-shrink-0" initial={{
              opacity: 0,
              scale: 0.9
            }} animate={{
              opacity: 1,
              scale: 1
            }} transition={{
              duration: 0.8,
              delay: 0.2
            }}>
                <div className="relative">
                  {/* Background gradient for visual dynamism */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 rounded-3xl blur-2xl"></div>
                  
                  <div className="relative bg-background/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-2xl overflow-hidden">
                    <img src={dashboardMockup} alt="PostPulse AI Dashboard - LinkedIn Post Analysis" className="w-[500px] h-[375px] rounded-2xl" />
                    
                    {/* Floating UI elements for uniqueness */}
                    <motion.div 
                      className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 text-xs font-medium"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      🔍 Real-time Analysis
                    </motion.div>
                    
                    <motion.div 
                      className="absolute bottom-16 left-4 bg-green-500/90 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <TrendingUp className="h-3 w-3" />
                      Engagement: +245%
                    </motion.div>
                  </div>
                  
                  <div className="absolute -bottom-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    ✨ AI Score: 8.7/10
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trust Signals */}
        <section className="py-12 px-4 md:px-8 bg-muted/30">
          <div className="container mx-auto">
            <motion.div className="text-center" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }}>
              <p className="text-sm text-muted-foreground mb-6">Trusted by creators and marketers worldwide</p>
              <img src={trustLogos} alt="Trusted by leading companies" className="mx-auto h-12 opacity-60 grayscale" />
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 md:px-8">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Get AI-powered insights for your LinkedIn posts in 3 simple steps
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[{
              step: "1",
              title: "Paste Your Post",
              description: "Copy your LinkedIn post content or write a new one directly in our editor",
              icon: "✏️"
            }, {
              step: "2",
              title: "Get AI Analysis",
              description: "Our AI analyzes engagement potential, reach, and virality in seconds",
              icon: "🤖"
            }, {
              step: "3",
              title: "Optimize & Publish",
              description: "Apply suggestions, compare versions, and publish your best-performing content",
              icon: "🚀"
            }].map((item, index) => <motion.div key={index} initial={{
              opacity: 0,
              y: 30
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.2
            }} className="text-center">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-2xl">
                    {item.icon}
                  </div>
                  <div className="mb-2">
                    <Badge variant="outline" className="mb-2">Step {item.step}</Badge>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{item.description}</p>
                </motion.div>)}
            </div>
          </div>
        </section>

        {/* Post Comparison Preview */}
        <section className="py-20 px-4 md:px-8 bg-muted/20">
          <div className="container mx-auto">
            <motion.div className="text-center mb-12" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }}>
              <h2 className="text-3xl font-bold mb-4">See The Difference AI Makes</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Compare two versions of the same post and see how our AI optimization dramatically improves performance
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Post A */}
              <motion.div initial={{
              opacity: 0,
              x: -20
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: 0.2
            }}>
                <Card className="relative h-full">
                  <div className="absolute -top-3 left-4">
                    <Badge variant="secondary">❌ Before AI</Badge>
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
                    <p className="mb-4 text-gray-600">
                      Just finished a project. Used React and Node.js. It was challenging but fun.
                    </p>
                    <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                      <span>👍 12 likes</span>
                      <span>💬 2 comments</span>
                      <span>🔄 1 share</span>
                    </div>
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800 font-medium">
                        🔻 AI Score: 3.2/10 - Low engagement potential
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Post B */}
              <motion.div initial={{
              opacity: 0,
              x: 20
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: 0.4
            }}>
                <Card className="relative border-green-200 bg-gradient-to-br from-green-50 to-green-50/50 h-full">
                  <div className="absolute -top-3 left-4">
                    <Badge className="bg-green-600">✨ After AI Optimization</Badge>
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
                    <p className="mb-4 leading-relaxed">
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
                    <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                      <span>👍 247 likes</span>
                      <span>💬 18 comments</span>
                      <span>🔄 12 shares</span>
                    </div>
                    <div className="p-3 bg-green-100 border border-green-300 rounded-lg">
                      <p className="text-sm text-green-800 font-medium">
                        🔥 AI Score: 8.7/10 - High viral potential
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div className="text-center mt-12" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.6
          }}>
              <div className="inline-flex items-center gap-4 mb-6 text-2xl font-bold text-green-600">
                <TrendingUp className="h-8 w-8" />
                <span>20x More Engagement</span>
              </div>
              <div>
                <Button onClick={() => navigate('/signup')} size="lg" className="h-12 px-8">
                  Start Your Free Analysis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Social Proof & Testimonials */}
        
        {/* Features Section */}
        <section className="py-20 px-4 md:px-8 bg-muted/30">
          <div className="container mx-auto">
            <motion.div className="text-center mb-16" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }}>
              <h2 className="text-3xl font-bold mb-4">Everything You Need to Dominate LinkedIn</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Our AI analyzes your posts across multiple dimensions to give you actionable, proven insights
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[{
              icon: BarChart2,
              title: "Engagement Analysis",
              description: "Get detailed insights on likes, comments, and shares potential",
              features: ["Hook effectiveness scoring", "Call-to-action optimization", "Emotional impact analysis"]
            }, {
              icon: Target,
              title: "Reach Optimization",
              description: "Maximize your post's visibility and algorithmic performance",
              features: ["Hashtag recommendations", "Timing suggestions", "Algorithm-friendly formatting"]
            }, {
              icon: TrendingUp,
              title: "Virality Potential",
              description: "Discover what makes content shareable and memorable",
              features: ["Shareability scoring", "Trend alignment analysis", "Content structure optimization"]
            }].map((feature, index) => <motion.div key={index} initial={{
              opacity: 0,
              y: 30
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.2
            }}>
                  <Card className="h-full hover-scale">
                    <CardHeader>
                      <feature.icon className="h-12 w-12 text-primary mb-4" />
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 text-sm">
                        {feature.features.map((item, i) => <li key={i} className="flex items-center gap-3">
                            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>{item}</span>
                          </li>)}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>)}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 px-4 md:px-8 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
          <div className="container mx-auto text-center">
            <motion.div className="mx-auto max-w-3xl" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }}>
              <h2 className="mb-4 text-4xl font-bold">
                Ready to Write Posts That{' '}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Go Viral?
                </span>
              </h2>
              <p className="mb-8 text-xl text-muted-foreground">Join professionals already using AI to optimize their LinkedIn presence. Start analyzing your posts in under 60 seconds — completely free!</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" onClick={() => navigate('/signup')} className="h-14 px-10 text-lg font-semibold">
                  Start Free Analysis Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-sm text-muted-foreground">
                  ✨ No credit card required • ✨ Results in 30 seconds
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-8 bg-muted/20">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <h3 className="font-semibold text-lg mb-3">PostPulse AI</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Built by AI experts. Powered by GPT-4. Trusted by LinkedIn creators worldwide.
              </p>
            </div>
            
            {/* Product */}
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
              </ul>
            </div>
            
            {/* FAQ */}
            <div>
              <h4 className="font-semibold mb-3">FAQ</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Do I need to connect LinkedIn?</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Is it really free?</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">How accurate is the AI?</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 PostPulse AI. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>;
}