
import React from "react";
import { motion } from "framer-motion";
import AnimatedScore from "./AnimatedScore";
import StrengthsWeaknesses, { Strength, Weakness } from "./StrengthsWeaknesses";
import Suggestions, { Suggestion } from "./Suggestions";
import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface AnalysisData {
  overallScore: number;
  readabilityScore: number;
  relevanceScore: number;
  keywordsScore: number;
  strengths: Strength[];
  weaknesses: Weakness[];
  suggestions: Suggestion[];
}

interface AnalysisResultsProps {
  data: AnalysisData;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ data }) => {
  const handleDownload = () => {
    // Create text content for the download
    const content = `
Resume Analysis Results

Overall Score: ${data.overallScore}/100
Readability Score: ${data.readabilityScore}/100
Relevance Score: ${data.relevanceScore}/100
Keywords Score: ${data.keywordsScore}/100

Strengths:
${data.strengths.map(s => `- ${s.text}\n  Impact: ${s.impact}`).join('\n')}

Areas to Improve:
${data.weaknesses.map(w => `- ${w.text}\n  Suggestion: ${w.suggestion}`).join('\n')}

Key Recommendations:
${data.suggestions.map(s => `- ${s.title} (${s.priority} priority)\n  ${s.description}\n  Examples:\n  ${s.examples.map(e => `  * ${e}`).join('\n')}`).join('\n\n')}
    `;
    
    // Create a blob and download link
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume-analysis-results.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Analysis results downloaded successfully!");
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Resume Analysis Results",
          text: `Check out my resume analysis! Overall score: ${data.overallScore}/100`,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        toast.error("Error sharing results");
      }
    } else {
      toast.error("Share functionality not supported by your browser");
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="container max-w-4xl mx-auto py-12 px-4"
    >
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4"
        >
          Analysis Complete
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl font-bold tracking-tight mb-4"
        >
          Your Resume Analysis Results
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-muted-foreground max-w-2xl mx-auto"
        >
          We've analyzed your resume using our advanced AI. Here's a detailed breakdown of your strengths, areas to improve, and personalized recommendations.
        </motion.p>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-card rounded-xl border shadow-lg overflow-hidden mb-12"
      >
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatedScore
              score={data.overallScore}
              title="Overall Score"
              description="Your resume's overall effectiveness"
              color="primary"
              delay={0}
            />
            
            <AnimatedScore
              score={data.readabilityScore}
              title="Readability"
              description="How clear and easy to read"
              color={data.readabilityScore >= 70 ? "green" : data.readabilityScore >= 40 ? "amber" : "red"}
              delay={0.2}
            />
            
            <AnimatedScore
              score={data.relevanceScore}
              title="Relevance"
              description="Match to job market needs"
              color={data.relevanceScore >= 70 ? "green" : data.relevanceScore >= 40 ? "amber" : "red"}
              delay={0.4}
            />
            
            <AnimatedScore
              score={data.keywordsScore}
              title="Keywords"
              description="Industry-relevant terms used"
              color={data.keywordsScore >= 70 ? "green" : data.keywordsScore >= 40 ? "amber" : "red"}
              delay={0.6}
            />
          </div>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mb-12"
      >
        <h3 className="text-2xl font-bold mb-6">Strengths & Areas to Improve</h3>
        <StrengthsWeaknesses strengths={data.strengths} weaknesses={data.weaknesses} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mb-12"
      >
        <h3 className="text-2xl font-bold mb-6">Improvement Recommendations</h3>
        <Suggestions suggestions={data.suggestions} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button onClick={handleDownload} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download Results
        </Button>
        
        <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          Share Results
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default AnalysisResults;
