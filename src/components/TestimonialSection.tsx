
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Testimonial {
  id: number;
  content: string;
  author: string;
  role: string;
  company: string;
  image?: string;
  type: "brand" | "organizer";
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    content:
      "UAESponsor helped us connect with premium brands that aligned perfectly with our tech conference. The bidding process was transparent and we secured 30% more sponsorship revenue than our target.",
    author: "Ahmed Al Mansoori",
    role: "Event Director",
    company: "Dubai Tech Summit",
    image: "https://i.pravatar.cc/150?img=1",
    type: "organizer",
  },
  {
    id: 2,
    content:
      "As a luxury brand entering the UAE market, we needed high-visibility events that matched our audience. UAESponsor's platform helped us find and secure three perfect events within our first month.",
    author: "Sarah Johnson",
    role: "Marketing Director",
    company: "Elegance Luxury",
    image: "https://i.pravatar.cc/150?img=5",
    type: "brand",
  },
  {
    id: 3,
    content:
      "The streamlined bidding process helped us find the right sponsor quickly. We appreciated the platform's professional approach and excellent communication tools.",
    author: "Mohammed Al Hashimi",
    role: "Founder",
    company: "Abu Dhabi Cultural Festival",
    image: "https://i.pravatar.cc/150?img=3",
    type: "organizer",
  },
  {
    id: 4,
    content:
      "UAESponsor has transformed how we approach event sponsorships. We can now efficiently find and bid on relevant events across the UAE, saving us time and expanding our reach.",
    author: "Lina Khalid",
    role: "Brand Manager",
    company: "Gulf Telecom",
    image: "https://i.pravatar.cc/150?img=10",
    type: "brand",
  },
];

const TestimonialSection = () => {
  const [filter, setFilter] = useState<"all" | "brand" | "organizer">("all");

  const filteredTestimonials = testimonials.filter((t) => {
    if (filter === "all") return true;
    return t.type === filter;
  });

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Success Stories</h2>
          <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
            See how UAESponsor has helped brands and event organizers create successful partnerships.
          </p>

          <div className="mt-8 inline-flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === "all"
                  ? "bg-white shadow-sm text-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All Stories
            </button>
            <button
              onClick={() => setFilter("brand")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === "brand"
                  ? "bg-white shadow-sm text-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Brand Stories
            </button>
            <button
              onClick={() => setFilter("organizer")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === "organizer"
                  ? "bg-white shadow-sm text-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Organizer Stories
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center mb-6">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.image} />
                    <AvatarFallback>
                      {testimonial.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
                <blockquote className="text-gray-700 italic">
                  "{testimonial.content}"
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
