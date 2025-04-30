
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

const categories = [
  {
    id: "tech",
    name: "Technology",
    icon: "🖥️",
    description: "Tech expos, hackathons, product launches, and industry conferences",
    features: ["Large attendee base", "Tech professionals", "Investors", "Global reach"],
  },
  {
    id: "sport",
    name: "Sports",
    icon: "🏆",
    description: "Tournaments, championships, community events, and wellness activities",
    features: ["High energy crowds", "Athletic focus", "Community engagement", "Media coverage"],
  },
  {
    id: "art",
    name: "Arts & Culture",
    icon: "🎨",
    description: "Art exhibitions, cultural festivals, music events, and theater productions",
    features: ["Creative audience", "Cultural immersion", "Heritage connection", "Visual showcases"],
  },
  {
    id: "business",
    name: "Business",
    icon: "💼",
    description: "Corporate conferences, networking events, awards, and trade shows",
    features: ["Decision makers", "B2B opportunities", "Industry leaders", "Partnership potential"],
  },
];

const CategorySection = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Event Categories</h2>
          <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
            Explore diverse sponsorship opportunities across various event types in the UAE.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={category.id === activeCategory.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              className="px-6"
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>

        <Card className="border-2 border-primary/10 animate-fade-in">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl mr-4">
                    {activeCategory.icon}
                  </div>
                  <h3 className="text-2xl font-bold">{activeCategory.name} Events</h3>
                </div>
                <p className="text-gray-600 mb-6">{activeCategory.description}</p>
                <ul className="space-y-3">
                  {activeCategory.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-8">View {activeCategory.name} Events</Button>
              </div>
              <div className="relative rounded-lg overflow-hidden h-64 lg:h-auto">
                <img
                  src={`https://source.unsplash.com/random/800x600?${activeCategory.name.toLowerCase()},event,uae`}
                  alt={`${activeCategory.name} events`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CategorySection;
