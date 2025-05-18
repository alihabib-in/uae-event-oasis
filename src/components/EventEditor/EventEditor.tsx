
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
import DetailsTab from "./DetailsTab";
import PackagesTab from "./PackagesTab";
import TargetAudienceTab from "./TargetAudienceTab";
import HistoryTab from "./HistoryTab";
import MarketingTab from "./MarketingTab";

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
  }, [isOpen, event]);

  // Function to handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Close handler with confirmation if changes were made
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {event ? `Edit Event: ${event.title}` : 'New Event'}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full mb-6 flex flex-wrap h-auto py-2">
            <TabsTrigger value="details" className="flex-1">Event Details</TabsTrigger>
            {event && event.id && (
              <>
                <TabsTrigger value="packages" className="flex-1">Sponsorship</TabsTrigger>
                <TabsTrigger value="target_audience" className="flex-1">Target Audience</TabsTrigger>
                <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
                <TabsTrigger value="marketing" className="flex-1">Marketing</TabsTrigger>
              </>
            )}
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

          <TabsContent value="target_audience" className="space-y-6">
            <TargetAudienceTab 
              event={event}
              onClose={onClose} 
            />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <HistoryTab
              event={event}
              onClose={onClose}
            />
          </TabsContent>

          <TabsContent value="marketing" className="space-y-6">
            <MarketingTab
              event={event}
              onClose={onClose}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EventEditor;
