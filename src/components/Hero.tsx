
import React, { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

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
    <section className="relative flex items-center justify-center min-h-[70vh] px-4 py-20 overflow-hidden">
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
            className="mb-4"
          >
            <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider text-primary bg-primary/10 rounded-full">
              AI-POWERED
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="block">Transform Your Resume With</span>
            <span className="relative inline-block mt-2">
              Advanced AI Analysis
              <motion.span 
                className="absolute bottom-0 left-0 w-full h-1 bg-primary"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
              ></motion.span>
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Unlock your career potential with our AI resume analyzer. Get detailed insights, personalized recommendations, and stand out to employers.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <motion.a
              href="#upload"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-md font-medium transition-all shadow-md hover:shadow-lg"
            >
              Analyze My Resume
            </motion.a>
            
            <motion.a
              href="#how-it-works"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-transparent border border-primary text-primary rounded-md font-medium transition-all"
            >
              How It Works
            </motion.a>
          </motion.div>
        </motion.div>
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
