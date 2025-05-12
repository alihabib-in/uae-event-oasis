
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Package } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface PackagesTabProps {
  eventId?: string;
  onClose: () => void;
}

// Schema for package form validation
const packageSchema = z.object({
  name: z.string().min(1, "Package name is required"),
  price: z.coerce.number().min(1, "Price must be at least 1"),
  description: z.string().min(1, "Description is required"),
});

type PackageFormValues = z.infer<typeof packageSchema>;

const PackagesTab = ({ eventId, onClose }: PackagesTabProps) => {
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize the form
  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
    },
  });

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

  const onSubmit = async (values: PackageFormValues) => {
    if (!eventId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('sponsorship_packages')
        .insert({
          event_id: eventId,
          name: values.name,
          description: values.description,
          price: values.price
        })
        .select();
      
      if (error) throw error;
      
      toast.success("Package added successfully");
      loadPackages();
      form.reset();
    } catch (error: any) {
      console.error('Error adding package:', error);
      toast.error(`Error adding package: ${error.message}`);
    } finally {
      setIsLoading(false);
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
        <h3 className="text-lg font-medium">Add New Package</h3>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Package Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Gold Sponsor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (AED)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="md:col-span-3">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe what's included in this package" 
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <Button 
              type="submit"
              className="w-full mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Package"}
            </Button>
          </form>
        </Form>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Existing Packages</h3>
        {packages.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
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
                    <h4 className="font-medium">{pkg.name}</h4>
                    <span className="text-sm font-mono text-muted-foreground">
                      AED {pkg.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
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
