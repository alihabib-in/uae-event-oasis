
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
  onVerified,
}: VerificationDialogProps) => {
  // Auto-verify without OTP checks
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
            The admin has disabled phone verification. Click continue to submit.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter>
          <Button 
            onClick={handleSkipVerification}
            className="w-full"
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationDialog;
