
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { EventSpace } from "@/types/spaces";

interface SpacesListProps {
  spaces: EventSpace[];
  onEdit: (space: EventSpace) => void;
  onDelete: (spaceId: string) => void;
}

const SpacesList: React.FC<SpacesListProps> = ({ spaces, onEdit, onDelete }) => {
  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {spaces.map((space) => (
            <TableRow key={space.id}>
              <TableCell className="font-medium">{space.name}</TableCell>
              <TableCell>{space.location}</TableCell>
              <TableCell>{space.capacity}</TableCell>
              <TableCell className="text-gray-600">Quote Only</TableCell>
              <TableCell>
                {space.available ? (
                  <Badge className="bg-green-100 text-green-800">
                    <Check className="h-3 w-3 mr-1" /> Available
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 text-red-800">
                    <X className="h-3 w-3 mr-1" /> Unavailable
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(space)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(space.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SpacesList;
