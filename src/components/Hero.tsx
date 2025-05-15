
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Building, Calendar, Users, ChevronRight, Banknote, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Hero = () => {
  const [heroVideoUrl, setHeroVideoUrl] = useState<string>("https://videos.pexels.com/video-files/10839348/10839348-uhd_2732_1440_30fps.mp4");
  const [isHoveringBrands, setIsHoveringBrands] = useState(false);
  
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
        
        // If there's a valid URL in the database, use it
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
          {/* Video section - Moved higher up */}
          <div className="lg:col-span-2 relative animate-scale-in order-first lg:order-last mb-6 lg:mb-0">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              {/* Video content */}
              <video 
                autoPlay 
                muted 
                loop 
                playsInline
                className="w-full h-full object-cover"
                src={heroVideoUrl}
              >
                Your browser does not support the video tag.
              </video>
              
              {/* Event card content */}
              <div className="absolute inset-0 flex items-end">
                <div className="p-6 text-white bg-gradient-to-t from-black/80 via-black/40 to-transparent w-full">
                  <p className="text-lg font-semibold">Dubai International Conference</p>
                  <p className="text-sm opacity-90">Featured Event</p>
                  <div className="mt-2 flex items-center">
                    <Banknote className="h-4 w-4 mr-1 text-white/70" />
                    <span className="ml-1 font-semibold">AED 5,000</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-md flex items-center space-x-4 w-64">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                0%
              </div>
              <div>
                <p className="text-sm font-medium">Commission Fee</p>
                <p className="text-xs text-muted-foreground">Transparent pricing</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-white p-3 rounded-xl shadow-md flex items-center">
              <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium flex items-center gap-1">
                <Award className="h-3 w-3" />
                Live Bidding
              </div>
            </div>
            
            {/* Brands section - Added under the video */}
            <div className="mt-8 max-w-md">
              <p className="text-sm text-gray-700 mb-2 flex items-center gap-1">
                <Users className="h-4 w-4 text-primary" />
                <span className="font-semibold text-foreground">200+ </span> 
                organizers trust our platform
              </p>
              <div 
                className="overflow-hidden h-12"
                onMouseEnter={() => setIsHoveringBrands(true)} 
                onMouseLeave={() => setIsHoveringBrands(false)}
              >
                <div 
                  className="flex space-x-6 transition-transform duration-5000"
                  style={{ 
                    transform: isHoveringBrands ? 'translateX(-33%)' : 'translateX(0)',
                    transition: isHoveringBrands ? 'transform 15s linear' : 'none'
                  }}
                >
                  {brands.map((brand, index) => (
                    <div key={index} className="flex-shrink-0">
                      <img 
                        src={brand.logo} 
                        alt={brand.name} 
                        className="h-8 max-w-24 object-contain opacity-80 hover:opacity-100 transition-opacity" 
                      />
                    </div>
                  ))}
                  {/* Duplicate first few brands for continuous scrolling effect */}
                  {brands.slice(0, 4).map((brand, index) => (
                    <div key={`duplicate-${index}`} className="flex-shrink-0">
                      <img 
                        src={brand.logo} 
                        alt={brand.name} 
                        className="h-8 max-w-24 object-contain opacity-80 hover:opacity-100 transition-opacity" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3 animate-fade-in order-last lg:order-first">
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-8 text-balance leading-[1.1] text-foreground">
              Connecting UAE Events with <span className="text-gradient font-bold">Brand Sponsors</span>
            </h1>
            <p className="text-xl text-gray-700 mb-12 leading-relaxed max-w-2xl font-medium">
              sponsorby is the premier marketplace providing brands high visibility across the largest UAE events.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <Button size="lg" className="text-lg px-8 py-7 rounded-xl shadow-lg hover:shadow-xl transition-all" asChild>
                <Link to="/events" className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Find Events <ArrowRight className="ml-1 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-7 rounded-xl border-2 shadow-sm hover:shadow-md transition-all" asChild>
                <Link to="/post-event" className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Post Your Event
                </Link>
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-8">
              <Button variant="ghost" className="hover:bg-muted/20 flex items-center gap-2" asChild>
                <Link to="/for-brands">
                  <Building className="h-4 w-4" />
                  For Brands
                </Link>
              </Button>
              <Button variant="ghost" className="hover:bg-muted/20 flex items-center gap-2" asChild>
                <Link to="/for-organizers">
                  <Users className="h-4 w-4" />
                  For Organizers
                </Link>
              </Button>
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
