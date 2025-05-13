
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label"; // Changed from FormLabel to Label
import { Package } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form"; // Added useForm import

interface PackagesTabProps {
  eventId?: string;
  onClose: () => void;
}

const PackagesTab = ({ eventId, onClose }: PackagesTabProps) => {
  const [packages, setPackages] = useState<any[]>([]);
  const [newPackage, setNewPackage] = useState({
    name: "",
    description: "",
    price: 0
  });
  
  // Initialize form with useForm
  const form = useForm();

  useEffect(() => {
    if (eventId) {
      loadPackages();
    }
  }, [eventId]);

  const loadPackages = async () => {
    if (!eventId) return;
    
    try {
      const { data, error } = await supabase
        .from('sponsorship_packages')
        .select('*')
        .eq('event_id', eventId)
        .order('price', { ascending: true });
      
      if (error) throw error;
      
      setPackages(data || []);
    } catch (error: any) {
      console.error('Error loading sponsorship packages:', error);
    }
  };

  const handleAddPackage = async () => {
    if (!eventId) return;
    if (!newPackage.name || !newPackage.description || newPackage.price <= 0) {
      toast.error("Please fill all package fields with valid values");
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('sponsorship_packages')
        .insert({
          event_id: eventId,
          name: newPackage.name,
          description: newPackage.description,
          price: newPackage.price
        })
        .select();
      
      if (error) throw error;
      
      toast.success("Package added successfully");
      loadPackages();
      setNewPackage({
        name: "",
        description: "",
        price: 0
      });
    } catch (error: any) {
      console.error('Error adding package:', error);
      toast.error(`Error adding package: ${error.message}`);
    }
  };

  const handleDeletePackage = async (packageId: string) => {
    try {
      const { error } = await supabase
        .from('sponsorship_packages')
        .delete()
        .eq('id', packageId);
      
      if (error) throw error;
      
      toast.success("Package deleted successfully");
      loadPackages();
    } catch (error: any) {
      console.error('Error deleting package:', error);
      toast.error(`Error deleting package: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4 space-y-4">
        <h3 className="text-lg font-medium text-gray-800">Add New Package</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="packageName" className="text-gray-800">Package Name</Label>
            <Input 
              id="packageName"
              value={newPackage.name}
              onChange={e => setNewPackage({...newPackage, name: e.target.value})}
              placeholder="e.g. Gold Sponsor"
            />
          </div>
          <div>
            <Label htmlFor="packagePrice" className="text-gray-800">Price (AED)</Label>
            <Input 
              id="packagePrice"
              type="number"
              value={newPackage.price}
              onChange={e => setNewPackage({...newPackage, price: parseFloat(e.target.value)})}
              placeholder="e.g. 5000"
            />
          </div>
          <div className="md:col-span-3">
            <Label htmlFor="packageDescription" className="text-gray-800">Description</Label>
            <Textarea 
              id="packageDescription"
              value={newPackage.description}
              onChange={e => setNewPackage({...newPackage, description: e.target.value})}
              placeholder="Describe what's included in this package"
              rows={3}
            />
          </div>
        </div>
        <Button
          onClick={handleAddPackage}
          className="w-full mt-4"
        >
          Add Package
        </Button>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800">Existing Packages</h3>
        {packages.length === 0 ? (
          <p className="text-slate-600 text-center py-8">
            No sponsorship packages have been created for this event yet.
          </p>
        ) : (
          <div className="space-y-4">
            {packages.map(pkg => (
              <div 
                key={pkg.id} 
                className="border rounded-md p-4 flex items-start justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <h4 className="font-medium text-gray-800">{pkg.name}</h4>
                    <span className="text-sm font-mono text-slate-600">
                      AED {pkg.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {pkg.description}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDeletePackage(pkg.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </div>
  );
};

export default PackagesTab;
