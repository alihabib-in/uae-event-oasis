
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { X, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ActionType = "approve" | "reject" | null;

const BidsTab = () => {
  const [bids, setBids] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bidActionDialogOpen, setBidActionDialogOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState<any>(null);
  const [actionType, setActionType] = useState<ActionType>(null);
  const [adminResponse, setAdminResponse] = useState("");

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("bids")
        .select("*, events(title)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBids(data || []);
    } catch (error: any) {
      console.error("Error fetching bids:", error);
      toast.error(`Failed to load bids: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBidAction = (bid: any, action: ActionType) => {
    setSelectedBid(bid);
    setActionType(action);
    setAdminResponse("");
    setBidActionDialogOpen(true);
  };

  const confirmBidAction = async () => {
    if (!selectedBid || !actionType) return;

    try {
      // Update the bid status in the database
      const { error } = await supabase
        .from("bids")
        .update({
          status: actionType === "approve" ? "approved" : "rejected",
          admin_response: adminResponse
        })
        .eq("id", selectedBid.id);

      if (error) throw error;

      // Send email notification
      await supabase.functions.invoke("send-notification", {
        body: {
          type: "bid_status_update",
          data: {
            brandName: selectedBid.brand_name,
            eventName: selectedBid.events?.title || "the event",
            email: selectedBid.email,
            bidAmount: selectedBid.bid_amount,
            contactName: selectedBid.contact_name,
            status: actionType,
            adminResponse: adminResponse
          }
        }
      });

      toast.success(`Bid ${actionType === "approve" ? "approved" : "rejected"} successfully`);
      setBidActionDialogOpen(false);
      fetchBids();
    } catch (error: any) {
      console.error(`Error ${actionType}ing bid:`, error);
      toast.error(`Failed to ${actionType} bid: ${error.message}`);
    }
  };

  // Create a custom variant for success badges
  const getBadgeVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    if (status === "approved") return "default";
    if (status === "rejected") return "destructive";
    return "secondary"; // For pending or any other status
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Bids Management</CardTitle>
          <CardDescription>
            Review and manage sponsorship bids
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Brand</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      Loading bids...
                    </TableCell>
                  </TableRow>
                ) : bids.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No bids found
                    </TableCell>
                  </TableRow>
                ) : (
                  bids.map((bid) => (
                    <TableRow key={bid.id}>
                      <TableCell className="font-medium">
                        {bid.brand_name}
                      </TableCell>
                      <TableCell>{bid.events?.title || "N/A"}</TableCell>
                      <TableCell>AED {bid.bid_amount.toLocaleString()}</TableCell>
                      <TableCell>
                        {format(new Date(bid.created_at), "PPP")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getBadgeVariant(bid.status || "pending")}
                        >
                          {bid.status || "pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {bid.status === "pending" && (
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => handleBidAction(bid, "reject")}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-primary"
                              onClick={() => handleBidAction(bid, "approve")}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Bid Action Dialog */}
      <Dialog open={bidActionDialogOpen} onOpenChange={setBidActionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approve Bid" : "Reject Bid"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve" ? "Approve" : "Reject"} bid from {selectedBid?.brand_name} for {selectedBid?.events?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <Textarea
              placeholder="Enter a response message to be included in the notification email..."
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
              rows={4}
            />
          </div>

          <DialogFooter className="flex sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setBidActionDialogOpen(false)}
            >
              Cancel
            </Button>
            
            <Button
              type="button"
              variant={actionType === "approve" ? "default" : "destructive"}
              onClick={confirmBidAction}
            >
              {actionType === "approve" ? "Approve Bid" : "Reject Bid"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BidsTab;
