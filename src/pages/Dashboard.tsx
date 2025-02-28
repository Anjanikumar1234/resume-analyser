
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FileText, User, LogOut, PlusCircle, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AnimatedBackground from "@/components/AnimatedBackground";

interface Resume {
  id: string;
  name: string;
  date: string;
  status: "analyzed" | "pending";
  overallScore: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  
  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    
    setUser(JSON.parse(storedUser));
    
    // Mock data for resumes
    const mockResumes: Resume[] = [
      {
        id: "1",
        name: "Software Developer Resume",
        date: "2023-05-15",
        status: "analyzed",
        overallScore: 78
      },
      {
        id: "2",
        name: "Product Manager Resume",
        date: "2023-06-20",
        status: "analyzed",
        overallScore: 82
      },
      {
        id: "3",
        name: "Data Scientist Resume",
        date: "2023-07-10",
        status: "pending",
        overallScore: 0
      }
    ];
    
    setResumes(mockResumes);
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };
  
  const handleNewResume = () => {
    navigate("/");
  };
  
  const handleViewResume = (id: string) => {
    navigate(`/resume/${id}`);
  };
  
  const getRecommendedJobs = (score: number) => {
    if (score >= 80) {
      return ["Senior Software Engineer", "Technical Lead", "Full Stack Developer"];
    } else if (score >= 70) {
      return ["Software Developer", "Front-end Developer", "Back-end Developer"];
    } else {
      return ["Junior Developer", "Intern", "Technical Support"];
    }
  };
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      <div className="relative z-10 container max-w-6xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold gradient-text">Your Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your resumes and track your progress
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <div className="flex items-center gap-2 bg-card cyber-border px-4 py-2 rounded-full">
              <User className="w-5 h-5 text-primary" />
              <span>{user.email}</span>
            </div>
            
            <Button variant="outline" onClick={handleLogout} size="sm" className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-card cyber-border rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Your Resumes</h2>
                  <Button onClick={handleNewResume} className="flex items-center gap-2">
                    <PlusCircle className="w-4 h-4" />
                    <span>Analyze New Resume</span>
                  </Button>
                </div>
                
                {resumes.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Resumes Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Upload your first resume to get personalized analysis
                    </p>
                    <Button onClick={handleNewResume}>Analyze Resume</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {resumes.map((resume, index) => (
                      <motion.div
                        key={resume.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border hover:border-primary/50 transition-colors cursor-pointer"
                        onClick={() => resume.status === "analyzed" && handleViewResume(resume.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium mb-1">{resume.name}</h3>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {new Date(resume.date).toLocaleDateString()}
                              </span>
                              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                                resume.status === "analyzed" 
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                                  : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                              }`}>
                                {resume.status === "analyzed" ? (
                                  <>
                                    <CheckCircle className="w-3 h-3" />
                                    <span>Analyzed</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-3 h-3" />
                                    <span>Processing</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {resume.status === "analyzed" && (
                          <div className="bg-card px-3 py-1 rounded-full border">
                            <span className="text-sm font-medium">Score: {resume.overallScore}</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-card cyber-border rounded-xl shadow-lg overflow-hidden h-full">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Recommended Jobs</h2>
                
                {resumes.some(resume => resume.status === "analyzed") ? (
                  <div className="space-y-4">
                    {resumes
                      .filter(resume => resume.status === "analyzed")
                      .slice(0, 1)
                      .map(resume => (
                        <div key={resume.id} className="space-y-4">
                          <div className="bg-muted/30 p-4 rounded-lg border">
                            <h3 className="font-medium mb-2">Based on your {resume.name}</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              With a score of {resume.overallScore}, you might be a good fit for:
                            </p>
                            <ul className="space-y-2">
                              {getRecommendedJobs(resume.overallScore).map((job, idx) => (
                                <li key={idx} className="bg-background p-2 rounded border flex justify-between items-center">
                                  <span>{job}</span>
                                  <Button size="sm" variant="ghost" className="h-7">
                                    View Openings
                                  </Button>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="bg-muted/30 p-4 rounded-lg border">
                            <h3 className="font-medium mb-2">Improve Your Resume</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              Higher scores can lead to better job opportunities. Here's how:
                            </p>
                            <ul className="space-y-1 text-sm">
                              <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Add quantifiable achievements</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Tailor keywords to specific jobs</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Improve formatting and readability</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Upload and analyze your resume to get job recommendations
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
