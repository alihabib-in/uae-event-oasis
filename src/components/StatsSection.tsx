
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const StatsSection = () => {
  const brands = [
    {
      name: "Emaar",
      image: "https://brandlogos.net/wp-content/uploads/2025/04/emaar_properties-logo_brandlogos.net_aegka-300x62.png?w=250&h=250&fit=crop&auto=format&q=80",
    },
    {
      name: "Apple",
      image: "https://images.unsplash.com/photo-1603816245457-fe9bb9970248?w=250&h=250&fit=crop&auto=format&q=80",
    },
    {
      name: "Google",
      image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=250&h=250&fit=crop&auto=format&q=80",
    },
    {
      name: "Amazon",
      image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=250&h=250&fit=crop&auto=format&q=80",
    },
    {
      name: "Microsoft",
      image: "https://images.unsplash.com/photo-1642068052428-838ef02e8bb8?w=250&h=250&fit=crop&auto=format&q=80",
    },
    {
      name: "Adobe",
      image: "https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?w=250&h=250&fit=crop&auto=format&q=80",
    },
    {
      name: "Coca-Cola",
      image: "https://images.unsplash.com/photo-1629203432180-71e9b18d855c?w=250&h=250&fit=crop&auto=format&q=80",
    },
    {
      name: "Adidas",
      image: "https://images.unsplash.com/photo-1588361861040-ac9b1018f6d5?w=250&h=250&fit=crop&auto=format&q=80",
    },
  ];

  return (
    <section className="py-24 section-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="section-title">Trusted by Leading Brands</h2>
          <p className="section-subtitle">
            Over 200+ organizers and brands are finding success on sponsorby
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
          {brands.map((brand, index) => (
            <div key={index} className="flex flex-col items-center">
              <Avatar className="w-16 h-16 md:w-20 md:h-20 border-2 border-primary/20 hover:border-primary/50 transition-all duration-300">
                <AvatarImage src={brand.image} alt={brand.name} />
                <AvatarFallback className="bg-muted text-primary text-lg font-medium">
                  {brand.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <p className="mt-2 text-sm text-muted-foreground font-medium">
                {brand.name}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-xl font-medium text-primary">
            Join our growing community of event organizers and brand sponsors
          </p>
        </div>
      </div>

      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-primary/5 rounded-full"></div>
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-secondary/5 rounded-full"></div>
    </section>
  );
};

export default StatsSection;
