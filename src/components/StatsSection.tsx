
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AnimatePresence, motion } from "framer-motion";

const StatsSection = () => {
  const [activeBrandIndex, setActiveBrandIndex] = useState(0);
  
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
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBrandIndex(prevIndex => (prevIndex + 1) % brands.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [brands.length]);

  return (
    <section className="py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Trusted by Leading Brands</h2>
          <p className="text-muted-foreground mt-2">
            Top brands find success on sponsorby
          </p>
        </div>

        <div className="flex justify-center items-center h-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBrandIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <Avatar className="w-20 h-20 border-2 border-primary/20 hover:border-primary/50 transition-all duration-300">
                <AvatarImage src={brands[activeBrandIndex].image} alt={brands[activeBrandIndex].name} />
                <AvatarFallback className="bg-muted text-primary text-lg font-medium">
                  {brands[activeBrandIndex].name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <p className="mt-2 text-sm text-muted-foreground font-medium">
                {brands[activeBrandIndex].name}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="flex justify-center gap-2 mt-4">
          {brands.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === activeBrandIndex ? "bg-primary" : "bg-muted"
              }`}
              onClick={() => setActiveBrandIndex(index)}
              aria-label={`Show brand ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
