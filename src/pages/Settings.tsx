import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { PageTransition } from '@/components/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { User, Bell, Palette, Shield, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BrandVoiceProfile {
  id?: string;
  name: string;
  tone: string;
  keywords: string[];
  style: string;
  target_audience?: string;
  sample_content?: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [brandVoice, setBrandVoice] = useState<BrandVoiceProfile>({
    name: '',
    tone: '',
    keywords: [],
    style: '',
    target_audience: ''
  });
  const [keywordInput, setKeywordInput] = useState('');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    analytics: true
  });

  useEffect(() => {
    if (user) {
      loadBrandVoice();
    }
  }, [user]);

  const loadBrandVoice = async () => {
    try {
      const { data, error } = await supabase
        .from('brand_voice_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setBrandVoice(data);
      }
    } catch (error) {
      console.error('Error loading brand voice:', error);
    }
  };

  const saveBrandVoice = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('brand_voice_profiles')
        .upsert({
          ...brandVoice,
          user_id: user?.id,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Brand voice settings saved successfully",
      });
    } catch (error) {
      console.error('Error saving brand voice:', error);
      toast({
        title: "Error",
        description: "Failed to save brand voice settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !brandVoice.keywords.includes(keywordInput.trim())) {
      setBrandVoice({
        ...brandVoice,
        keywords: [...brandVoice.keywords, keywordInput.trim()]
      });
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setBrandVoice({
      ...brandVoice,
      keywords: brandVoice.keywords.filter(k => k !== keyword)
    });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account and brand voice preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Brand Voice Settings */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Brand Voice Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="brandName">Brand Name</Label>
                    <Input
                      id="brandName"
                      value={brandVoice.name}
                      onChange={(e) => setBrandVoice({ ...brandVoice, name: e.target.value })}
                      placeholder="Your personal or company brand"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="tone">Tone of Voice</Label>
                    <Input
                      id="tone"
                      value={brandVoice.tone}
                      onChange={(e) => setBrandVoice({ ...brandVoice, tone: e.target.value })}
                      placeholder="Professional, casual, authoritative, friendly..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="writingStyle">Writing Style</Label>
                    <Textarea
                      id="writingStyle"
                      value={brandVoice.style}
                      onChange={(e) => setBrandVoice({ ...brandVoice, style: e.target.value })}
                      placeholder="Describe your preferred writing style, length, and format..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="audience">Target Audience</Label>
                    <Input
                      id="audience"
                      value={brandVoice.target_audience || ''}
                      onChange={(e) => setBrandVoice({ ...brandVoice, target_audience: e.target.value })}
                      placeholder="Tech professionals, entrepreneurs, marketers..."
                    />
                  </div>

                  <div>
                    <Label>Keywords & Topics</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                        placeholder="Add keyword or topic"
                      />
                      <Button onClick={addKeyword} variant="outline">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {brandVoice.keywords.map((keyword) => (
                        <Badge 
                          key={keyword} 
                          variant="secondary" 
                          className="cursor-pointer"
                          onClick={() => removeKeyword(keyword)}
                        >
                          {keyword} ×
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button onClick={saveBrandVoice} disabled={loading} className="w-full">
                    {loading ? 'Saving...' : 'Save Brand Voice'}
                  </Button>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about your posts and analytics
                      </p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => 
                        setNotifications({ ...notifications, email: checked })
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when scheduled posts are published
                      </p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => 
                        setNotifications({ ...notifications, push: checked })
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Analytics Reports</Label>
                      <p className="text-sm text-muted-foreground">
                        Weekly performance summaries
                      </p>
                    </div>
                    <Switch
                      checked={notifications.analytics}
                      onCheckedChange={(checked) => 
                        setNotifications({ ...notifications, analytics: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Account Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Account
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  <Separator />
                  <div>
                    <Label>Account Type</Label>
                    <Badge variant="outline">Free Plan</Badge>
                  </div>
                  <Button variant="outline" className="w-full">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Upgrade Plan
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Appearance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Toggle theme appearance
                      </p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}