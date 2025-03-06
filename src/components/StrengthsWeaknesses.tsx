
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Edit } from "lucide-react";
import SentenceImprover from "./SentenceImprover";

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
  industry?: string;
}

const StrengthsWeaknesses: React.FC<StrengthsWeaknessesProps> = ({
  strengths,
  weaknesses,
  industry,
}) => {
  const [improvedStrengths, setImprovedStrengths] = useState<Record<string, Strength>>({});
  const [improvedWeaknesses, setImprovedWeaknesses] = useState<Record<string, Weakness>>({});

  const handleStrengthImproved = (id: string, field: 'text' | 'impact', value: string) => {
    setImprovedStrengths(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || strengths.find(s => s.id === id) || { id, text: '', impact: '' }),
        [field]: value
      }
    }));
  };

  const handleWeaknessImproved = (id: string, field: 'text' | 'suggestion', value: string) => {
    setImprovedWeaknesses(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || weaknesses.find(w => w.id === id) || { id, text: '', suggestion: '' }),
        [field]: value
      }
    }));
  };

  // Get the actual strength/weakness with improvements applied
  const getStrength = (strength: Strength) => {
    return improvedStrengths[strength.id] || strength;
  };

  const getWeakness = (weakness: Weakness) => {
    return improvedWeaknesses[weakness.id] || weakness;
  };

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
            {strengths.map((strength, index) => {
              const actualStrength = getStrength(strength);
              return (
                <motion.li
                  key={strength.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="border-b border-muted pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-foreground">{actualStrength.text}</h4>
                    <SentenceImprover 
                      originalSentence={actualStrength.text}
                      industry={industry}
                      onImproved={(improved) => handleStrengthImproved(strength.id, 'text', improved)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    <span className="text-green-600 dark:text-green-400 font-medium">Impact: </span>
                    {actualStrength.impact}
                  </p>
                  <div className="flex justify-end">
                    <SentenceImprover 
                      originalSentence={actualStrength.impact}
                      industry={industry}
                      onImproved={(improved) => handleStrengthImproved(strength.id, 'impact', improved)}
                    />
                  </div>
                </motion.li>
              );
            })}
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
            {weaknesses.map((weakness, index) => {
              const actualWeakness = getWeakness(weakness);
              return (
                <motion.li
                  key={weakness.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  className="border-b border-muted pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-foreground">{actualWeakness.text}</h4>
                    <SentenceImprover 
                      originalSentence={actualWeakness.text}
                      industry={industry}
                      onImproved={(improved) => handleWeaknessImproved(weakness.id, 'text', improved)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    <span className="text-red-600 dark:text-red-400 font-medium">Suggestion: </span>
                    {actualWeakness.suggestion}
                  </p>
                  <div className="flex justify-end">
                    <SentenceImprover 
                      originalSentence={actualWeakness.suggestion}
                      industry={industry}
                      onImproved={(improved) => handleWeaknessImproved(weakness.id, 'suggestion', improved)}
                    />
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default StrengthsWeaknesses;
