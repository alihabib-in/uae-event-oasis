
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface BidDetailDialogProps {
  bidId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const BidDetailDialog = ({ bidId, isOpen, onClose }: BidDetailDialogProps) => {
  const [bid, setBid] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [event, setEvent] = useState<any | null>(null);

  useEffect(() => {
    const fetchBidDetails = async () => {
      if (!bidId) return;
      
      setIsLoading(true);
      try {
        // Fetch bid details
        const { data: bidData, error: bidError } = await supabase
          .from("bids")
          .select("*")
          .eq("id", bidId)
          .single();
          
        if (bidError) throw bidError;
        
        setBid(bidData);
        
        // Fetch associated event details
        if (bidData.event_id) {
          const { data: eventData, error: eventError } = await supabase
            .from("events")
            .select("title,date,location")
            .eq("id", bidData.event_id)
            .single();
            
          if (!eventError) {
            setEvent(eventData);
          }
        }
      } catch (error: any) {
        console.error("Error fetching bid details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isOpen && bidId) {
      fetchBidDetails();
    }
  }, [bidId, isOpen]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bid Details</DialogTitle>
          <DialogDescription>
            Complete information about this bid submission
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : bid ? (
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Event Information</h3>
              {event ? (
                <div className="bg-muted p-4 rounded-md">
                  <p><span className="font-medium">Event:</span> {event.title}</p>
                  <p><span className="font-medium">Date:</span> {format(new Date(event.date), "PPP")}</p>
                  <p><span className="font-medium">Location:</span> {event.location}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">Event information not available</p>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Brand Information</h3>
                <Badge variant={bid.status === "approved" ? "default" : bid.status === "rejected" ? "destructive" : "secondary"}>
                  {bid.status || "pending"}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Brand Name</p>
                  <p className="font-medium">{bid.brand_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Business Nature</p>
                  <p className="font-medium">{bid.business_nature}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Emirate</p>
                  <p className="font-medium">{bid.emirate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Company Address</p>
                  <p className="font-medium">{bid.company_address}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Contact Name</p>
                  <p className="font-medium">{bid.contact_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{bid.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{bid.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bid Amount</p>
                  <p className="font-medium text-primary">AED {bid.bid_amount?.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            {bid.message && (
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Message</h3>
                <div className="bg-muted p-4 rounded-md">
                  <p>{bid.message}</p>
                </div>
              </div>
            )}
            
            {bid.admin_response && (
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Admin Response</h3>
                <div className="bg-muted p-4 rounded-md">
                  <p>{bid.admin_response}</p>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Additional Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Submission Date</p>
                  <p className="font-medium">{format(new Date(bid.created_at), "PPP")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone Verification</p>
                  <Badge variant={bid.phone_verified ? "default" : "secondary"}>
                    {bid.phone_verified ? "Verified" : "Not Verified"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Bid details not available</p>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BidDetailDialog;
