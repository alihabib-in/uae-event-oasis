
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Hero = () => {
  const [heroVideoUrl, setHeroVideoUrl] = useState<string>("https://ai.invideo.io/workspace/b00f9134-fc98-4d60-a00a-ad1575e0b963/v30-copilot");
  
  useEffect(() => {
    // Fetch hero video URL from admin settings
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_settings')
          .select('hero_video_url')
          .single();
          
        if (error) {
          console.error("Error fetching hero video URL:", error);
          return;
        }
        
        if (data && data.hero_video_url) {
          setHeroVideoUrl(data.hero_video_url);
        }
      } catch (error) {
        console.error("Error fetching hero video URL:", error);
      }
    };
    
    fetchSettings();
  }, []);

  return (
    <div className="hero-gradient min-h-[92vh] flex items-center relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-8 text-balance leading-[1.1] text-white">
              Connecting UAE Events with <span className="text-gradient font-medium">Brand Sponsors</span>
            </h1>
            <p className="text-xl text-white/80 mb-12 leading-relaxed max-w-2xl font-light">
              sponsorby is the premier marketplace providing brands high visibility across the largest UAE events.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <Button size="lg" className="text-lg px-8 py-7 rounded-xl" asChild>
                <Link to="/events">Find Events <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-7 rounded-xl border-2 border-white/20" asChild>
                <Link to="/post-event">Post Your Event</Link>
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-8">
              <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10" asChild>
                <Link to="/for-brands">For Brands</Link>
              </Button>
              <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10" asChild>
                <Link to="/for-organizers">For Organizers</Link>
              </Button>
            </div>
            
            <div className="mt-12">
              <div className="overflow-x-auto pb-4 no-scrollbar">
                <div className="flex space-x-4 animate-scroll-x">
                  {brands.map((brand, index) => (
                    <div 
                      key={index} 
                      className="h-16 w-16 flex-shrink-0 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all duration-300 p-2"
                    >
                      <img 
                        src={brand.logo} 
                        alt={brand.name} 
                        className="max-h-10 max-w-10 object-contain" 
                      />
                    </div>
                  ))}
                  {/* Duplicate brands for continuous scrolling effect */}
                  {brands.map((brand, index) => (
                    <div 
                      key={`duplicate-${index}`} 
                      className="h-16 w-16 flex-shrink-0 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all duration-300 p-2"
                    >
                      <img 
                        src={brand.logo} 
                        alt={brand.name} 
                        className="max-h-10 max-w-10 object-contain" 
                      />
                    </div>
                  ))}
                </div>
              </div>
              <span className="block text-sm text-white/70 mt-2">
                <span className="font-semibold text-white">200+ </span> 
                organizers trust our platform
              </span>
            </div>
          </div>
          
          <div className="lg:col-span-2 relative animate-scale-in" data-component-line="77">
            <div className="aspect-[4/3] bg-card/40 rounded-2xl glass-card overflow-hidden">
              {/* Video content */}
              <video 
                autoPlay 
                muted 
                loop 
                playsInline
                className="w-full h-full object-cover"
              >
                <source src={heroVideoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Event card content */}
              <div className="absolute inset-0 flex items-end">
                <div className="p-6 text-white bg-gradient-to-t from-black/80 via-black/40 to-transparent w-full">
                  <p className="text-lg font-semibold">Dubai International Conference</p>
                  <p className="text-sm opacity-90">Featured Event</p>
                  <div className="mt-2 flex items-center">
                    <span className="text-xs text-white/70">Starting at </span>
                    <span className="ml-1 font-semibold">AED 5,000</span>
                  </div>
                </div>
              </div>
              {/* Animated overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 mix-blend-overlay animate-pulse"></div>
            </div>
            <div className="absolute -bottom-6 -left-6 glass-card p-4 rounded-xl flex items-center space-x-4 w-64">
              <div className="flex-shrink-0 h-12 w-12 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-lg">
                5%
              </div>
              <div>
                <p className="text-sm font-medium text-white">Commission Fee</p>
                <p className="text-xs text-gray-400">Transparent pricing</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 glass-card p-3 rounded-xl flex items-center">
              <div className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium">
                Live Bidding
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sample brand logos
const brands = [
  {
    name: "Al Futtaim",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Majid_Al_Futtaim_logo.svg/2560px-Majid_Al_Futtaim_logo.svg.png"
  },
  {
    name: "Emirates",
    logo: "https://klairport.info/ap-content/uploads/emirates-airlines.png"
  },
  {
    name: "ADGM",
    logo: "https://cebcmena.com/wp-content/uploads/2023/12/R10ba810ff55d09ce7bf9609bc51c744b_0538e58e12.png"
  },
  {
    name: "Emaar",
    logo: "https://i0.wp.com/achiever.ae/wp-content/uploads/2024/04/Emaar-Properties-Logo-e1713776008292.png?ssl=1"
  },
  {
    name: "Etihad",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Etihad_Airways_logo_2018.svg/2560px-Etihad_Airways_logo_2018.svg.png"
  },
  {
    name: "Dubai Holding",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Dubai_Holding_logo.svg/2560px-Dubai_Holding_logo.svg.png"
  }
];

export default Hero;
