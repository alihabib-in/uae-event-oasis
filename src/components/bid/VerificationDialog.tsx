
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PhoneVerification from "@/components/PhoneVerification";

interface VerificationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  phone: string;
  bidId: string | null;
  onVerified: () => void;
}

const VerificationDialog = ({
  isOpen,
  onOpenChange,
  phone,
  bidId,
  onVerified,
}: VerificationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-card/95 backdrop-blur-sm border border-white/10">
        <DialogHeader>
          <DialogTitle>Verify Your Phone Number</DialogTitle>
          <DialogDescription>
            We need to verify your phone number before submitting your bid.
          </DialogDescription>
        </DialogHeader>
        {bidId && (
          <PhoneVerification
            phone={phone}
            recordId={bidId}
            tableType="bids"
            onVerified={onVerified}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VerificationDialog;
