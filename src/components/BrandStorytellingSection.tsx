
import React from "react";
import { motion } from "framer-motion";
import { Store, ShoppingCart, Users, Handshake, TrendingUp, Database, Instagram, Megaphone } from "lucide-react";

const BrandStorytellingSection = () => {
  return (
    <section className="py-16 bg-muted/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Physical Space Engagement */}
        <div className="mb-24 relative">
          <div className="absolute -left-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Physical Brand Presence</h2>
              <p className="text-lg mb-6">
                Secure a prime physical location at prestigious UAE events where your brand can directly engage with attendees. Unlike fleeting digital ads, create meaningful face-to-face connections with potential customers.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                  <span>Custom branded booth or exhibition space</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                  </div>
                  <span>Direct product sales opportunities</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <span>Access to pre-qualified, targeted audiences</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="vector-art-container aspect-square relative">
                {/* Vector Art Animation */}
                <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-2xl h-full flex items-center justify-center">
                  <div className="relative w-full max-w-sm mx-auto">
                    {/* Event Space Base */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-b from-primary/5 to-secondary/5 rounded-xl border border-white/20"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ scale: 1.02 }}
                    />
                    
                    {/* Event Building */}
                    <motion.div 
                      className="absolute left-[10%] right-[10%] top-[10%] bottom-[40%] bg-card/40 backdrop-blur-sm rounded-lg border border-white/10"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <div className="absolute top-[80%] left-0 right-0 h-4 bg-primary/20"></div>
                    </motion.div>
                    
                    {/* Brand Booth */}
                    <motion.div 
                      className="absolute left-[30%] right-[30%] top-[50%] bottom-[30%] bg-accent/30 backdrop-blur-sm rounded-md border border-accent/30"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,100,100,0.4)" }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Store className="h-8 w-8 text-white" />
                      </div>
                    </motion.div>
                    
                    {/* People */}
                    <motion.div 
                      className="absolute left-[15%] top-[65%] h-4 w-4 rounded-full bg-blue-500"
                      animate={{ x: [0, 15, 0], y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 3, repeatType: "reverse" }}
                    />
                    <motion.div 
                      className="absolute left-[60%] top-[70%] h-4 w-4 rounded-full bg-green-500"
                      animate={{ x: [0, -20, 0], y: [0, -8, 0] }}
                      transition={{ repeat: Infinity, duration: 4, repeatType: "reverse" }}
                    />
                    <motion.div 
                      className="absolute left-[40%] top-[75%] h-4 w-4 rounded-full bg-purple-500"
                      animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 3.5, repeatType: "reverse" }}
                    />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-secondary/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>

        {/* Direct Customer Interaction */}
        <div className="mb-24 relative">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-secondary/10 rounded-full blur-xl"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="vector-art-container aspect-square relative">
                {/* Vector Art Animation */}
                <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-2xl h-full flex items-center justify-center">
                  <div className="relative w-full max-w-sm mx-auto">
                    {/* Social Media */}
                    <motion.div 
                      className="absolute left-[10%] top-[10%] h-16 w-16 rounded-xl bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Instagram className="h-10 w-10 text-white" />
                    </motion.div>
                    
                    {/* Hand Shaking */}
                    <motion.div 
                      className="absolute left-[calc(50%-50px)] top-[calc(50%-50px)] h-24 w-24 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 border border-white/30 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      whileHover={{ rotate: 5, scale: 1.05 }}
                    >
                      <Handshake className="h-12 w-12 text-white" />
                    </motion.div>
                    
                    {/* Data Flow */}
                    <motion.div 
                      className="absolute right-[10%] top-[20%] h-12 w-12 rounded-lg bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <Database className="h-6 w-6 text-white" />
                    </motion.div>

                    {/* Connection Lines */}
                    <svg className="absolute inset-0 w-full h-full">
                      <motion.path 
                        d="M 80 80 Q 150 140, 200 170" 
                        stroke="url(#socialToHandshake)" 
                        strokeWidth="2" 
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                      />
                      <motion.path 
                        d="M 320 80 Q 250 140, 200 170" 
                        stroke="url(#dataToHandshake)" 
                        strokeWidth="2" 
                        fill="none" 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                      />
                      <defs>
                        <linearGradient id="socialToHandshake" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#60a5fa" />
                          <stop offset="100%" stopColor="#7c3aed" />
                        </linearGradient>
                        <linearGradient id="dataToHandshake" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f97316" />
                          <stop offset="100%" stopColor="#0ea5e9" />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    {/* Pulse Effect */}
                    <motion.div 
                      className="absolute left-[calc(50%-60px)] top-[calc(50%-60px)] h-28 w-28 rounded-full bg-primary/10"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.5, 0.2]
                      }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-accent/10 rounded-full blur-xl"></div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold mb-6">Direct Customer Interaction</h2>
              <p className="text-lg mb-6">
                Move beyond the limitations of social media algorithms. At sponsored events, engage with customers directly, demonstrate products, answer questions, and build genuine relationships that drive brand loyalty.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Handshake className="h-5 w-5 text-secondary" />
                  </div>
                  <span>Personal connections with potential customers</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Megaphone className="h-5 w-5 text-secondary" />
                  </div>
                  <span>Direct feedback and market research</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Instagram className="h-5 w-5 text-secondary" />
                  </div>
                  <span>More impactful than social media advertising</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Premium Benefits */}
        <div className="mb-12 relative">
          <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-accent/10 rounded-full blur-xl"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Premium Sponsorship Packages</h2>
              <p className="text-lg mb-6">
                Elevate your brand visibility with our premium sponsorship packages. Higher-tier packages unlock additional benefits including prime placement, targeted customer data, and cross-event promotion opportunities.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-accent" />
                  </div>
                  <span>Enhanced brand visibility throughout the event</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <Database className="h-5 w-5 text-accent" />
                  </div>
                  <span>Valuable demographic data collection</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <Megaphone className="h-5 w-5 text-accent" />
                  </div>
                  <span>Cross-promotion through event marketing channels</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="vector-art-container aspect-square relative">
                {/* Vector Art Animation - Tiered Packages */}
                <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-2xl h-full flex items-center justify-center">
                  <div className="relative w-full max-w-sm mx-auto">
                    {/* Background Circle */}
                    <motion.div 
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/5 to-accent/5"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.7 }}
                    />
                    
                    {/* Bronze Package */}
                    <motion.div 
                      className="absolute left-[10%] right-[60%] top-[60%] bottom-[10%] bg-amber-700/20 backdrop-blur-sm rounded-lg border border-amber-700/20 flex items-end justify-center p-4"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <span className="text-amber-700 font-medium">Bronze</span>
                    </motion.div>
                    
                    {/* Silver Package */}
                    <motion.div 
                      className="absolute left-[30%] right-[40%] top-[40%] bottom-[10%] bg-gray-400/20 backdrop-blur-sm rounded-lg border border-gray-400/20 flex items-end justify-center p-4"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <span className="text-gray-600 font-medium">Silver</span>
                    </motion.div>
                    
                    {/* Gold Package */}
                    <motion.div 
                      className="absolute left-[50%] right-[20%] top-[20%] bottom-[10%] bg-yellow-500/20 backdrop-blur-sm rounded-lg border border-yellow-500/20 flex items-end justify-center p-4"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <span className="text-yellow-600 font-medium">Gold</span>
                    </motion.div>
                    
                    {/* Platinum Crown */}
                    <motion.div 
                      className="absolute left-[70%] right-[5%] top-[5%] bottom-[60%] bg-gradient-to-br from-primary/30 to-secondary/30 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.9, duration: 0.5 }}
                      whileHover={{ 
                        scale: 1.1,
                        boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)",
                        transition: { duration: 0.3 } 
                      }}
                    >
                      <span className="text-white font-bold text-sm">PLATINUM</span>
                    </motion.div>
                    
                    {/* Connecting Lines */}
                    <svg className="absolute inset-0 w-full h-full">
                      <motion.path 
                        d="M 80 250 Q 120 200, 150 200" 
                        stroke="url(#packageGradient)" 
                        strokeWidth="2" 
                        strokeDasharray="4 4"
                        fill="none" 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                      />
                      <motion.path 
                        d="M 150 200 Q 200 180, 250 150" 
                        stroke="url(#packageGradient)" 
                        strokeWidth="2" 
                        strokeDasharray="4 4"
                        fill="none" 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                      />
                      <motion.path 
                        d="M 250 150 Q 280 100, 300 80" 
                        stroke="url(#packageGradient)" 
                        strokeWidth="2" 
                        strokeDasharray="4 4"
                        fill="none" 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 1.4, duration: 0.5 }}
                      />
                      <defs>
                        <linearGradient id="packageGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#ca8a04" />
                          <stop offset="50%" stopColor="#94a3b8" />
                          <stop offset="100%" stopColor="#0ea5e9" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStorytellingSection;
