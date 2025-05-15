
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Building, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import SpacesList from "./SpacesList";
import SpaceForm, { SpaceFormValues, spaceFormSchema } from "./SpaceForm";
import { EventSpace } from "@/types/spaces";

const SpacesTab = () => {
  const [spaces, setSpaces] = useState<EventSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSpace, setEditingSpace] = useState<EventSpace | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(true);
  
  const defaultFormValues: SpaceFormValues = {
    name: "",
    location: "",
    capacity: 50,
    base_price: 0, // Change to 0 since it's quote only
    description: "",
    amenities: "",
    image_url: "",
    available: true
  };
  
  const [formInitialValues, setFormInitialValues] = useState<SpaceFormValues>(defaultFormValues);

  const fetchSpaces = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("event_spaces")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSpaces(data || []);
    } catch (error: any) {
      console.error("Error fetching spaces:", error.message);
      toast({
        variant: "destructive",
        title: "Error fetching spaces",
        description: error.message || "There was a problem loading the event spaces."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  const handleAddSpace = () => {
    setFormInitialValues(defaultFormValues);
    setIsAddMode(true);
    setEditingSpace(null);
    setIsDialogOpen(true);
  };

  const handleEditSpace = (space: EventSpace) => {
    // Convert the amenities array to a comma-separated string for editing
    setFormInitialValues({
      name: space.name,
      location: space.location,
      capacity: space.capacity,
      base_price: space.base_price,
      description: space.description || "",
      amenities: space.amenities.join(", "),
      image_url: space.image_url || "",
      available: space.available
    });
    setEditingSpace(space);
    setIsAddMode(false);
    setIsDialogOpen(true);
  };

  const onSubmit = async (values: SpaceFormValues) => {
    try {
      // Parse with zod to transform amenities string to array
      const transformedValues = spaceFormSchema.parse(values);
      
      if (isAddMode) {
        const { error } = await supabase
          .from("event_spaces")
          .insert([{
            name: values.name,
            location: values.location,
            capacity: values.capacity,
            base_price: values.base_price,
            description: values.description || null,
            amenities: transformedValues.amenities,
            image_url: values.image_url || null,
            available: values.available
          }]);

        if (error) throw error;

        toast({
          title: "Space Added",
          description: "The event space was added successfully."
        });
      } else if (editingSpace) {
        const { error } = await supabase
          .from("event_spaces")
          .update({
            name: values.name,
            location: values.location,
            capacity: values.capacity,
            base_price: values.base_price,
            description: values.description || null,
            amenities: transformedValues.amenities,
            image_url: values.image_url || null,
            available: values.available,
            updated_at: new Date().toISOString()
          })
          .eq("id", editingSpace.id);

        if (error) throw error;

        toast({
          title: "Space Updated",
          description: "The event space was updated successfully."
        });
      }

      setIsDialogOpen(false);
      fetchSpaces();
    } catch (error: any) {
      console.error("Error saving space:", error);
      toast({
        variant: "destructive",
        title: "Error saving space",
        description: error.message || "There was a problem saving the event space."
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Event Spaces</h2>
        <Button onClick={handleAddSpace} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add Space
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : spaces.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-slate-100">
          <Building className="w-12 h-12 mx-auto text-slate-500 mb-2" />
          <p className="text-slate-500">No event spaces found</p>
          <Button variant="outline" onClick={handleAddSpace} className="mt-4">
            Add Your First Space
          </Button>
        </div>
      ) : (
        <SpacesList spaces={spaces} onEdit={handleEditSpace} />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isAddMode ? 'Add New Space' : 'Edit Space'}</DialogTitle>
          </DialogHeader>
          <SpaceForm 
            isAddMode={isAddMode}
            initialValues={formInitialValues}
            onSubmit={onSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SpacesTab;
