
import React from "react";
import { motion } from "framer-motion";
import AnimatedScore from "./AnimatedScore";
import StrengthsWeaknesses, { Strength, Weakness } from "./StrengthsWeaknesses";
import Suggestions, { Suggestion } from "./Suggestions";
import { Download, Briefcase, CheckSquare, FileSearch, Share, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export interface AnalysisData {
  overallScore: number;
  readabilityScore: number;
  relevanceScore: number;
  keywordsScore: number;
  atsCompatibilityScore?: number;
  industryFitScore?: number;
  strengths: Strength[];
  weaknesses: Weakness[];
  suggestions: Suggestion[];
  keywordSuggestions?: { category: string; missing: string[]; overused: string[] }[];
  industryAnalysis?: {
    industry: string;
    relevantSkills: string[];
    missingSkills: string[];
    industryTrends: string[];
  };
  atsAnalysis?: {
    isParseable: boolean;
    missingKeywords: string[];
    formatIssues: string[];
    overallCompatibility: "high" | "medium" | "low";
  };
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
          skills: ["React", "Node.js", "AWS", "System Architecture"]
        },
        {
          title: "Technical Lead",
          company: "InnovateSoft",
          match: 88,
          description: "Guide a team of developers in building scalable web applications and mentoring junior developers.",
          skills: ["Team Leadership", "Full Stack Development", "Agile", "Code Review"]
        },
        {
          title: "DevOps Engineer",
          company: "CloudScale",
          match: 85,
          description: "Implement and maintain CI/CD pipelines and infrastructure automation for cloud applications.",
          skills: ["Docker", "Kubernetes", "AWS", "CI/CD"]
        }
      ];
    } else if (overallScore >= 70) {
      return [
        {
          title: "Frontend Developer",
          company: "WebWorks",
          match: 84,
          description: "Build responsive user interfaces and implement UI/UX designs using modern web technologies.",
          skills: ["JavaScript", "React", "CSS", "Responsive Design"]
        },
        {
          title: "Backend Developer",
          company: "DataFlow Systems",
          match: 79,
          description: "Develop and maintain RESTful APIs and server-side applications with focus on performance.",
          skills: ["Node.js", "Express", "SQL", "API Design"]
        },
        {
          title: "QA Engineer",
          company: "QualityFirst",
          match: 76,
          description: "Create and execute test plans, identify bugs, and ensure software quality through automated testing.",
          skills: ["Test Automation", "Selenium", "Jest", "QA Methodologies"]
        }
      ];
    } else {
      return [
        {
          title: "Junior Web Developer",
          company: "GrowthTech",
          match: 75,
          description: "Learn and grow while implementing website features under the guidance of senior developers.",
          skills: ["HTML", "CSS", "JavaScript", "Git"]
        },
        {
          title: "Technical Support Specialist",
          company: "SupportHub",
          match: 70,
          description: "Provide technical assistance to users, troubleshoot issues, and document solutions.",
          skills: ["Problem Solving", "Communication", "Technical Documentation", "Customer Service"]
        },
        {
          title: "QA Tester",
          company: "BugBusters",
          match: 68,
          description: "Execute test cases, report bugs, and verify fixes to ensure software quality.",
          skills: ["Testing", "Bug Reporting", "Attention to Detail", "Software Quality"]
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
${data.atsCompatibilityScore ? `ATS Compatibility Score: ${data.atsCompatibilityScore}/100` : ''}
${data.industryFitScore ? `Industry Fit Score: ${data.industryFitScore}/100` : ''}

Strengths:
${data.strengths.map(s => `- ${s.text}\n  Impact: ${s.impact}`).join('\n')}

Areas to Improve:
${data.weaknesses.map(w => `- ${w.text}\n  Suggestion: ${w.suggestion}`).join('\n')}

Key Recommendations:
${data.suggestions.map(s => `- ${s.title} (${s.priority} priority)\n  ${s.description}\n  Examples:\n  ${s.examples.map(e => `  * ${e}`).join('\n')}`).join('\n\n')}

${data.keywordSuggestions ? `Keyword Optimization:
${data.keywordSuggestions.map(k => `- ${k.category}:\n  Missing: ${k.missing.join(', ')}\n  Overused: ${k.overused.join(', ')}`).join('\n')}` : ''}

${data.atsAnalysis ? `ATS Compatibility Analysis:
- Parseable by ATS: ${data.atsAnalysis.isParseable ? 'Yes' : 'No'}
- Overall Compatibility: ${data.atsAnalysis.overallCompatibility.toUpperCase()}
- Missing Keywords: ${data.atsAnalysis.missingKeywords.join(', ')}
- Format Issues: ${data.atsAnalysis.formatIssues.join(', ')}` : ''}

${data.industryAnalysis ? `Industry Analysis (${data.industryAnalysis.industry}):
- Relevant Skills: ${data.industryAnalysis.relevantSkills.join(', ')}
- Missing Skills: ${data.industryAnalysis.missingSkills.join(', ')}
- Industry Trends: ${data.industryAnalysis.industryTrends.join(', ')}` : ''}

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
  
  const handleShare = () => {
    // Simple share functionality
    if (navigator.share) {
      navigator.share({
        title: 'My Resume Analysis Results',
        text: `My resume scored ${data.overallScore}/100! Check out this resume analysis tool.`,
        url: window.location.href,
      })
      .then(() => toast.success("Shared successfully!"))
      .catch((error) => toast.error("Error sharing: " + error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success("Link copied to clipboard!"))
        .catch(() => toast.error("Failed to copy link"));
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
          
          {/* New advanced scores */}
          {(data.atsCompatibilityScore || data.industryFitScore) && (
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-xl font-bold mb-6">Advanced Analysis</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {data.atsCompatibilityScore && (
                  <AnimatedScore
                    score={data.atsCompatibilityScore}
                    title="ATS Compatibility"
                    description="How well your resume works with ATS systems"
                    color={data.atsCompatibilityScore >= 70 ? "green" : data.atsCompatibilityScore >= 40 ? "amber" : "red"}
                    delay={0.8}
                  />
                )}
                
                {data.industryFitScore && (
                  <AnimatedScore
                    score={data.industryFitScore}
                    title="Industry Fit"
                    description={`Alignment with ${data.industryAnalysis?.industry || 'industry'} needs`}
                    color={data.industryFitScore >= 70 ? "green" : data.industryFitScore >= 40 ? "amber" : "red"}
                    delay={1}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Tabbed Content for Analysis Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mb-12"
      >
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="ats">ATS Compatibility</TabsTrigger>
            <TabsTrigger value="industry">Industry Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
            <h3 className="text-2xl font-bold mb-6 gradient-text">Strengths & Areas to Improve</h3>
            <StrengthsWeaknesses strengths={data.strengths} weaknesses={data.weaknesses} />
            
            <h3 className="text-2xl font-bold mt-12 mb-6 gradient-text">Improvement Recommendations</h3>
            <Suggestions suggestions={data.suggestions} />
          </TabsContent>
          
          <TabsContent value="keywords" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold gradient-text">Keyword Optimization</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                  Score: {data.keywordsScore}/100
                </Badge>
              </div>
            </div>
            
            {data.keywordSuggestions ? (
              <div className="space-y-6">
                {data.keywordSuggestions.map((category, index) => (
                  <Card key={index} className="p-6">
                    <h4 className="text-xl font-semibold mb-4 flex items-center">
                      <Tag className="w-5 h-5 mr-2 text-primary" />
                      {category.category}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium mb-2 text-red-500 dark:text-red-400">Missing Keywords</h5>
                        {category.missing.length > 0 ? (
                          <ul className="space-y-2">
                            {category.missing.map((keyword, kidx) => (
                              <li key={kidx} className="flex items-start gap-2">
                                <span className="inline-block w-2 h-2 rounded-full bg-red-500 dark:bg-red-400 mt-1.5"></span>
                                <span>{keyword}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground text-sm">No missing keywords in this category</p>
                        )}
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2 text-amber-500 dark:text-amber-400">Overused Terms</h5>
                        {category.overused.length > 0 ? (
                          <ul className="space-y-2">
                            {category.overused.map((keyword, kidx) => (
                              <li key={kidx} className="flex items-start gap-2">
                                <span className="inline-block w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400 mt-1.5"></span>
                                <span>{keyword}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground text-sm">No overused terms in this category</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-muted p-6 rounded-lg text-center">
                <p className="text-muted-foreground">Keyword analysis not available for this resume</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="ats" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold gradient-text">ATS Compatibility</h3>
              <div className="flex items-center gap-2">
                {data.atsCompatibilityScore && (
                  <Badge variant="outline" className={`
                    ${data.atsCompatibilityScore >= 70 
                      ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" 
                      : data.atsCompatibilityScore >= 50
                        ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                        : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                    }
                  `}>
                    Score: {data.atsCompatibilityScore}/100
                  </Badge>
                )}
              </div>
            </div>
            
            {data.atsAnalysis ? (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <CheckSquare className={`w-6 h-6 mr-3 ${
                      data.atsAnalysis.isParseable ? "text-green-500" : "text-red-500"
                    }`} />
                    <h4 className="text-lg font-medium">
                      {data.atsAnalysis.isParseable 
                        ? "Your resume is parseable by ATS systems" 
                        : "Your resume may have parsing issues with ATS systems"}
                    </h4>
                  </div>
                  <Badge className={`
                    ${data.atsAnalysis.overallCompatibility === "high"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : data.atsAnalysis.overallCompatibility === "medium"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }
                  `}>
                    {data.atsAnalysis.overallCompatibility.toUpperCase()} COMPATIBILITY
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h5 className="font-medium mb-3">Missing Keywords</h5>
                    {data.atsAnalysis.missingKeywords.length > 0 ? (
                      <ul className="space-y-2">
                        {data.atsAnalysis.missingKeywords.map((keyword, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="inline-block w-2 h-2 rounded-full bg-red-500 dark:bg-red-400 mt-1.5"></span>
                            <span>{keyword}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground text-sm">No missing keywords detected</p>
                    )}
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-3">Format Issues</h5>
                    {data.atsAnalysis.formatIssues.length > 0 ? (
                      <ul className="space-y-2">
                        {data.atsAnalysis.formatIssues.map((issue, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400 mt-1.5"></span>
                            <span>{issue}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground text-sm">No format issues detected</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <h5 className="font-medium mb-3">Tips for ATS Optimization</h5>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5"></span>
                      <span>Use standard section headings like "Experience," "Education," and "Skills"</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5"></span>
                      <span>Avoid tables, headers, footers, and complex formatting</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5"></span>
                      <span>Include keywords from the job description in your resume</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5"></span>
                      <span>Use both acronyms and spelled-out versions of technical terms (e.g., "UI/UX" and "User Interface/User Experience")</span>
                    </li>
                  </ul>
                </div>
              </Card>
            ) : (
              <div className="bg-muted p-6 rounded-lg text-center">
                <p className="text-muted-foreground">ATS compatibility analysis not available for this resume</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="industry" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold gradient-text">Industry Analysis</h3>
              <div className="flex items-center gap-2">
                {data.industryFitScore && (
                  <Badge variant="outline" className={`
                    ${data.industryFitScore >= 70 
                      ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" 
                      : data.industryFitScore >= 50
                        ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                        : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                    }
                  `}>
                    Score: {data.industryFitScore}/100
                  </Badge>
                )}
              </div>
            </div>
            
            {data.industryAnalysis ? (
              <Card className="p-6">
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2 flex items-center">
                    <FileSearch className="w-5 h-5 mr-2 text-primary" />
                    Industry: {data.industryAnalysis.industry}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Analysis of your resume's fit for the {data.industryAnalysis.industry} industry
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h5 className="font-medium mb-3 text-green-600 dark:text-green-400">Relevant Skills Present</h5>
                    <ul className="space-y-2">
                      {data.industryAnalysis.relevantSkills.map((skill, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="inline-block w-2 h-2 rounded-full bg-green-500 dark:bg-green-400 mt-1.5"></span>
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-3 text-red-600 dark:text-red-400">Missing Skills</h5>
                    <ul className="space-y-2">
                      {data.industryAnalysis.missingSkills.map((skill, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="inline-block w-2 h-2 rounded-full bg-red-500 dark:bg-red-400 mt-1.5"></span>
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <h5 className="font-medium mb-3">Industry Trends</h5>
                  <ul className="space-y-2">
                    {data.industryAnalysis.industryTrends.map((trend, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="inline-block w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 mt-1.5"></span>
                        <span>{trend}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ) : (
              <div className="bg-muted p-6 rounded-lg text-center">
                <p className="text-muted-foreground">Industry analysis not available for this resume</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
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
        
        <Button onClick={handleShare} variant="outline" className="flex items-center gap-2">
          <Share className="w-4 h-4" />
          Share Results
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default AnalysisResults;
