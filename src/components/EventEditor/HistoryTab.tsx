
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { X, Plus } from "lucide-react";

interface HistoryTabProps {
  event?: any;
  onClose: () => void;
}

const HistoryTab = ({ event, onClose }: HistoryTabProps) => {
  const [formData, setFormData] = useState({
    previous_editions: { total_editions: 0, years_running: 0 },
    attendance_growth: { year_over_year: 0, total_growth: 0 },
    notable_sponsors: [] as string[],
    awards_recognition: [] as string[],
    media_coverage: { tv: 0, print: 0, online: 0, social_media: 0 },
    success_stories: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSponsor, setNewSponsor] = useState("");
  const [newAward, setNewAward] = useState("");
  const [newStory, setNewStory] = useState("");

  useEffect(() => {
    if (event?.id) {
      loadHistoryData();
    }
  }, [event]);

  const loadHistoryData = async () => {
    if (!event?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('event_history')
        .select('*')
        .eq('event_id', event.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setFormData({
          previous_editions: data.previous_editions || { total_editions: 0, years_running: 0 },
          attendance_growth: data.attendance_growth || { year_over_year: 0, total_growth: 0 },
          notable_sponsors: data.notable_sponsors || [],
          awards_recognition: data.awards_recognition || [],
          media_coverage: data.media_coverage || { tv: 0, print: 0, online: 0, social_media: 0 },
          success_stories: data.success_stories || []
        });
      }
    } catch (error: any) {
      console.error('Error loading history data:', error);
    }
  };

  const addSponsor = () => {
    if (newSponsor.trim() && !formData.notable_sponsors.includes(newSponsor.trim())) {
      setFormData(prev => ({
        ...prev,
        notable_sponsors: [...prev.notable_sponsors, newSponsor.trim()]
      }));
      setNewSponsor("");
    }
  };

  const removeSponsor = (sponsor: string) => {
    setFormData(prev => ({
      ...prev,
      notable_sponsors: prev.notable_sponsors.filter(s => s !== sponsor)
    }));
  };

  const addAward = () => {
    if (newAward.trim() && !formData.awards_recognition.includes(newAward.trim())) {
      setFormData(prev => ({
        ...prev,
        awards_recognition: [...prev.awards_recognition, newAward.trim()]
      }));
      setNewAward("");
    }
  };

  const removeAward = (award: string) => {
    setFormData(prev => ({
      ...prev,
      awards_recognition: prev.awards_recognition.filter(a => a !== award)
    }));
  };

  const addStory = () => {
    if (newStory.trim() && !formData.success_stories.includes(newStory.trim())) {
      setFormData(prev => ({
        ...prev,
        success_stories: [...prev.success_stories, newStory.trim()]
      }));
      setNewStory("");
    }
  };

  const removeStory = (story: string) => {
    setFormData(prev => ({
      ...prev,
      success_stories: prev.success_stories.filter(s => s !== story)
    }));
  };

  const handleSubmit = async () => {
    if (!event?.id) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('event_history')
        .upsert({
          event_id: event.id,
          ...formData,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast.success("Event history saved successfully");
    } catch (error: any) {
      console.error('Error saving history data:', error);
      toast.error(`Error saving data: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium text-gray-800">Previous Editions</Label>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <Label htmlFor="total_editions" className="text-sm">Total Editions</Label>
            <Input
              id="total_editions"
              type="number"
              min="0"
              value={formData.previous_editions.total_editions}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                previous_editions: {
                  ...prev.previous_editions,
                  total_editions: parseInt(e.target.value) || 0
                }
              }))}
            />
          </div>
          <div>
            <Label htmlFor="years_running" className="text-sm">Years Running</Label>
            <Input
              id="years_running"
              type="number"
              min="0"
              value={formData.previous_editions.years_running}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                previous_editions: {
                  ...prev.previous_editions,
                  years_running: parseInt(e.target.value) || 0
                }
              }))}
            />
          </div>
        </div>
      </div>

      <div>
        <Label className="text-base font-medium text-gray-800">Attendance Growth (%)</Label>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <Label htmlFor="year_over_year" className="text-sm">Year over Year</Label>
            <Input
              id="year_over_year"
              type="number"
              value={formData.attendance_growth.year_over_year}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                attendance_growth: {
                  ...prev.attendance_growth,
                  year_over_year: parseInt(e.target.value) || 0
                }
              }))}
            />
          </div>
          <div>
            <Label htmlFor="total_growth" className="text-sm">Total Growth</Label>
            <Input
              id="total_growth"
              type="number"
              value={formData.attendance_growth.total_growth}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                attendance_growth: {
                  ...prev.attendance_growth,
                  total_growth: parseInt(e.target.value) || 0
                }
              }))}
            />
          </div>
        </div>
      </div>

      <div>
        <Label className="text-base font-medium text-gray-800">Notable Sponsors</Label>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Add sponsor..."
            value={newSponsor}
            onChange={(e) => setNewSponsor(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addSponsor()}
          />
          <Button type="button" onClick={addSponsor}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.notable_sponsors.map(sponsor => (
            <Badge key={sponsor} variant="secondary" className="flex items-center gap-1">
              {sponsor}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeSponsor(sponsor)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-medium text-gray-800">Awards & Recognition</Label>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Add award..."
            value={newAward}
            onChange={(e) => setNewAward(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addAward()}
          />
          <Button type="button" onClick={addAward}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.awards_recognition.map(award => (
            <Badge key={award} variant="secondary" className="flex items-center gap-1">
              {award}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeAward(award)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-medium text-gray-800">Media Coverage</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          <div>
            <Label htmlFor="tv" className="text-sm">TV</Label>
            <Input
              id="tv"
              type="number"
              min="0"
              value={formData.media_coverage.tv}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                media_coverage: {
                  ...prev.media_coverage,
                  tv: parseInt(e.target.value) || 0
                }
              }))}
            />
          </div>
          <div>
            <Label htmlFor="print" className="text-sm">Print</Label>
            <Input
              id="print"
              type="number"
              min="0"
              value={formData.media_coverage.print}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                media_coverage: {
                  ...prev.media_coverage,
                  print: parseInt(e.target.value) || 0
                }
              }))}
            />
          </div>
          <div>
            <Label htmlFor="online" className="text-sm">Online</Label>
            <Input
              id="online"
              type="number"
              min="0"
              value={formData.media_coverage.online}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                media_coverage: {
                  ...prev.media_coverage,
                  online: parseInt(e.target.value) || 0
                }
              }))}
            />
          </div>
          <div>
            <Label htmlFor="social_media" className="text-sm">Social Media</Label>
            <Input
              id="social_media"
              type="number"
              min="0"
              value={formData.media_coverage.social_media}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                media_coverage: {
                  ...prev.media_coverage,
                  social_media: parseInt(e.target.value) || 0
                }
              }))}
            />
          </div>
        </div>
      </div>

      <div>
        <Label className="text-base font-medium text-gray-800">Success Stories</Label>
        <div className="flex gap-2 mt-2">
          <Textarea
            placeholder="Add success story..."
            value={newStory}
            onChange={(e) => setNewStory(e.target.value)}
            rows={2}
          />
          <Button type="button" onClick={addStory} className="self-start">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2 mt-2">
          {formData.success_stories.map((story, index) => (
            <div key={index} className="flex items-start gap-2 p-2 border rounded">
              <span className="flex-1 text-sm">{story}</span>
              <X
                className="h-4 w-4 cursor-pointer text-red-500"
                onClick={() => removeStory(story)}
              />
            </div>
          ))}
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save History"}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default HistoryTab;
