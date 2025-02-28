
import React from "react";
import { motion } from "framer-motion";
import AnimatedScore from "./AnimatedScore";
import StrengthsWeaknesses, { Strength, Weakness } from "./StrengthsWeaknesses";
import Suggestions, { Suggestion } from "./Suggestions";
import { Download, Share2, Briefcase, ExternalLink } from "lucide-react";
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

interface JobRecommendation {
  title: string;
  company: string;
  match: number;
  description: string;
  skills: string[];
  link: string;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ data }) => {
  // Generate job recommendations based on score
  const getJobRecommendations = (): JobRecommendation[] => {
    const { overallScore } = data;
    
    if (overallScore >= 80) {
      return [
        {
          title: "Senior Software Engineer",
          company: "TechGlobal Inc.",
          match: 92,
          description: "Lead development of enterprise applications using React, Node.js, and cloud infrastructure.",
          skills: ["React", "Node.js", "AWS", "System Architecture"],
          link: "#"
        },
        {
          title: "Technical Lead",
          company: "InnovateSoft",
          match: 88,
          description: "Guide a team of developers in building scalable web applications and mentoring junior developers.",
          skills: ["Team Leadership", "Full Stack Development", "Agile", "Code Review"],
          link: "#"
        },
        {
          title: "DevOps Engineer",
          company: "CloudScale",
          match: 85,
          description: "Implement and maintain CI/CD pipelines and infrastructure automation for cloud applications.",
          skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
          link: "#"
        }
      ];
    } else if (overallScore >= 70) {
      return [
        {
          title: "Frontend Developer",
          company: "WebWorks",
          match: 84,
          description: "Build responsive user interfaces and implement UI/UX designs using modern web technologies.",
          skills: ["JavaScript", "React", "CSS", "Responsive Design"],
          link: "#"
        },
        {
          title: "Backend Developer",
          company: "DataFlow Systems",
          match: 79,
          description: "Develop and maintain RESTful APIs and server-side applications with focus on performance.",
          skills: ["Node.js", "Express", "SQL", "API Design"],
          link: "#"
        },
        {
          title: "QA Engineer",
          company: "QualityFirst",
          match: 76,
          description: "Create and execute test plans, identify bugs, and ensure software quality through automated testing.",
          skills: ["Test Automation", "Selenium", "Jest", "QA Methodologies"],
          link: "#"
        }
      ];
    } else {
      return [
        {
          title: "Junior Web Developer",
          company: "GrowthTech",
          match: 75,
          description: "Learn and grow while implementing website features under the guidance of senior developers.",
          skills: ["HTML", "CSS", "JavaScript", "Git"],
          link: "#"
        },
        {
          title: "Technical Support Specialist",
          company: "SupportHub",
          match: 70,
          description: "Provide technical assistance to users, troubleshoot issues, and document solutions.",
          skills: ["Problem Solving", "Communication", "Technical Documentation", "Customer Service"],
          link: "#"
        },
        {
          title: "QA Tester",
          company: "BugBusters",
          match: 68,
          description: "Execute test cases, report bugs, and verify fixes to ensure software quality.",
          skills: ["Testing", "Bug Reporting", "Attention to Detail", "Software Quality"],
          link: "#"
        }
      ];
    }
  };
  
  const jobRecommendations = getJobRecommendations();
  
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

Job Recommendations:
${jobRecommendations.map(job => `- ${job.title} at ${job.company} (${job.match}% match)\n  ${job.description}\n  Required Skills: ${job.skills.join(', ')}`).join('\n\n')}
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
          className="text-3xl font-bold tracking-tight mb-4 gradient-text"
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
        className="bg-card cyber-border rounded-xl overflow-hidden mb-12"
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
        <h3 className="text-2xl font-bold mb-6 gradient-text">Strengths & Areas to Improve</h3>
        <StrengthsWeaknesses strengths={data.strengths} weaknesses={data.weaknesses} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mb-12"
      >
        <h3 className="text-2xl font-bold mb-6 gradient-text">Improvement Recommendations</h3>
        <Suggestions suggestions={data.suggestions} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="mb-12"
      >
        <h3 className="text-2xl font-bold mb-6 gradient-text">Job Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {jobRecommendations.map((job, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
              className="bg-card cyber-border rounded-xl overflow-hidden flex flex-col h-full"
            >
              <div className="bg-primary/5 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-lg line-clamp-1">{job.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    job.match >= 85 
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                      : job.match >= 75 
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" 
                        : "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400"
                  }`}>
                    {job.match}% Match
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{job.company}</p>
              </div>
              
              <div className="p-4 flex-1">
                <p className="text-sm mb-4">
                  {job.description}
                </p>
                
                <div className="mb-4">
                  <h5 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Required Skills</h5>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, idx) => (
                      <span 
                        key={idx}
                        className="text-xs bg-muted px-2 py-1 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="border-t p-3">
                <Button variant="outline" size="sm" className="w-full">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Job
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button onClick={handleDownload} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
          <Download className="w-4 h-4" />
          Download Results
        </Button>
        
        <Button variant="outline" onClick={handleShare} className="flex items-center gap-2 border-indigo-300 hover:bg-indigo-50 dark:border-indigo-800 dark:hover:bg-indigo-950/20">
          <Share2 className="w-4 h-4" />
          Share Results
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default AnalysisResults;
