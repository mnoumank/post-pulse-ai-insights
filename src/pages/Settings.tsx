import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { PageTransition } from '@/components/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mic, Users, CreditCard, Bell, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BrandVoice {
  id: string;
  name: string;
  description: string;
  tone: string;
  keywords: string[];
  isDefault: boolean;
}

export function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [brandVoices, setBrandVoices] = useState<BrandVoice[]>([
    {
      id: '1',
      name: 'Professional',
      description: 'Formal, authoritative tone for corporate communications',
      tone: 'Professional and authoritative',
      keywords: ['leadership', 'strategy', 'growth', 'innovation'],
      isDefault: true
    },
    {
      id: '2',
      name: 'Casual',
      description: 'Friendly, approachable tone for personal brand content',
      tone: 'Casual and conversational',
      keywords: ['authentic', 'personal', 'story', 'experience'],
      isDefault: false
    }
  ]);

  const [newVoice, setNewVoice] = useState({
    name: '',
    description: '',
    tone: '',
    keywords: ''
  });

  const [profile, setProfile] = useState({
    fullName: user?.email?.split('@')[0] || '',
    email: user?.email || '',
    company: '',
    position: '',
    bio: ''
  });

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    postReminders: true,
    analyticsReports: false,
    teamActivity: true
  });

  const addBrandVoice = () => {
    if (!newVoice.name || !newVoice.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const voice: BrandVoice = {
      id: Date.now().toString(),
      name: newVoice.name,
      description: newVoice.description,
      tone: newVoice.tone,
      keywords: newVoice.keywords.split(',').map(k => k.trim()).filter(k => k),
      isDefault: false
    };

    setBrandVoices([...brandVoices, voice]);
    setNewVoice({ name: '', description: '', tone: '', keywords: '' });
    
    toast({
      title: "Success",
      description: "Brand voice profile created",
    });
  };

  const deleteBrandVoice = (id: string) => {
    setBrandVoices(brandVoices.filter(v => v.id !== id));
    toast({
      title: "Success",
      description: "Brand voice profile deleted",
    });
  };

  const setDefaultVoice = (id: string) => {
    setBrandVoices(brandVoices.map(v => ({ ...v, isDefault: v.id === id })));
    toast({
      title: "Success",
      description: "Default brand voice updated",
    });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account, brand voice, and preferences
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="brand-voice" className="flex items-center gap-2">
                <Mic className="w-4 h-4" />
                Brand Voice
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Team
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Billing
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={profile.fullName}
                        onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={profile.company}
                        onChange={(e) => setProfile({...profile, company: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        value={profile.position}
                        onChange={(e) => setProfile({...profile, position: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    />
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Brand Voice Tab */}
            <TabsContent value="brand-voice">
              <div className="space-y-6">
                {/* Existing Brand Voices */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Brand Voice Profiles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {brandVoices.map((voice) => (
                      <div key={voice.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{voice.name}</h3>
                            {voice.isDefault && (
                              <Badge variant="default">Default</Badge>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {!voice.isDefault && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDefaultVoice(voice.id)}
                              >
                                Set Default
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteBrandVoice(voice.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{voice.description}</p>
                        <p className="text-sm mb-2"><strong>Tone:</strong> {voice.tone}</p>
                        <div className="flex flex-wrap gap-1">
                          {voice.keywords.map((keyword, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Add New Brand Voice */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Create New Brand Voice
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="voiceName">Name *</Label>
                      <Input
                        id="voiceName"
                        placeholder="e.g., Executive, Thought Leader, Casual"
                        value={newVoice.name}
                        onChange={(e) => setNewVoice({...newVoice, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="voiceDescription">Description *</Label>
                      <Textarea
                        id="voiceDescription"
                        placeholder="Describe when and how to use this voice..."
                        value={newVoice.description}
                        onChange={(e) => setNewVoice({...newVoice, description: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="voiceTone">Tone</Label>
                      <Input
                        id="voiceTone"
                        placeholder="e.g., Professional and authoritative, Casual and friendly"
                        value={newVoice.tone}
                        onChange={(e) => setNewVoice({...newVoice, tone: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="voiceKeywords">Keywords (comma separated)</Label>
                      <Input
                        id="voiceKeywords"
                        placeholder="leadership, innovation, growth, strategy"
                        value={newVoice.keywords}
                        onChange={(e) => setNewVoice({...newVoice, keywords: e.target.value})}
                      />
                    </div>
                    <Button onClick={addBrandVoice}>Create Brand Voice</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team">
              <Card>
                <CardHeader>
                  <CardTitle>Team Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Team Features</h3>
                    <p className="mb-6">
                      Upgrade to Team plan to invite team members and manage roles
                    </p>
                    <Button>Upgrade to Team Plan</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Billing & Subscription</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">Free Plan</h3>
                        <p className="text-sm text-muted-foreground">
                          5 cleanups, 3 virality checks per month
                        </p>
                      </div>
                      <Button>Upgrade</Button>
                    </div>
                    <div className="text-center py-8 text-muted-foreground">
                      <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Upgrade to Pro or Team plan for unlimited features</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailUpdates">Email Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive product updates and tips
                      </p>
                    </div>
                    <Switch
                      id="emailUpdates"
                      checked={notifications.emailUpdates}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, emailUpdates: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="postReminders">Post Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Reminders to post consistently
                      </p>
                    </div>
                    <Switch
                      id="postReminders"
                      checked={notifications.postReminders}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, postReminders: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="analyticsReports">Analytics Reports</Label>
                      <p className="text-sm text-muted-foreground">
                        Weekly performance summaries
                      </p>
                    </div>
                    <Switch
                      id="analyticsReports"
                      checked={notifications.analyticsReports}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, analyticsReports: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="teamActivity">Team Activity</Label>
                      <p className="text-sm text-muted-foreground">
                        Updates from team members
                      </p>
                    </div>
                    <Switch
                      id="teamActivity"
                      checked={notifications.teamActivity}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, teamActivity: checked})
                      }
                    />
                  </div>
                  <Button>Save Preferences</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </PageTransition>
  );
}
