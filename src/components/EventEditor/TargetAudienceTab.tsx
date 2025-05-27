
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";

interface TargetAudienceTabProps {
  event?: any;
  onClose: () => void;
}

const TargetAudienceTab = ({ event, onClose }: TargetAudienceTabProps) => {
  const [formData, setFormData] = useState({
    age_groups: [] as string[],
    gender_distribution: { male: 0, female: 0, other: 0 },
    income_levels: [] as string[],
    interests: [] as string[],
    geographic_location: [] as string[],
    profession_types: [] as string[],
    education_levels: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newInterest, setNewInterest] = useState("");
  const [newLocation, setNewLocation] = useState("");

  useEffect(() => {
    if (event?.id) {
      loadTargetAudienceData();
    }
  }, [event]);

  const loadTargetAudienceData = async () => {
    if (!event?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('event_target_audience')
        .select('*')
        .eq('event_id', event.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setFormData({
          age_groups: data.age_groups || [],
          gender_distribution: data.gender_distribution || { male: 0, female: 0, other: 0 },
          income_levels: data.income_levels || [],
          interests: data.interests || [],
          geographic_location: data.geographic_location || [],
          profession_types: data.profession_types || [],
          education_levels: data.education_levels || []
        });
      }
    } catch (error: any) {
      console.error('Error loading target audience data:', error);
    }
  };

  const handleAgeGroupChange = (ageGroup: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      age_groups: checked 
        ? [...prev.age_groups, ageGroup]
        : prev.age_groups.filter(age => age !== ageGroup)
    }));
  };

  const handleIncomeChange = (income: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      income_levels: checked 
        ? [...prev.income_levels, income]
        : prev.income_levels.filter(level => level !== income)
    }));
  };

  const handleProfessionChange = (profession: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      profession_types: checked 
        ? [...prev.profession_types, profession]
        : prev.profession_types.filter(type => type !== profession)
    }));
  };

  const handleEducationChange = (education: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      education_levels: checked 
        ? [...prev.education_levels, education]
        : prev.education_levels.filter(level => level !== education)
    }));
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const addLocation = () => {
    if (newLocation.trim() && !formData.geographic_location.includes(newLocation.trim())) {
      setFormData(prev => ({
        ...prev,
        geographic_location: [...prev.geographic_location, newLocation.trim()]
      }));
      setNewLocation("");
    }
  };

  const removeLocation = (location: string) => {
    setFormData(prev => ({
      ...prev,
      geographic_location: prev.geographic_location.filter(l => l !== location)
    }));
  };

  const handleSubmit = async () => {
    if (!event?.id) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('event_target_audience')
        .upsert({
          event_id: event.id,
          ...formData,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast.success("Target audience data saved successfully");
    } catch (error: any) {
      console.error('Error saving target audience data:', error);
      toast.error(`Error saving data: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ageGroups = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];
  const incomeRanges = ["<25K AED", "25K-50K AED", "50K-100K AED", "100K-200K AED", "200K+ AED"];
  const professionTypes = ["Business Executive", "Entrepreneur", "Professional", "Student", "Freelancer", "Government", "Healthcare", "Education", "Technology", "Finance"];
  const educationLevels = ["High School", "Bachelor's Degree", "Master's Degree", "PhD", "Professional Certification"];

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium text-gray-800">Age Groups</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
          {ageGroups.map(age => (
            <div key={age} className="flex items-center space-x-2">
              <Checkbox
                id={age}
                checked={formData.age_groups.includes(age)}
                onCheckedChange={(checked) => handleAgeGroupChange(age, checked as boolean)}
              />
              <Label htmlFor={age} className="text-sm">{age}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-medium text-gray-800">Gender Distribution (%)</Label>
        <div className="grid grid-cols-3 gap-4 mt-2">
          <div>
            <Label htmlFor="male" className="text-sm">Male</Label>
            <Input
              id="male"
              type="number"
              min="0"
              max="100"
              value={formData.gender_distribution.male}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                gender_distribution: {
                  ...prev.gender_distribution,
                  male: parseInt(e.target.value) || 0
                }
              }))}
            />
          </div>
          <div>
            <Label htmlFor="female" className="text-sm">Female</Label>
            <Input
              id="female"
              type="number"
              min="0"
              max="100"
              value={formData.gender_distribution.female}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                gender_distribution: {
                  ...prev.gender_distribution,
                  female: parseInt(e.target.value) || 0
                }
              }))}
            />
          </div>
          <div>
            <Label htmlFor="other" className="text-sm">Other</Label>
            <Input
              id="other"
              type="number"
              min="0"
              max="100"
              value={formData.gender_distribution.other}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                gender_distribution: {
                  ...prev.gender_distribution,
                  other: parseInt(e.target.value) || 0
                }
              }))}
            />
          </div>
        </div>
      </div>

      <div>
        <Label className="text-base font-medium text-gray-800">Income Levels</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
          {incomeRanges.map(income => (
            <div key={income} className="flex items-center space-x-2">
              <Checkbox
                id={income}
                checked={formData.income_levels.includes(income)}
                onCheckedChange={(checked) => handleIncomeChange(income, checked as boolean)}
              />
              <Label htmlFor={income} className="text-sm">{income}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-medium text-gray-800">Interests</Label>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Add interest..."
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addInterest()}
          />
          <Button type="button" onClick={addInterest}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.interests.map(interest => (
            <Badge key={interest} variant="secondary" className="flex items-center gap-1">
              {interest}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeInterest(interest)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-medium text-gray-800">Geographic Location</Label>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Add location..."
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addLocation()}
          />
          <Button type="button" onClick={addLocation}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.geographic_location.map(location => (
            <Badge key={location} variant="secondary" className="flex items-center gap-1">
              {location}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeLocation(location)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-medium text-gray-800">Profession Types</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
          {professionTypes.map(profession => (
            <div key={profession} className="flex items-center space-x-2">
              <Checkbox
                id={profession}
                checked={formData.profession_types.includes(profession)}
                onCheckedChange={(checked) => handleProfessionChange(profession, checked as boolean)}
              />
              <Label htmlFor={profession} className="text-sm">{profession}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-medium text-gray-800">Education Levels</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
          {educationLevels.map(education => (
            <div key={education} className="flex items-center space-x-2">
              <Checkbox
                id={education}
                checked={formData.education_levels.includes(education)}
                onCheckedChange={(checked) => handleEducationChange(education, checked as boolean)}
              />
              <Label htmlFor={education} className="text-sm">{education}</Label>
            </div>
          ))}
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Target Audience"}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default TargetAudienceTab;
