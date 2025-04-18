
import React, { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Hero: React.FC = () => {
  const controls = useAnimation();
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    const sequence = async () => {
      await controls.start({
        pathLength: 1,
        transition: { duration: 2, ease: "easeInOut" }
      });
    };
    
    sequence();
  }, [controls]);
  
  return (
    <section className="relative flex items-center justify-center min-h-[80vh] px-4 py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background opacity-50 z-0"></div>
      
      <div className="container relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4 flex justify-center"
          >
            <span className="inline-block px-5 py-2 text-sm font-medium tracking-wider text-primary bg-primary/10 rounded-full border border-primary/20 shadow-sm">
              AI-POWERED RESUME ANALYZER
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="block mb-2">Transform Your Resume With</span>
            <span className="relative inline-block gradient-text">
              Advanced AI Analysis
              <motion.span 
                className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
              ></motion.span>
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl mb-10 max-w-3xl mx-auto text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Unlock your career potential with our sophisticated AI resume analyzer. Get detailed insights, 
            personalized recommendations, and stand out to employers with a resume that showcases your true value.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex justify-center"
          >
            <motion.a 
              href="#upload"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-md font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Classical decorative elements */}
      <div className="absolute top-1/2 left-4 md:left-10 transform -translate-y-1/2 hidden md:block">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 0.3, x: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="h-60 w-px bg-gradient-to-b from-transparent via-primary to-transparent"
        ></motion.div>
      </div>
      
      <div className="absolute top-1/2 right-4 md:right-10 transform -translate-y-1/2 hidden md:block">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 0.3, x: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="h-60 w-px bg-gradient-to-b from-transparent via-primary to-transparent"
        ></motion.div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg 
          ref={svgRef}
          className="w-full"
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={controls}
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0Z"
            className="fill-background stroke-primary/20 stroke-2"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
