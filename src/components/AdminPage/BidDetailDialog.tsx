
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

export interface BidDetailDialogProps {
  bid: any; // Add this prop
  isOpen: boolean;
  onClose: () => void;
  onBidUpdated: () => void;
}

const BidDetailDialog = ({ bid, isOpen, onClose, onBidUpdated }: BidDetailDialogProps) => {
  const [status, setStatus] = useState(bid?.status || "pending");
  const [adminResponse, setAdminResponse] = useState(bid?.admin_response || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateBid = async () => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('bids')
        .update({
          status,
          admin_response: adminResponse
        })
        .eq('id', bid.id);
      
      if (error) throw error;
      
      toast.success("Bid status updated successfully");
      onBidUpdated();
      onClose();
    } catch (error: any) {
      console.error("Error updating bid status:", error);
      toast.error(`Failed to update bid: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Bid Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div>
            <h3 className="font-semibold mb-2">Event Information</h3>
            <p className="text-sm mb-1"><span className="text-muted-foreground">Event:</span> {bid?.event?.title || "Unknown Event"}</p>
            <p className="text-sm mb-1"><span className="text-muted-foreground">Date:</span> {bid?.event?.date ? format(new Date(bid.event.date), "PPP") : "N/A"}</p>
            <p className="text-sm mb-1"><span className="text-muted-foreground">Venue:</span> {bid?.event?.venue || "N/A"}</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Brand Information</h3>
            <p className="text-sm mb-1"><span className="text-muted-foreground">Brand Name:</span> {bid?.brand_name}</p>
            <p className="text-sm mb-1"><span className="text-muted-foreground">Business Type:</span> {bid?.business_nature}</p>
            <p className="text-sm mb-1"><span className="text-muted-foreground">Location:</span> {bid?.emirate}, {bid?.company_address}</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Contact Information</h3>
            <p className="text-sm mb-1"><span className="text-muted-foreground">Contact Person:</span> {bid?.contact_name}</p>
            <p className="text-sm mb-1"><span className="text-muted-foreground">Email:</span> {bid?.email}</p>
            <p className="text-sm mb-1"><span className="text-muted-foreground">Phone:</span> {bid?.phone}</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Bid Information</h3>
            <p className="text-sm mb-1">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-semibold ml-1">AED {bid?.bid_amount?.toLocaleString()}</span>
            </p>
            <p className="text-sm mb-1">
              <span className="text-muted-foreground">Submitted:</span>
              {bid?.created_at ? format(new Date(bid.created_at), "PPP") : "N/A"}
            </p>
            <div className="mt-1">
              <span className="text-muted-foreground text-sm mr-2">Status:</span>
              <Badge
                variant={
                  bid?.status === "approved" ? "default" :
                  bid?.status === "rejected" ? "destructive" :
                  "secondary"
                }
              >
                {bid?.status === "approved" ? "Approved" :
                 bid?.status === "rejected" ? "Rejected" :
                 "Pending"}
              </Badge>
            </div>
          </div>
          
          {bid?.message && (
            <div className="col-span-2">
              <h3 className="font-semibold mb-2">Message</h3>
              <p className="text-sm bg-gray-50 p-3 rounded-md border">{bid.message}</p>
            </div>
          )}
          
          <div className="col-span-2">
            <h3 className="font-semibold mb-2">Respond to Bid</h3>
            <div className="flex mb-4 space-x-4">
              <Button 
                type="button" 
                variant={status === "approved" ? "default" : "outline"}
                className={status === "approved" ? "" : "border-green-200 text-green-700"}
                onClick={() => setStatus("approved")}
              >
                Approve
              </Button>
              <Button 
                type="button" 
                variant={status === "rejected" ? "destructive" : "outline"}
                className={status === "rejected" ? "" : "border-red-200 text-red-700"}
                onClick={() => setStatus("rejected")}
              >
                Reject
              </Button>
              <Button 
                type="button" 
                variant={status === "pending" ? "secondary" : "outline"}
                onClick={() => setStatus("pending")}
              >
                Mark as Pending
              </Button>
            </div>
            
            <Textarea
              placeholder="Add a response message to the bidder (optional)"
              className="w-full"
              rows={3}
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter className="flex justify-between flex-wrap">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdateBid} disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Bid Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BidDetailDialog;
