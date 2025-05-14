
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Building, Plus, Pencil, Check, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Define the space type
interface EventSpace {
  id: string;
  name: string;
  location: string;
  capacity: number;
  amenities: string[];
  description: string | null;
  base_price: number;
  image_url: string | null;
  available: boolean;
  created_at: string;
  updated_at: string;
}

// Define the form schema
const spaceFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  location: z.string().min(2, "Location is required"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  base_price: z.coerce.number().min(0, "Price must be zero or positive"),
  description: z.string().optional(),
  amenities: z.string().transform((val) => val.split(',').map(item => item.trim())),
  image_url: z.string().optional(),
  available: z.boolean().default(true)
});

const SpacesTab = () => {
  const [spaces, setSpaces] = useState<EventSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSpace, setEditingSpace] = useState<EventSpace | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(true);

  const form = useForm<z.infer<typeof spaceFormSchema>>({
    resolver: zodResolver(spaceFormSchema),
    defaultValues: {
      name: "",
      location: "",
      capacity: 50,
      base_price: 1000,
      description: "",
      amenities: "",
      image_url: "",
      available: true
    },
  });

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
    form.reset({
      name: "",
      location: "",
      capacity: 50,
      base_price: 1000,
      description: "",
      amenities: "",
      image_url: "",
      available: true
    });
    setIsAddMode(true);
    setIsDialogOpen(true);
  };

  const handleEditSpace = (space: EventSpace) => {
    form.reset({
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

  const onSubmit = async (values: z.infer<typeof spaceFormSchema>) => {
    try {
      if (isAddMode) {
        const { error } = await supabase
          .from("event_spaces")
          .insert([{
            name: values.name,
            location: values.location,
            capacity: values.capacity,
            base_price: values.base_price,
            description: values.description || null,
            amenities: values.amenities,
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
            amenities: values.amenities,
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
        <div className="text-center py-8 border rounded-md bg-slate-800/30">
          <Building className="w-12 h-12 mx-auto text-slate-500 mb-2" />
          <p className="text-slate-500">No event spaces found</p>
          <Button variant="outline" onClick={handleAddSpace} className="mt-4">
            Add Your First Space
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-800/50">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Base Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spaces.map((space) => (
                <TableRow key={space.id}>
                  <TableCell className="font-medium">{space.name}</TableCell>
                  <TableCell>{space.location}</TableCell>
                  <TableCell>{space.capacity}</TableCell>
                  <TableCell>{space.base_price} AED</TableCell>
                  <TableCell>
                    {space.available ? (
                      <Badge className="bg-green-500/20 text-green-500 border-green-500/20">
                        <Check className="h-3 w-3 mr-1" /> Available
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20">
                        <X className="h-3 w-3 mr-1" /> Unavailable
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleEditSpace(space)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isAddMode ? 'Add New Space' : 'Edit Space'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input className="dark-input" placeholder="Event space name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input className="dark-input" placeholder="Dubai, Abu Dhabi, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <Input className="dark-input" type="number" min={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="base_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Price (AED)</FormLabel>
                      <FormControl>
                        <Input className="dark-input" type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="amenities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amenities (comma-separated)</FormLabel>
                    <FormControl>
                      <Input 
                        className="dark-input"
                        placeholder="WiFi, AV equipment, Catering, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        className="dark-input"
                        placeholder="Describe the space..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input 
                        className="dark-input"
                        placeholder="https://example.com/image.jpg"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="available"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Available</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">{isAddMode ? 'Add Space' : 'Update Space'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SpacesTab;
