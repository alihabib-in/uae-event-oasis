
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BrandStorytellingSection from "../components/BrandStorytellingSection";
import CallToAction from "../components/CallToAction";

const ForBrandsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="py-20 bg-gradient-to-b from-background to-background/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-8 text-center">
              For <span className="text-gradient font-medium">Brands</span>
            </h1>
            <p className="text-xl text-center text-muted-foreground max-w-3xl mx-auto mb-16">
              Unlock valuable face-to-face engagement opportunities with highly targeted audiences at premier UAE events
            </p>
          </div>
        </div>
        
        <BrandStorytellingSection />
        
        {/* Call to Action */}
        <section className="py-24 bg-muted/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl overflow-hidden">
              <CallToAction type="brand" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ForBrandsPage;
