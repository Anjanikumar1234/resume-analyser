
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Hero from "@/components/Hero";
import AnimatedBackground from "@/components/AnimatedBackground";
import ResumeUpload from "@/components/ResumeUpload";
import ProgressIndicator from "@/components/ProgressIndicator";
import AnalysisResults from "@/components/AnalysisResults";
import ContactSection from "@/components/ContactSection";
import { analyzeResume } from "@/lib/analyzeResume";
import { AnalysisData } from "@/components/AnalysisResults";
import { toast } from "sonner";
import { Menu, X, User, LogIn, ArrowRight, FileText, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";

// Analysis steps
const steps = [
  { id: 1, name: "Upload", description: "Upload your resume or paste the text" },
  { id: 2, name: "Analyzing", description: "Our AI is extracting and analyzing key information" },
  { id: 3, name: "Scoring", description: "Calculating scores and generating insights" },
  { id: 4, name: "Results", description: "Review your personalized analysis and recommendations" }
];

const Index = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  // Store resume text to maintain consistent analysis
  const [resumeText, setResumeText] = useState<string>("");
  
  // References for scrolling
  const getStartedRef = useRef<HTMLDivElement>(null);
  const uploadRef = useRef<HTMLDivElement>(null);
  const analysisRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  const handleResumeUpload = async (text: string) => {
    try {
      setResumeText(text); // Store the resume text
      setIsAnalyzing(true);
      setCurrentStep(2);
      
      // Scroll to progress indicator
      if (progressRef.current) {
        progressRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      
      // Simulate step progression
      setTimeout(() => setCurrentStep(3), 1500);
      
      // Analyze the resume
      const results = await analyzeResume(text);
      
      // Update state with results
      setAnalysisResults(results);
      setCurrentStep(4);
      
      // Only scroll to the analysis results after they're rendered
      setTimeout(() => {
        if (analysisRef.current) {
          analysisRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      
      toast.success("Analysis complete! Review your results below.");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Something went wrong with the analysis. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully");
    setIsMenuOpen(false);
  };

  const scrollToUpload = () => {
    if (uploadRef.current) {
      uploadRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      <div className="relative z-10">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-indigo-100 dark:border-indigo-900">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="text-xl font-bold gradient-text">
                  ResumeAI
                </Link>
              </div>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                <a href="#get-started" className="text-foreground hover:text-primary transition-colors">
                  Get Started
                </a>
                <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors">
                  How It Works
                </a>
                <a href="#upload" className="text-foreground hover:text-primary transition-colors">
                  Analyze Resume
                </a>
                <a href="#contact" className="text-foreground hover:text-primary transition-colors">
                  Contact
                </a>
                {user ? (
                  <div className="flex items-center gap-4">
                    <Link 
                      to={user.role === "admin" ? "/admin" : "/dashboard"}
                      className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      {user.role === "admin" ? "Admin" : "Dashboard"}
                    </Link>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Link to="/login">
                    <Button className="flex items-center gap-2">
                      <LogIn className="w-4 h-4" />
                      Login
                    </Button>
                  </Link>
                )}
              </nav>
              
              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-foreground p-2"
                >
                  {isMenuOpen ? <X /> : <Menu />}
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-card border-b"
            >
              <div className="container mx-auto px-4 py-4 space-y-4">
                <a 
                  href="#get-started" 
                  className="block py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </a>
                <a 
                  href="#how-it-works" 
                  className="block py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  How It Works
                </a>
                <a 
                  href="#upload" 
                  className="block py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Analyze Resume
                </a>
                <a 
                  href="#contact" 
                  className="block py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </a>
                {user ? (
                  <>
                    <Link 
                      to={user.role === "admin" ? "/admin" : "/dashboard"}
                      className="block py-2 text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {user.role === "admin" ? "Admin Panel" : "Dashboard"}
                    </Link>
                    <Button variant="outline" className="w-full" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Login</Button>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </header>

        {/* Hero Section */}
        <Hero />

        {/* Get Started Section */}
        <section id="get-started" ref={getStartedRef} className="container max-w-5xl mx-auto py-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight mb-4 gradient-text">Get Started</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover how our AI-powered resume analyzer can transform your job search and career opportunities in three simple steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-card cyber-border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
            >
              <div className="p-6 text-center flex flex-col items-center h-full">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-indigo-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">1. Upload Resume</h3>
                <p className="text-muted-foreground mb-6">
                  Upload your resume document or paste your resume text to begin the analysis process.
                </p>
                <div className="mt-auto">
                  <Button onClick={scrollToUpload} className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
                    Upload Now
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card cyber-border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
            >
              <div className="p-6 text-center flex flex-col items-center h-full">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <BarChart className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">2. Review Analysis</h3>
                <p className="text-muted-foreground mb-6">
                  Get detailed scores, strengths, weaknesses, and personalized suggestions to improve your resume.
                </p>
                <div className="mt-auto">
                  <Button onClick={scrollToUpload} className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Start Analysis
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-card cyber-border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
            >
              <div className="p-6 text-center flex flex-col items-center h-full">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-pink-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">3. Land Your Job</h3>
                <p className="text-muted-foreground mb-6">
                  Apply the recommendations to create a standout resume that impresses employers and lands interviews.
                </p>
                <div className="mt-auto">
                  <Button onClick={scrollToUpload} className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Resume Upload Section */}
        <div id="upload" ref={uploadRef}>
          <ResumeUpload onUpload={handleResumeUpload} />
        </div>
        
        {/* Progress Indicator (only show during analysis) */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container max-w-3xl mx-auto px-4"
            ref={progressRef}
          >
            <ProgressIndicator currentStep={currentStep} steps={steps} />
          </motion.div>
        )}
        
        {/* Analysis Results (only show when available) */}
        {analysisResults && currentStep === 4 && (
          <div ref={analysisRef}>
            <AnalysisResults data={analysisResults} />
          </div>
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
            <h2 className="text-3xl font-bold tracking-tight mb-4 gradient-text">How It Works</h2>
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
                className="bg-card cyber-border rounded-xl p-6 text-center flex flex-col items-center"
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
        
        {/* Contact Section */}
        <ContactSection />
        
        {/* Footer */}
        <footer className="bg-card border-t py-8 mt-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} AI Resume Analyzer. All rights reserved.
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Developed by Pallapolu Anjani Kumar
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
