
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";

export interface EventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  minBid: number;
  maxBid: number;
  image: string;
}

const EventCard = ({
  id,
  title,
  date,
  location,
  category,
  minBid,
  maxBid,
  image,
}: EventCardProps) => {
  return (
    <Link to={`/events/${id}`}>
      <Card className="overflow-hidden card-hover h-full flex flex-col">
        <div className="aspect-[16/9] relative">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full"
          />
          <Badge className="absolute top-3 right-3 bg-primary">{category}</Badge>
        </div>
        <CardContent className="pt-6 flex-grow">
          <div className="flex items-center mb-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>{date}</span>
          </div>
          <h3 className="font-semibold text-lg mb-2 leading-tight">{title}</h3>
          <p className="text-muted-foreground text-sm mb-2">{location}</p>
        </CardContent>
        <CardFooter className="border-t pt-4 bg-muted/50">
          <div className="w-full">
            <p className="text-sm text-muted-foreground mb-1">Sponsorship Range:</p>
            <p className="font-semibold text-gold-dark">
              AED {minBid.toLocaleString()} - {maxBid.toLocaleString()}
            </p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default EventCard;
