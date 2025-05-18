
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BidDetailDialog from "./BidDetailDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface BidsListProps {
  bids: any[];
  onBidsUpdated: () => void;
  isLoading: boolean;
}

const BidsList = ({ bids, onBidsUpdated, isLoading }: BidsListProps) => {
  const [viewingBid, setViewingBid] = useState<any>(null);
  const [bidToDelete, setBidToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteBid = async () => {
    if (!bidToDelete) return;
    
    try {
      const { error } = await supabase
        .from("bids")
        .delete()
        .eq("id", bidToDelete);
        
      if (error) throw error;
      
      toast.success("Bid deleted successfully");
      setIsDeleteDialogOpen(false);
      onBidsUpdated();
    } catch (error: any) {
      console.error("Error deleting bid:", error);
      toast.error(`Failed to delete bid: ${error.message}`);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                Loading bids...
              </TableCell>
            </TableRow>
          ) : bids.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                No bids found
              </TableCell>
            </TableRow>
          ) : (
            bids.map((bid) => (
              <TableRow key={bid.id}>
                <TableCell className="font-medium">{bid.event?.title || "Unknown Event"}</TableCell>
                <TableCell>{bid.brand_name}</TableCell>
                <TableCell>AED {bid.bid_amount.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{bid.contact_name}</span>
                    <span className="text-sm text-muted-foreground">{bid.email}</span>
                  </div>
                </TableCell>
                <TableCell>{format(new Date(bid.created_at), "MMM d, yyyy")}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      bid.status === "approved" ? "default" :
                      bid.status === "rejected" ? "destructive" :
                      "secondary"
                    }
                  >
                    {bid.status === "approved" ? "Approved" :
                     bid.status === "rejected" ? "Rejected" :
                     "Pending"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewingBid(bid)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setBidToDelete(bid.id);
                      setIsDeleteDialogOpen(true);
                    }}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {viewingBid && (
        <BidDetailDialog
          bid={viewingBid}
          isOpen={!!viewingBid}
          onClose={() => setViewingBid(null)}
          onBidUpdated={onBidsUpdated}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this bid. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBid} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BidsList;
