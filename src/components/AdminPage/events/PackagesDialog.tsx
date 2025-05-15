
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Package {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface PackagesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  packages: Package[];
  eventTitle: string;
}

const PackagesDialog = ({
  isOpen,
  onClose,
  packages,
  eventTitle,
}: PackagesDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Sponsorship Packages
          </DialogTitle>
          <DialogDescription>
            Packages for {eventTitle}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          {packages?.map((pkg) => (
            <div key={pkg.id} className="border rounded-md p-3">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium">{pkg.name}</h3>
                <Badge variant="outline">AED {pkg.price.toLocaleString()}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{pkg.description}</p>
            </div>
          ))}
          {(!packages || packages.length === 0) && (
            <p className="text-center text-muted-foreground py-4">No packages found</p>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PackagesDialog;
