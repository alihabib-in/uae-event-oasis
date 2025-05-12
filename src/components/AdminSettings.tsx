
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";

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
  const [heroVideoUrl, setHeroVideoUrl] = useState(initialSettings?.hero_video_url ?? "https://ai.invideo.io/workspace/b00f9134-fc98-4d60-a00a-ad1575e0b963/v30-copilot");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
      setRequireOtp(initialSettings.require_otp_verification !== undefined ? initialSettings.require_otp_verification : true);
      setHeroVideoUrl(initialSettings.hero_video_url ?? "https://ai.invideo.io/workspace/b00f9134-fc98-4d60-a00a-ad1575e0b963/v30-copilot");
    }
  }, [initialSettings]);

  const handleSaveSettings = async () => {
    if (!settings?.id) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .update({
          require_otp_verification: requireOtp,
          hero_video_url: heroVideoUrl,
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
        <CardDescription>
          Configure global settings for the application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">OTP Phone Verification</p>
            <p className="text-sm text-muted-foreground">
              When enabled, users must verify their phone number when posting events or submitting bids
            </p>
          </div>
          <Switch 
            checked={requireOtp} 
            onCheckedChange={setRequireOtp}
          />
        </div>
        
        <div className="space-y-2">
          <FormLabel>Hero Section Video URL</FormLabel>
          <Input
            value={heroVideoUrl}
            onChange={(e) => setHeroVideoUrl(e.target.value)}
            placeholder="Enter video URL for hero section"
          />
          <p className="text-sm text-muted-foreground">
            Enter the URL for the video to be displayed in the homepage hero section
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSaveSettings}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminSettings;
