
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  // Simply auto-verify without OTP checks
  const handleSkipVerification = () => {
    onVerified();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-card/95 backdrop-blur-sm border border-white/10">
        <DialogHeader>
          <DialogTitle>Phone Verification Disabled</DialogTitle>
          <DialogDescription>
            The admin has disabled phone verification. You can continue without verification.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter>
          <Button 
            onClick={handleSkipVerification}
            className="w-full"
          >
            Continue Without Verification
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationDialog;
