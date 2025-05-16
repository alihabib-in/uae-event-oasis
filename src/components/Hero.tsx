
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Banknote, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Hero = () => {
  const [heroVideoUrl, setHeroVideoUrl] = useState<string>("https://videos.pexels.com/video-files/10839348/10839348-uhd_2732_1440_30fps.mp4");
  
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
          <div className="lg:col-span-3 animate-fade-in">
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
          </div>
          
          <div className="lg:col-span-2 relative animate-scale-in">
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
            
            <div className="absolute -top-4 -right-4 bg-white p-3 rounded-xl shadow-md flex items-center">
              <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium flex items-center gap-1">
                <Award className="h-3 w-3" />
                Live Bidding
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
