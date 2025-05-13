
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Layout, Image, Users } from "lucide-react";

interface AdminSettingsProps {
  settings?: {
    id: string;
    notification_emails: string[];
    require_otp_verification?: boolean;
    hero_video_url?: string;
  } | null;
  onSettingsSaved?: () => void;
}

const AdminSettings = ({ settings: initialSettings, onSettingsSaved }: AdminSettingsProps) => {
  const [settings, setSettings] = useState(initialSettings);
  const [requireOtp, setRequireOtp] = useState(initialSettings?.require_otp_verification ?? true);
  const [heroVideoUrl, setHeroVideoUrl] = useState(initialSettings?.hero_video_url ?? "");
  const [notificationEmails, setNotificationEmails] = useState<string[]>(initialSettings?.notification_emails || []);
  const [newEmail, setNewEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
      setRequireOtp(initialSettings.require_otp_verification !== undefined ? initialSettings.require_otp_verification : true);
      setHeroVideoUrl(initialSettings.hero_video_url ?? "");
      setNotificationEmails(initialSettings.notification_emails || []);
    }
  }, [initialSettings]);

  const handleSaveSettings = async () => {
    if (!settings?.id) {
      toast.error("No settings record found");
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .update({
          require_otp_verification: requireOtp,
          hero_video_url: heroVideoUrl,
          notification_emails: notificationEmails,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings.id);
      
      if (error) throw error;
      
      toast.success("Settings updated successfully");
      if (onSettingsSaved) onSettingsSaved();
    } catch (error: any) {
      console.error('Error updating settings:', error);
      toast.error(`Error updating settings: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const addEmail = () => {
    if (!newEmail) return;
    
    if (notificationEmails.includes(newEmail)) {
      toast.error("Email already exists in the list");
      return;
    }
    
    setNotificationEmails([...notificationEmails, newEmail]);
    setNewEmail("");
  };

  const removeEmail = (email: string) => {
    setNotificationEmails(notificationEmails.filter(e => e !== email));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">System Settings</h2>
          <p className="text-slate-600">Manage platform-wide settings and configurations</p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-[400px]">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-800">Security Settings</CardTitle>
              <CardDescription className="text-slate-600">
                Configure security settings for user accounts and platform access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">OTP Phone Verification</p>
                  <p className="text-sm text-slate-600">
                    When enabled, users must verify their phone number when posting events or submitting bids
                  </p>
                </div>
                <Switch 
                  checked={requireOtp} 
                  onCheckedChange={setRequireOtp}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-800">Homepage Appearance</CardTitle>
              <CardDescription className="text-slate-600">
                Configure visual elements of the landing page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Image className="h-4 w-4 text-primary" />
                  <Label className="text-gray-800">Hero Section Video URL</Label>
                </div>
                <Input
                  value={heroVideoUrl}
                  onChange={(e) => setHeroVideoUrl(e.target.value)}
                  placeholder="Enter video URL for hero section"
                  className="w-full"
                />
                <p className="text-sm text-slate-600">
                  Enter the URL for the video to be displayed in the homepage hero section
                </p>
              </div>
              
              <div className="border rounded-md p-4 mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Image className="h-4 w-4 text-primary" />
                  <p className="font-medium text-gray-800">Video Preview</p>
                </div>
                <div className="aspect-video rounded-md overflow-hidden bg-muted relative">
                  {heroVideoUrl ? (
                    <iframe 
                      src={heroVideoUrl} 
                      className="w-full h-full object-cover"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-slate-600">No video URL provided</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-800">Admin Notification Settings</CardTitle>
              <CardDescription className="text-slate-600">
                Configure email addresses for system notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter admin email address"
                  className="flex-1"
                />
                <Button onClick={addEmail} type="button">Add Email</Button>
              </div>
              
              <div className="mt-4">
                <Label className="text-sm font-medium text-gray-800">Admin Emails</Label>
                {notificationEmails.length === 0 ? (
                  <p className="text-sm text-slate-600 mt-2">No admin emails configured</p>
                ) : (
                  <div className="mt-2 space-y-2">
                    {notificationEmails.map((email) => (
                      <div key={email} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <span className="text-gray-800">{email}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeEmail(email)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Separator />
      
      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button 
          onClick={handleSaveSettings}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
