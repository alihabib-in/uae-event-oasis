
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <div className="hero-gradient min-h-[92vh] flex items-center relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover"
        >
          <source 
            src="https://ai.invideo.io/workspace/b00f9134-fc98-4d60-a00a-ad1575e0b963/v30-copilot" 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>
      </div>

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
            <div className="mt-12 flex items-center">
              <div className="flex flex-wrap gap-4">
                {brands.map((brand, index) => (
                  <div 
                    key={index} 
                    className="h-10 w-auto flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg px-2 hover:bg-white/20 transition-all duration-300"
                  >
                    <img 
                      src={brand.logo} 
                      alt={brand.name} 
                      className="h-6 object-contain" 
                    />
                  </div>
                ))}
              </div>
              <span className="ml-4 text-sm text-white/70">
                <span className="font-semibold text-white">200+ </span> 
                organizers trust our platform
              </span>
            </div>
          </div>
          <div className="lg:col-span-2 relative animate-scale-in">
            <div className="aspect-[4/3] bg-card/40 rounded-2xl glass-card overflow-hidden">
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
    logo: "https://logolook.net/wp-content/uploads/2021/01/Emirates-Logo.png"
  },
  {
    name: "NBD",
    logo: "https://www.reemmall.ae/wp-content/uploads/2023/10/EMIRATESNBD.AE_BIG-5d0a63c2.png"
  },
  {
    name: "Emaar",
    logo: "https://i0.wp.com/achiever.ae/wp-content/uploads/2024/04/Emaar-Properties-Logo-e1713776008292.png?ssl=1"
  }
];

export default Hero;
