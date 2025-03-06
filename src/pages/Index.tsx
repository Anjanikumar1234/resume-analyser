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
  const [resumeText, setResumeText] = useState<string>("");
  const [needsAuth, setNeedsAuth] = useState(false);
  
  const uploadRef = useRef<HTMLDivElement>(null);
  const analysisRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  const handleResumeUpload = async (text: string, industry?: string) => {
    try {
      setResumeText(text);
      setIsAnalyzing(true);
      setCurrentStep(2);
      
      if (progressRef.current) {
        progressRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      
      setTimeout(() => setCurrentStep(3), 1500);
      
      console.log("Analyzing resume with text length:", text.length);
      console.log("Industry:", industry || "None specified");
      
      const results = await analyzeResume(text, industry);
      
      console.log("Analysis complete. Results:", results);
      
      setAnalysisResults(results);
      setCurrentStep(4);
      
      setTimeout(() => {
        if (analysisRef.current) {
          analysisRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      
      toast.success("Analysis complete! Review your results below.");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Something went wrong with the analysis. Please try again.");
      setIsAnalyzing(false);
      setCurrentStep(1);
    } finally {
      if (!analysisResults) {
        setIsAnalyzing(false);
      }
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

  const handleContinueAsGuest = () => {
    const guestUser = { email: "guest@example.com", role: "guest", name: "Guest User" };
    localStorage.setItem("user", JSON.stringify(guestUser));
    setUser(guestUser);
    setNeedsAuth(false);
    toast.success("Continuing as guest");
  };
  
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      <div className="relative z-10">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-indigo-100 dark:border-indigo-900">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="text-xl font-bold gradient-text">
                  AK Resume Analyser
                </Link>
              </div>
              
              <nav className="hidden md:flex items-center space-x-6">
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
          
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-card border-b"
            >
              <div className="container mx-auto px-4 py-4 space-y-4">
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

        <Hero />

        <div id="upload" ref={uploadRef}>
          <ResumeUpload 
            onUpload={handleResumeUpload} 
            onAuthNeeded={() => setNeedsAuth(true)}
            isLoggedIn={!!user}
          />
        </div>
        
        {needsAuth && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <div className="bg-card p-6 rounded-xl shadow-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
              <p className="mb-6">Please log in to analyze your resume or continue as a guest.</p>
              <div className="flex flex-col gap-3">
                <Link to="/login">
                  <Button className="w-full">
                    <LogIn className="w-4 h-4 mr-2" />
                    Log In
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={handleContinueAsGuest}
                  className="w-full"
                >
                  Continue as Guest
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setNeedsAuth(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
        
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container max-w-3xl mx-auto px-4 py-8 bg-background/50 backdrop-blur-sm rounded-lg"
            ref={progressRef}
          >
            <h3 className="text-2xl font-bold text-center mb-6">Analyzing Your Resume</h3>
            <ProgressIndicator currentStep={currentStep} steps={steps} />
          </motion.div>
        )}
        
        {analysisResults && currentStep === 4 && (
          <div ref={analysisRef} id="analysis-results" className="mt-8">
            {console.log("Rendering analysis results component with data:", analysisResults)}
            <AnalysisResults data={analysisResults} />
          </div>
        )}
        
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
        
        <ContactSection />
        
        <footer className="bg-card border-t py-8 mt-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} AK Resume Analyser. All rights reserved.
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
