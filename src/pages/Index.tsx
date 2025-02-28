
import React, { useState } from "react";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import AnimatedBackground from "@/components/AnimatedBackground";
import ResumeUpload from "@/components/ResumeUpload";
import ProgressIndicator from "@/components/ProgressIndicator";
import AnalysisResults from "@/components/AnalysisResults";
import { analyzeResume } from "@/lib/analyzeResume";
import { AnalysisData } from "@/components/AnalysisResults";
import { toast } from "sonner";

// Analysis steps
const steps = [
  { id: 1, name: "Upload", description: "Upload your resume or paste the text" },
  { id: 2, name: "Analyzing", description: "Our AI is extracting and analyzing key information" },
  { id: 3, name: "Scoring", description: "Calculating scores and generating insights" },
  { id: 4, name: "Results", description: "Review your personalized analysis and recommendations" }
];

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisData | null>(null);
  
  const handleResumeUpload = async (text: string) => {
    try {
      setIsAnalyzing(true);
      setCurrentStep(2);
      
      // Scroll to the progress indicator
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth"
      });
      
      // Simulate step progression
      setTimeout(() => setCurrentStep(3), 1500);
      
      // Analyze the resume
      const results = await analyzeResume(text);
      
      // Update state with results
      setAnalysisResults(results);
      setCurrentStep(4);
      toast.success("Analysis complete! Review your results below.");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Something went wrong with the analysis. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <Hero />
        
        {/* Resume Upload Section */}
        <ResumeUpload onUpload={handleResumeUpload} />
        
        {/* Progress Indicator (only show during analysis) */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container max-w-3xl mx-auto px-4"
          >
            <ProgressIndicator currentStep={currentStep} steps={steps} />
          </motion.div>
        )}
        
        {/* Analysis Results (only show when available) */}
        {analysisResults && currentStep === 4 && (
          <AnalysisResults data={analysisResults} />
        )}
        
        {/* How It Works Section */}
        <section id="how-it-works" className="container max-w-5xl mx-auto py-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered resume analyzer breaks down your resume and provides actionable feedback in just a few simple steps.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card rounded-xl border p-6 text-center flex flex-col items-center"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-lg font-bold text-primary">{step.id}</span>
                </div>
                <h3 className="text-lg font-medium mb-2">{step.name}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Footer */}
        <footer className="bg-card border-t py-8 mt-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} AI Resume Analyzer. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
