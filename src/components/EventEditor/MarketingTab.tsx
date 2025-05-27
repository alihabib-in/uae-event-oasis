
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { X, Plus } from "lucide-react";

interface MarketingTabProps {
  event?: any;
  onClose: () => void;
}

const MarketingTab = ({ event, onClose }: MarketingTabProps) => {
  const [formData, setFormData] = useState({
    marketing_channels: [] as string[],
    social_media_reach: { facebook: 0, instagram: 0, twitter: 0, linkedin: 0, youtube: 0 },
    advertising_budget: 0,
    promotional_materials: [] as string[],
    media_partnerships: [] as string[],
    influencer_collaborations: [] as string[],
    expected_reach: { online: 0, offline: 0, total: 0 }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newMaterial, setNewMaterial] = useState("");
  const [newPartnership, setNewPartnership] = useState("");
  const [newInfluencer, setNewInfluencer] = useState("");

  useEffect(() => {
    if (event?.id) {
      loadMarketingData();
    }
  }, [event]);

  const loadMarketingData = async () => {
    if (!event?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('event_marketing')
        .select('*')
        .eq('event_id', event.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        // Helper functions to safely parse JSONB data
        const parseSocialMediaReach = (value: any) => {
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            return {
              facebook: typeof value.facebook === 'number' ? value.facebook : 0,
              instagram: typeof value.instagram === 'number' ? value.instagram : 0,
              twitter: typeof value.twitter === 'number' ? value.twitter : 0,
              linkedin: typeof value.linkedin === 'number' ? value.linkedin : 0,
              youtube: typeof value.youtube === 'number' ? value.youtube : 0
            };
          }
          return { facebook: 0, instagram: 0, twitter: 0, linkedin: 0, youtube: 0 };
        };

        const parseExpectedReach = (value: any) => {
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            return {
              online: typeof value.online === 'number' ? value.online : 0,
              offline: typeof value.offline === 'number' ? value.offline : 0,
              total: typeof value.total === 'number' ? value.total : 0
            };
          }
          return { online: 0, offline: 0, total: 0 };
        };

        setFormData({
          marketing_channels: Array.isArray(data.marketing_channels) ? data.marketing_channels : [],
          social_media_reach: parseSocialMediaReach(data.social_media_reach),
          advertising_budget: typeof data.advertising_budget === 'number' ? data.advertising_budget : 0,
          promotional_materials: Array.isArray(data.promotional_materials) ? data.promotional_materials : [],
          media_partnerships: Array.isArray(data.media_partnerships) ? data.media_partnerships : [],
          influencer_collaborations: Array.isArray(data.influencer_collaborations) ? data.influencer_collaborations : [],
          expected_reach: parseExpectedReach(data.expected_reach)
        });
      }
    } catch (error: any) {
      console.error('Error loading marketing data:', error);
    }
  };

  const handleChannelChange = (channel: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      marketing_channels: checked 
        ? [...prev.marketing_channels, channel]
        : prev.marketing_channels.filter(c => c !== channel)
    }));
  };

  const addMaterial = () => {
    if (newMaterial.trim() && !formData.promotional_materials.includes(newMaterial.trim())) {
      setFormData(prev => ({
        ...prev,
        promotional_materials: [...prev.promotional_materials, newMaterial.trim()]
      }));
      setNewMaterial("");
    }
  };

  const removeMaterial = (material: string) => {
    setFormData(prev => ({
      ...prev,
      promotional_materials: prev.promotional_materials.filter(m => m !== material)
    }));
  };

  const addPartnership = () => {
    if (newPartnership.trim() && !formData.media_partnerships.includes(newPartnership.trim())) {
      setFormData(prev => ({
        ...prev,
        media_partnerships: [...prev.media_partnerships, newPartnership.trim()]
      }));
      setNewPartnership("");
    }
  };

  const removePartnership = (partnership: string) => {
    setFormData(prev => ({
      ...prev,
      media_partnerships: prev.media_partnerships.filter(p => p !== partnership)
    }));
  };

  const addInfluencer = () => {
    if (newInfluencer.trim() && !formData.influencer_collaborations.includes(newInfluencer.trim())) {
      setFormData(prev => ({
        ...prev,
        influencer_collaborations: [...prev.influencer_collaborations, newInfluencer.trim()]
      }));
      setNewInfluencer("");
    }
  };

  const removeInfluencer = (influencer: string) => {
    setFormData(prev => ({
      ...prev,
      influencer_collaborations: prev.influencer_collaborations.filter(i => i !== influencer)
    }));
  };

  const handleSubmit = async () => {
    if (!event?.id) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('event_marketing')
        .upsert({
          event_id: event.id,
          ...formData,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast.success("Marketing data saved successfully");
    } catch (error: any) {
      console.error('Error saving marketing data:', error);
      toast.error(`Error saving data: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const marketingChannels = ["Social Media", "Email Marketing", "Print Advertising", "Radio", "TV", "Online Advertising", "Influencer Marketing", "Content Marketing", "SEO", "Event Marketing"];

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium text-gray-800">Marketing Channels</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
          {marketingChannels.map(channel => (
            <div key={channel} className="flex items-center space-x-2">
              <Checkbox
                id={channel}
                checked={formData.marketing_channels.includes(channel)}
                onCheckedChange={(checked) => handleChannelChange(channel, checked as boolean)}
              />
              <Label htmlFor={channel} className="text-sm">{channel}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-medium text-gray-800">Social Media Reach</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          <div>
            <Label htmlFor="facebook" className="text-sm">Facebook</Label>
            <Input
              id="facebook"
              type="number"
              min="0"
              value={formData.social_media_reach.facebook}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                social_media_reach: {
                  ...prev.social_media_reach,
                  facebook: parseInt(e.target.value) || 0
                }
              }))}
            />
          </div>
          <div>
            <Label htmlFor="instagram" className="text-sm">Instagram</Label>
            <Input
              id="instagram"
              type="number"
              min="0"
              value={formData.social_media_reach.instagram}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                social_media_reach: {
                  ...prev.social_media_reach,
                  instagram: parseInt(e.target.value) || 0
                }
              }))}
            />
          </div>
          <div>
            <Label htmlFor="twitter" className="text-sm">Twitter</Label>
            <Input
              id="twitter"
              type="number"
              min="0"
              value={formData.social_media_reach.twitter}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                social_media_reach: {
                  ...prev.social_media_reach,
                  twitter: parseInt(e.target.value) || 0
                }
              }))}
            />
          </div>
          <div>
            <Label htmlFor="linkedin" className="text-sm">LinkedIn</Label>
            <Input
              id="linkedin"
              type="number"
              min="0"
              value={formData.social_media_reach.linkedin}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                social_media_reach: {
                  ...prev.social_media_reach,
                  linkedin: parseInt(e.target.value) || 0
                }
              }))}
            />
          </div>
          <div>
            <Label htmlFor="youtube" className="text-sm">YouTube</Label>
            <Input
              id="youtube"
              type="number"
              min="0"
              value={formData.social_media_reach.youtube}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                social_media_reach: {
                  ...prev.social_media_reach,
                  youtube: parseInt(e.target.value) || 0
                }
              }))}
            />
          </div>
        </div>
      </div>

      <div>
        <Label className="text-base font-medium text-gray-800">Advertising Budget (AED)</Label>
        <Input
          type="number"
          min="0"
          value={formData.advertising_budget}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            advertising_budget: parseFloat(e.target.value) || 0
          }))}
          className="mt-2"
        />
      </div>

      <div>
        <Label className="text-base font-medium text-gray-800">Promotional Materials</Label>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Add promotional material..."
            value={newMaterial}
            onChange={(e) => setNewMaterial(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addMaterial()}
          />
          <Button type="button" onClick={addMaterial}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.promotional_materials.map(material => (
            <Badge key={material} variant="secondary" className="flex items-center gap-1">
              {material}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeMaterial(material)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-medium text-gray-800">Media Partnerships</Label>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Add media partnership..."
            value={newPartnership}
            onChange={(e) => setNewPartnership(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addPartnership()}
          />
          <Button type="button" onClick={addPartnership}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.media_partnerships.map(partnership => (
            <Badge key={partnership} variant="secondary" className="flex items-center gap-1">
              {partnership}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removePartnership(partnership)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-medium text-gray-800">Influencer Collaborations</Label>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Add influencer collaboration..."
            value={newInfluencer}
            onChange={(e) => setNewInfluencer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addInfluencer()}
          />
          <Button type="button" onClick={addInfluencer}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.influencer_collaborations.map(influencer => (
            <Badge key={influencer} variant="secondary" className="flex items-center gap-1">
              {influencer}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeInfluencer(influencer)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-medium text-gray-800">Expected Reach</Label>
        <div className="grid grid-cols-3 gap-4 mt-2">
          <div>
            <Label htmlFor="online_reach" className="text-sm">Online</Label>
            <Input
              id="online_reach"
              type="number"
              min="0"
              value={formData.expected_reach.online}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                expected_reach: {
                  ...prev.expected_reach,
                  online: parseInt(e.target.value) || 0
                }
              }))}
            />
          </div>
          <div>
            <Label htmlFor="offline_reach" className="text-sm">Offline</Label>
            <Input
              id="offline_reach"
              type="number"
              min="0"
              value={formData.expected_reach.offline}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                expected_reach: {
                  ...prev.expected_reach,
                  offline: parseInt(e.target.value) || 0
                }
              }))}
            />
          </div>
          <div>
            <Label htmlFor="total_reach" className="text-sm">Total</Label>
            <Input
              id="total_reach"
              type="number"
              min="0"
              value={formData.expected_reach.total}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                expected_reach: {
                  ...prev.expected_reach,
                  total: parseInt(e.target.value) || 0
                }
              }))}
            />
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Marketing"}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default MarketingTab;
