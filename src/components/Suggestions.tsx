
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, BadgeAlert, LightbulbIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SentenceImprover from "./SentenceImprover";

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  examples: string[];
  priority: "high" | "medium" | "low";
}

interface SuggestionsProps {
  suggestions: Suggestion[];
  industry?: string;
}

const Suggestions: React.FC<SuggestionsProps> = ({ suggestions, industry }) => {
  const [improvedSuggestions, setImprovedSuggestions] = useState<Record<string, Suggestion>>({});
  const [improvedExamples, setImprovedExamples] = useState<Record<string, string[]>>({});

  const handleSuggestionImproved = (id: string, field: keyof Suggestion, value: string) => {
    setImprovedSuggestions(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || suggestions.find(s => s.id === id) || { 
          id, 
          title: '', 
          description: '', 
          examples: [],
          priority: 'medium' as const
        }),
        [field]: value
      }
    }));
  };

  const handleExampleImproved = (suggestionId: string, exampleIndex: number, value: string) => {
    setImprovedExamples(prev => {
      const currentExamples = prev[suggestionId] || 
        suggestions.find(s => s.id === suggestionId)?.examples || [];
      
      const updatedExamples = [...currentExamples];
      updatedExamples[exampleIndex] = value;
      
      return {
        ...prev,
        [suggestionId]: updatedExamples
      };
    });
  };

  // Get suggestion with improvements applied
  const getSuggestion = (suggestion: Suggestion): Suggestion => {
    const improved = improvedSuggestions[suggestion.id];
    const improvedExamplesList = improvedExamples[suggestion.id];
    
    if (!improved && !improvedExamplesList) return suggestion;
    
    return {
      ...suggestion,
      ...(improved || {}),
      examples: improvedExamplesList || suggestion.examples
    };
  };

  const getPriorityColor = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {suggestions.map((suggestion, index) => {
        const actualSuggestion = getSuggestion(suggestion);
        
        return (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-card border rounded-lg overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b bg-muted/20">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  suggestion.priority === "high" 
                    ? "bg-red-100 dark:bg-red-900/30" 
                    : suggestion.priority === "medium" 
                      ? "bg-amber-100 dark:bg-amber-900/30" 
                      : "bg-green-100 dark:bg-green-900/30"
                }`}>
                  {suggestion.priority === "high" ? (
                    <BadgeAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
                  ) : suggestion.priority === "medium" ? (
                    <ArrowUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  ) : (
                    <LightbulbIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-lg">{actualSuggestion.title}</h3>
                    <Badge className={getPriorityColor(actualSuggestion.priority)}>
                      {actualSuggestion.priority.toUpperCase()} PRIORITY
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{actualSuggestion.description}</p>
                </div>
              </div>
              <SentenceImprover 
                originalSentence={actualSuggestion.title}
                industry={industry}
                onImproved={(improved) => handleSuggestionImproved(suggestion.id, 'title', improved)}
              />
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-sm mb-2">Examples:</h4>
                <SentenceImprover 
                  originalSentence={actualSuggestion.description}
                  industry={industry}
                  onImproved={(improved) => handleSuggestionImproved(suggestion.id, 'description', improved)}
                />
              </div>
              <ul className="space-y-2">
                {actualSuggestion.examples.map((example, exampleIndex) => (
                  <li key={exampleIndex} className="border-l-2 border-primary pl-3 py-0.5 flex justify-between items-start">
                    <span className="text-sm">{example}</span>
                    <SentenceImprover 
                      originalSentence={example}
                      industry={industry}
                      onImproved={(improved) => handleExampleImproved(suggestion.id, exampleIndex, improved)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default Suggestions;
