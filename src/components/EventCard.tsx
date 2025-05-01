
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPinIcon } from "lucide-react";

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
      <Card className="overflow-hidden material-card h-full flex flex-col border-0">
        <div className="aspect-[16/9] relative">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full"
          />
          <Badge className="absolute top-4 right-4 bg-primary rounded-full py-1.5 px-3">
            {category}
          </Badge>
        </div>
        <CardContent className="pt-6 pb-4 flex-grow">
          <div className="flex items-center mb-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>{date}</span>
          </div>
          <h3 className="text-xl font-bold mb-3 leading-tight text-balance">{title}</h3>
          <div className="flex items-center text-muted-foreground text-sm mb-2">
            <MapPinIcon className="h-4 w-4 mr-1" />
            <p>{location}</p>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 pb-5 bg-muted/30">
          <div className="w-full">
            <p className="text-sm text-muted-foreground mb-1">Sponsorship Range:</p>
            <p className="font-bold text-lg text-primary">
              AED {minBid.toLocaleString()} - {maxBid.toLocaleString()}
            </p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default EventCard;
