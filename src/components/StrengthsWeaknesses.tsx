
import React from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

export interface Strength {
  id: string;
  text: string;
  impact: string;
}

export interface Weakness {
  id: string;
  text: string;
  suggestion: string;
}

interface StrengthsWeaknessesProps {
  strengths: Strength[];
  weaknesses: Weakness[];
}

const StrengthsWeaknesses: React.FC<StrengthsWeaknessesProps> = ({
  strengths,
  weaknesses,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-card rounded-xl border shadow-md overflow-hidden"
      >
        <div className="bg-green-50 dark:bg-green-900/20 p-4 border-b">
          <h3 className="text-xl font-semibold flex items-center text-green-700 dark:text-green-400">
            <Check className="w-5 h-5 mr-2" />
            Strengths
          </h3>
        </div>
        
        <div className="p-4">
          <ul className="space-y-4">
            {strengths.map((strength, index) => (
              <motion.li
                key={strength.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="border-b border-muted pb-4 last:border-0 last:pb-0"
              >
                <h4 className="font-medium text-foreground mb-1">
                  {strength.text}
                </h4>
                <p className="text-sm text-muted-foreground">
                  <span className="text-green-600 dark:text-green-400 font-medium">Impact: </span>
                  {strength.impact}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-card rounded-xl border shadow-md overflow-hidden"
      >
        <div className="bg-red-50 dark:bg-red-900/20 p-4 border-b">
          <h3 className="text-xl font-semibold flex items-center text-red-700 dark:text-red-400">
            <X className="w-5 h-5 mr-2" />
            Areas to Improve
          </h3>
        </div>
        
        <div className="p-4">
          <ul className="space-y-4">
            {weaknesses.map((weakness, index) => (
              <motion.li
                key={weakness.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                className="border-b border-muted pb-4 last:border-0 last:pb-0"
              >
                <h4 className="font-medium text-foreground mb-1">
                  {weakness.text}
                </h4>
                <p className="text-sm text-muted-foreground">
                  <span className="text-red-600 dark:text-red-400 font-medium">Suggestion: </span>
                  {weakness.suggestion}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default StrengthsWeaknesses;
