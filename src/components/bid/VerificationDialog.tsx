
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
import { toast } from "sonner";

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
    toast.success("Your submission was successful");
    onVerified();
    onOpenChange(false);
  };
  
  const contactViaWhatsApp = () => {
    window.open(`https://wa.me/971589664353?text=Hello, I just submitted an event/bid on sponsorby.io and wanted to follow up.`, "_blank");
    onVerified();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-card/95 backdrop-blur-sm border border-white/10">
        <DialogHeader>
          <DialogTitle>Submission Successful</DialogTitle>
          <DialogDescription>
            Your submission has been received successfully. What would you like to do next?
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 py-4">
          <Button
            onClick={contactViaWhatsApp}
            className="flex items-center justify-center gap-2"
            variant="default"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.99 10.723C3.99 12.698 4.59 14.608 5.74 16.214L4 20L7.906 18.315C9.454 19.31 11.251 19.835 13.087 19.835H13.091C17.776 19.835 21.529 16.11 21.529 11.401C21.529 9.124 20.624 7.006 19.003 5.38C17.383 3.754 15.275 2.846 13.09 2.845C8.405 2.845 4.652 6.574 4.653 11.287" fill="currentColor"/>
              <path d="M3.25 11.286C3.25 6.26 7.726 2.101 13.09 2.101C15.545 2.102 17.844 3.1 19.597 4.86C21.349 6.619 22.343 8.928 22.342 11.399C22.342 16.429 17.868 20.599 13.091 20.599H13.087C11.143 20.598 9.247 20.05 7.622 19.028L3 20.999L4.918 16.559C3.782 14.849 3.251 13.001 3.251 11.095M8.897 16.608L9.247 16.825C10.663 17.7 12.316 18.185 14.004 18.186H14.008C16.913 18.186 19.586 16.344 20.815 13.729C22.045 11.114 21.629 8.077 19.734 5.888C17.839 3.698 14.959 2.744 12.143 3.392C9.327 4.041 7.175 6.181 6.492 8.962C5.809 11.743 6.693 14.672 8.821 16.608H8.895M17.035 13.641C16.967 13.733 16.858 13.787 16.743 13.79C16.627 13.792 16.522 13.732 16.47 13.588C16.172 13.079 15.082 12.307 15.082 12.307C14.979 12.24 14.91 12.136 14.892 12.018C14.873 11.9 14.906 11.778 14.982 11.682C15.059 11.586 15.172 11.529 15.292 11.526C15.412 11.524 15.527 11.577 15.607 11.67C15.607 11.67 16.475 12.644 16.67 12.812C16.964 13.062 17.126 13.519 17.035 13.64V13.641ZM18.573 12.392C18.49 12.253 18.304 12.197 18.154 12.257C18.004 12.317 17.928 12.479 17.962 12.635C18.22 13.633 17.751 14.699 16.829 15.268C16.695 15.352 16.634 15.51 16.675 15.657C16.716 15.804 16.85 15.904 17.005 15.9C17.17 15.883 17.323 15.809 17.436 15.692C18.666 14.94 19.246 13.432 18.922 11.966C18.878 11.768 18.745 11.608 18.573 11.534V12.392Z" fill="white"/>
            </svg>
            Contact us on WhatsApp
          </Button>
          
          <Button 
            onClick={handleSkipVerification}
            variant="outline"
          >
            Return to Home Page
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationDialog;
