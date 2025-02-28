
import React from "react";
import { motion } from "framer-motion";
import { Check, Cpu } from "lucide-react";

interface Step {
  id: number;
  name: string;
  description: string;
}

interface ProgressIndicatorProps {
  currentStep: number;
  steps: Step[];
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  currentStep, 
  steps 
}) => {
  return (
    <div className="py-8">
      <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-between w-full max-w-2xl mb-8">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            
            return (
              <React.Fragment key={step.id}>
                {index > 0 && (
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-0.5 bg-muted pointer-events-none">
                    <motion.div 
                      className="h-full bg-primary"
                      initial={{ width: "0%" }}
                      animate={{ 
                        width: isCompleted 
                          ? "100%" 
                          : isCurrent 
                            ? "50%" 
                            : "0%" 
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}
                
                <div className="relative z-10">
                  <motion.div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted 
                        ? "bg-primary text-white" 
                        : isCurrent 
                          ? "border-2 border-primary bg-primary/10 text-primary" 
                          : "border-2 border-muted bg-card text-muted-foreground"
                    }`}
                    initial={{ scale: 0.8 }}
                    animate={{ 
                      scale: isCurrent ? 1.1 : 1,
                      transition: { 
                        duration: 0.3, 
                        repeat: isCurrent ? Infinity : 0,
                        repeatType: "reverse"
                      }
                    }}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : isCurrent ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Cpu className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </motion.div>
                  
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center w-28">
                    <motion.span 
                      className={`text-xs font-medium ${
                        isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 * index }}
                    >
                      {step.name}
                    </motion.span>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
        
        <motion.div 
          className="text-center bg-muted/50 rounded-lg px-4 py-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-muted-foreground">
            {steps.find(step => step.id === currentStep)?.description || "Processing..."}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
