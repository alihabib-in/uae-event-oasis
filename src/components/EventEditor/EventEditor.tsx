
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import DetailsTab from "./DetailsTab";
import PackagesTab from "./PackagesTab";

interface EventEditorProps {
  isOpen: boolean;
  onClose: () => void;
  event?: any;
  onEventUpdated?: () => void;
}

const EventEditor = ({ isOpen, onClose, event, onEventUpdated }: EventEditorProps) => {
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    // Reset to details tab when dialog opens
    if (isOpen) {
      setActiveTab("details");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="details" className="flex-1">Event Details</TabsTrigger>
            {event && event.id && <TabsTrigger value="packages" className="flex-1">Sponsorship Packages</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="details" className="space-y-6">
            <DetailsTab 
              event={event} 
              onClose={onClose} 
              onEventUpdated={onEventUpdated} 
            />
          </TabsContent>
          
          <TabsContent value="packages" className="space-y-6">
            <PackagesTab 
              eventId={event?.id} 
              onClose={onClose} 
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EventEditor;
