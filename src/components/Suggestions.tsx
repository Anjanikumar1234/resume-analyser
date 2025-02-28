
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Lightbulb } from "lucide-react";

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  examples: string[];
  priority: "high" | "medium" | "low";
}

interface SuggestionsProps {
  suggestions: Suggestion[];
}

const Suggestions: React.FC<SuggestionsProps> = ({ suggestions }) => {
  // Function to get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-50 dark:bg-red-900/20";
      case "medium":
        return "text-amber-500 bg-amber-50 dark:bg-amber-900/20";
      case "low":
        return "text-green-500 bg-green-50 dark:bg-green-900/20";
      default:
        return "text-primary bg-primary/10";
    }
  };
  
  // Function to get priority text
  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "High Priority";
      case "medium":
        return "Medium Priority";
      case "low":
        return "Consider";
      default:
        return "Suggestion";
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="bg-card rounded-xl border shadow-md p-6">
        <h3 className="text-xl font-semibold mb-5 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-amber-500" />
          Key Recommendations
        </h3>
        
        <div className="space-y-6">
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border-b pb-6 last:border-0 last:pb-0"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-lg">{suggestion.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(suggestion.priority)}`}>
                      {getPriorityText(suggestion.priority)}
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">
                    {suggestion.description}
                  </p>
                  
                  <div className="bg-muted/40 border rounded-lg p-4">
                    <h5 className="text-sm font-medium mb-2">Examples:</h5>
                    <ul className="space-y-2">
                      {suggestion.examples.map((example, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <ArrowRight className="w-4 h-4 min-w-4 mt-0.5 text-primary" />
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Suggestions;
