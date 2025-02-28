
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedScoreProps {
  score: number;
  title: string;
  description: string;
  color?: string;
  delay?: number;
}

const AnimatedScore: React.FC<AnimatedScoreProps> = ({ 
  score, 
  title, 
  description,
  color = "primary",
  delay = 0
}) => {
  const [currentScore, setCurrentScore] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const incrementScore = () => {
        setCurrentScore(prevScore => {
          const nextScore = prevScore + 1;
          if (nextScore >= score) {
            return score;
          }
          return nextScore;
        });
      };
      
      const interval = setInterval(incrementScore, 2000 / score);
      
      return () => clearInterval(interval);
    }, delay * 1000);
    
    return () => clearTimeout(timer);
  }, [score, delay]);
  
  // Determine the color class based on the score
  let colorClass;
  let bgColorClass;
  
  if (color === "primary") {
    colorClass = "text-primary";
    bgColorClass = "bg-primary";
  } else if (color === "green") {
    colorClass = "text-green-600";
    bgColorClass = "bg-green-600";
  } else if (color === "amber") {
    colorClass = "text-amber-600";
    bgColorClass = "bg-amber-600";
  } else if (color === "red") {
    colorClass = "text-red-600";
    bgColorClass = "bg-red-600";
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-center"
    >
      <div className="mb-4 w-full max-w-[150px]">
        <div className="relative pt-[100%]"> {/* This creates a square aspect ratio */}
          <svg
            className="absolute inset-0 w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted"
            />
            
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="283" // 2 * PI * r (circumference)
              strokeDashoffset={283 - (283 * currentScore) / 100}
              className={colorClass}
              initial={{ strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: 283 - (283 * currentScore) / 100 }}
              transition={{ duration: 2, delay, ease: "easeOut" }}
            />
            
            {/* Text in the middle */}
            <text
              x="50"
              y="50"
              textAnchor="middle"
              dy=".3em"
              className="text-4xl font-bold fill-current"
            >
              {currentScore}
            </text>
          </svg>
        </div>
      </div>
      
      <div className="text-center mt-2">
        <h4 className="font-medium text-lg mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      <motion.div 
        className="w-full mt-4 h-2 bg-muted rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.3 }}
      >
        <motion.div 
          className={`h-full ${bgColorClass}`}
          initial={{ width: "0%" }}
          animate={{ width: `${currentScore}%` }}
          transition={{ duration: 2, delay: delay + 0.5 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default AnimatedScore;
