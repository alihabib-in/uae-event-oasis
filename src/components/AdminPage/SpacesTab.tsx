
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Building, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import SpacesList from "./SpacesList";
import SpaceForm, { SpaceFormValues, spaceFormSchema } from "./SpaceForm";
import { EventSpace } from "@/types/spaces";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const SpacesTab = () => {
  const [spaces, setSpaces] = useState<EventSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSpace, setEditingSpace] = useState<EventSpace | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [spaceToDelete, setSpaceToDelete] = useState<string | null>(null);
  
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

  const handleDeleteSpace = (spaceId: string) => {
    setSpaceToDelete(spaceId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!spaceToDelete) return;

    try {
      const { error } = await supabase
        .from("event_spaces")
        .delete()
        .eq("id", spaceToDelete);

      if (error) throw error;

      toast({
        title: "Space Deleted",
        description: "The event space was deleted successfully."
      });
      
      setIsDeleteDialogOpen(false);
      setSpaceToDelete(null);
      fetchSpaces();
    } catch (error: any) {
      console.error("Error deleting space:", error.message);
      toast({
        variant: "destructive",
        title: "Error deleting space",
        description: error.message || "There was a problem deleting the event space."
      });
    }
  };

  const addSampleData = async () => {
    setLoading(true);
    try {
      const sampleSpaces = [
        {
          name: "Grand Ballroom",
          location: "Downtown Dubai",
          capacity: 500,
          base_price: 10000,
          description: "Luxurious ballroom with crystal chandeliers and marble flooring",
          amenities: ["Wi-Fi", "Stage", "Sound System", "Projector", "Dance Floor"],
          image_url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3",
          available: true
        },
        {
          name: "Seaside Pavilion",
          location: "Jumeirah Beach",
          capacity: 200,
          base_price: 7500,
          description: "Beautiful outdoor venue with panoramic ocean views",
          amenities: ["Beachfront", "Tents", "Outdoor Lighting", "Parking"],
          image_url: "https://images.unsplash.com/photo-1604422377889-541c918e96e5?ixlib=rb-4.0.3",
          available: true
        },
        {
          name: "Conference Center",
          location: "Business Bay",
          capacity: 150,
          base_price: 5000,
          description: "Modern conference space with state-of-the-art technology",
          amenities: ["Wi-Fi", "Video Conferencing", "Breakout Rooms", "Catering"],
          image_url: "https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3",
          available: true
        }
      ];
      
      const { error } = await supabase
        .from("event_spaces")
        .insert(sampleSpaces);
        
      if (error) throw error;
      
      toast({
        title: "Sample Spaces Added",
        description: "Sample event spaces were added successfully."
      });
      
      fetchSpaces();
    } catch (error: any) {
      console.error("Error adding sample spaces:", error.message);
      toast({
        variant: "destructive",
        title: "Error adding sample spaces",
        description: error.message || "There was a problem adding the sample event spaces."
      });
    } finally {
      setLoading(false);
    }
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
        <div className="flex gap-2">
          <Button onClick={addSampleData} variant="outline" className="flex items-center gap-1">
            Add Sample Data
          </Button>
          <Button onClick={handleAddSpace} className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> Add Space
          </Button>
        </div>
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
        <SpacesList spaces={spaces} onEdit={handleEditSpace} onDelete={handleDeleteSpace} />
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this event space. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SpacesTab;
