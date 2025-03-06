
import { OpenAI } from "openai";

// Define type for resume analysis function
export interface AnalysisData {
  overallScore: number;
  readabilityScore: number;
  relevanceScore: number;
  keywordsScore: number;
  atsCompatibilityScore: number;
  industryFitScore: number;
  strengths: { id: string; text: string; impact: string }[];
  weaknesses: { id: string; text: string; suggestion: string }[];
  suggestions: { id: string; title: string; description: string; examples: string[]; priority: "high" | "medium" | "low" }[];
  keywordSuggestions: { category: string; missing: string[]; overused: string[] }[];
  industryAnalysis: {
    industry: string;
    relevantSkills: string[];
    missingSkills: string[];
    industryTrends: string[];
  };
  atsAnalysis: {
    isParseable: boolean;
    missingKeywords: string[];
    formatIssues: string[];
    overallCompatibility: "high" | "medium" | "low";
  };
}

/**
 * Analyzes a resume text and returns detailed analysis data
 */
export const analyzeResume = async (text: string, industry?: string): Promise<AnalysisData> => {
  console.log("Analyzing resume text...", text.substring(0, 100) + "...");
  console.log("Industry specified:", industry || "None");
  
  // Simulate a processing delay to make it feel more realistic
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Extract text contents
  const resumeContent = text.toLowerCase();
  
  // Actually analyze the resume content
  // 1. Check for education keywords
  const educationTerms = ['degree', 'university', 'college', 'bachelor', 'master', 'phd', 'diploma', 'graduate', 'certification', 'certificate'];
  const hasEducation = educationTerms.some(term => resumeContent.includes(term));
  const educationScore = hasEducation ? 85 : 45;
  
  // 2. Check for experience keywords
  const experienceTerms = ['experience', 'work', 'job', 'position', 'role', 'company', 'employer', 'client'];
  const hasExperience = experienceTerms.some(term => resumeContent.includes(term));
  const experienceScore = hasExperience ? 90 : 50;
  
  // 3. Check for skills
  const skillsTerms = ['skill', 'proficient', 'knowledge', 'expertise', 'competent', 'capable', 'familiar', 'advanced'];
  const hasSkills = skillsTerms.some(term => resumeContent.includes(term));
  const skillsScore = hasSkills ? 80 : 60;
  
  // 4. Check for achievements
  const achievementTerms = ['achieved', 'led', 'increased', 'improved', 'reduced', 'created', 'developed', 'managed', 'organized'];
  const hasAchievements = achievementTerms.some(term => resumeContent.includes(term));
  const achievementsScore = hasAchievements ? 95 : 55;
  
  // 5. Check for quantifiable results
  const quantifiableTerms = ['%', 'percent', 'increased by', 'reduced by', 'million', 'thousand', 'grew', 'decreased'];
  const hasQuantifiableResults = quantifiableTerms.some(term => resumeContent.includes(term));
  const quantifiableScore = hasQuantifiableResults ? 90 : 50;
  
  // 6. Check for contact information
  const contactTerms = ['email', 'phone', 'address', 'linkedin', 'github', 'portfolio', 'website'];
  const hasContactInfo = contactTerms.some(term => resumeContent.includes(term));
  const contactScore = hasContactInfo ? 100 : 40;
  
  // 7. Check readability
  const wordCount = text.split(/\s+/).length;
  const sentenceCount = text.split(/[.!?]+/).length;
  const avgWordLength = text.length / wordCount;
  const wordsPerSentence = wordCount / sentenceCount;
  
  // Ideal readability: 15-20 words per sentence, avg word length 4-6 characters
  const readabilityScore = Math.min(100, Math.max(40, 
    100 - Math.abs(wordsPerSentence - 17) * 3 - 
    Math.abs(avgWordLength - 5) * 5));
  
  // 8. Check for industry-specific keywords based on selected industry
  let industryKeywords: string[] = [];
  let industryFitScore = 50;
  
  if (industry) {
    switch(industry) {
      case 'technology':
        industryKeywords = ['software', 'development', 'programming', 'code', 'javascript', 'python', 'java', 'c++', 'react', 'angular', 'vue', 'node', 'web', 'app', 'mobile', 'cloud', 'aws', 'azure', 'database', 'sql', 'nosql', 'api', 'rest', 'graphql', 'git', 'agile', 'scrum', 'devops', 'ci/cd'];
        break;
      case 'healthcare':
        industryKeywords = ['patient', 'care', 'medical', 'clinical', 'health', 'hospital', 'doctor', 'nurse', 'therapy', 'treatment', 'diagnosis', 'pharmaceutical', 'medicine', 'healthcare', 'ehr', 'emr', 'hipaa'];
        break;
      case 'finance':
        industryKeywords = ['financial', 'accounting', 'audit', 'tax', 'investment', 'banking', 'loan', 'credit', 'mortgage', 'finance', 'portfolio', 'budget', 'revenue', 'profit', 'asset', 'liability', 'capital', 'equity', 'stock', 'bond', 'security', 'risk', 'compliance'];
        break;
      case 'marketing':
        industryKeywords = ['marketing', 'brand', 'advertising', 'campaign', 'social media', 'digital', 'seo', 'ppc', 'content', 'strategy', 'analytics', 'target', 'market', 'audience', 'consumer', 'customer', 'conversion', 'engagement', 'roi', 'ctr', 'cpa', 'cpc'];
        break;
      case 'education':
        industryKeywords = ['education', 'teaching', 'learning', 'student', 'curriculum', 'instruction', 'classroom', 'school', 'college', 'university', 'course', 'professor', 'teacher', 'faculty', 'academic', 'assessment', 'pedagogy', 'e-learning'];
        break;
      default:
        industryKeywords = ['professional', 'experience', 'skill', 'qualified', 'knowledge', 'leadership', 'management', 'communication', 'teamwork', 'project'];
    }
    
    // Calculate how many of these keywords are present in the resume
    const presentKeywords = industryKeywords.filter(keyword => resumeContent.includes(keyword.toLowerCase()));
    industryFitScore = Math.min(100, Math.max(40, Math.round((presentKeywords.length / industryKeywords.length) * 100)));
  }
  
  // 9. Check ATS compatibility
  const atsPotentialIssues = [];
  
  if (text.length < 300) {
    atsPotentialIssues.push("Resume is too short for effective ATS scanning");
  }
  
  if (!hasEducation) {
    atsPotentialIssues.push("Education section may be missing");
  }
  
  if (!hasExperience) {
    atsPotentialIssues.push("Work experience section may be missing");
  }
  
  if (!hasContactInfo) {
    atsPotentialIssues.push("Contact information may be missing or not clearly formatted");
  }
  
  // Common formatting issues that cause ATS problems
  const potentialFormattingIssues = [];
  
  if (text.includes("•") || text.includes("►") || text.includes("→") || text.includes("✓")) {
    potentialFormattingIssues.push("Special characters like bullets may cause parsing issues");
  }
  
  if (text.includes("|") || text.includes("*")) {
    potentialFormattingIssues.push("Divider characters may cause formatting issues");
  }
  
  // Calculate overall scores
  const keywordsScore = Math.round((hasEducation ? 1 : 0) * 0.2 * 100 + 
                               (hasExperience ? 1 : 0) * 0.3 * 100 + 
                               (hasSkills ? 1 : 0) * 0.3 * 100 + 
                               (hasAchievements ? 1 : 0) * 0.2 * 100);
  
  const atsCompatibilityScore = Math.max(40, 100 - (atsPotentialIssues.length * 15) - (potentialFormattingIssues.length * 10));
  
  // Calculate relevance score
  const relevanceScore = Math.round((experienceScore * 0.4) + 
                                (educationScore * 0.2) + 
                                (skillsScore * 0.3) + 
                                (quantifiableScore * 0.1));
  
  // Calculate overall score
  const overallScore = Math.round((readabilityScore * 0.2) + 
                              (relevanceScore * 0.3) + 
                              (keywordsScore * 0.2) + 
                              (atsCompatibilityScore * 0.2) + 
                              (industryFitScore * 0.1));
  
  // Create strengths based on actual resume content
  const strengths = [];
  if (hasEducation) {
    strengths.push({
      id: "strength-1",
      text: "Strong educational background",
      impact: "This establishes your academic qualifications for the role."
    });
  }
  
  if (hasExperience) {
    strengths.push({
      id: "strength-2",
      text: "Clear professional experience",
      impact: "This demonstrates your relevant work history to employers."
    });
  }
  
  if (hasSkills) {
    strengths.push({
      id: "strength-3",
      text: "Well-defined skill set",
      impact: "This highlights your capabilities that match job requirements."
    });
  }
  
  if (hasAchievements) {
    strengths.push({
      id: "strength-4",
      text: "Achievement-focused content",
      impact: "This shows your ability to deliver results, which employers value highly."
    });
  }
  
  if (hasQuantifiableResults) {
    strengths.push({
      id: "strength-5",
      text: "Quantified accomplishments",
      impact: "This provides concrete evidence of your contributions and impact."
    });
  }
  
  if (hasContactInfo) {
    strengths.push({
      id: "strength-6",
      text: "Clear contact information",
      impact: "This makes it easy for employers to reach out to you."
    });
  }
  
  // Create weaknesses based on actual resume content
  const weaknesses = [];
  if (!hasEducation) {
    weaknesses.push({
      id: "weakness-1",
      text: "Missing or unclear education section",
      suggestion: "Add a dedicated education section with your degrees, institutions, and graduation dates."
    });
  }
  
  if (!hasExperience) {
    weaknesses.push({
      id: "weakness-2",
      text: "Work experience not clearly defined",
      suggestion: "Structure your work experience with company names, job titles, dates, and bullet points for responsibilities."
    });
  }
  
  if (!hasSkills) {
    weaknesses.push({
      id: "weakness-3",
      text: "Skills section could be improved",
      suggestion: "Add a dedicated skills section with relevant technical and soft skills for your target role."
    });
  }
  
  if (!hasAchievements) {
    weaknesses.push({
      id: "weakness-4",
      text: "Lacks achievement-focused content",
      suggestion: "Reframe job duties as accomplishments by describing problems solved and results achieved."
    });
  }
  
  if (!hasQuantifiableResults) {
    weaknesses.push({
      id: "weakness-5",
      text: "Achievements not quantified",
      suggestion: "Add numbers, percentages, and metrics to demonstrate the scale and impact of your work."
    });
  }
  
  if (wordCount > 700) {
    weaknesses.push({
      id: "weakness-6",
      text: "Resume may be too verbose",
      suggestion: "Consider condensing content to make it more focused and scannable."
    });
  } else if (wordCount < 300) {
    weaknesses.push({
      id: "weakness-7",
      text: "Resume appears too short",
      suggestion: "Add more detail about your experience, skills, and achievements."
    });
  }
  
  // Generate suggestions based on the analysis
  const suggestions = [];
  let suggestionCounter = 1;
  
  if (!hasAchievements || !hasQuantifiableResults) {
    suggestions.push({
      id: `suggestion-${suggestionCounter++}`,
      title: "Add more measurable achievements",
      description: "Focus on quantifiable results instead of just listing job responsibilities.",
      examples: [
        "Increased sales by 25% in the first quarter",
        "Reduced operational costs by $50,000 annually",
        "Managed a team of 12 developers across 3 projects"
      ],
      priority: "high" as "high" | "medium" | "low"
    });
  }
  
  if (industryFitScore < 70) {
    suggestions.push({
      id: `suggestion-${suggestionCounter++}`,
      title: "Incorporate more industry-specific keywords",
      description: "Add relevant terminology and skills for your target industry.",
      examples: [
        "Use technical terms specific to your field",
        "Include industry certifications and specialized training",
        "Mention industry-standard tools and methodologies"
      ],
      priority: "high" as "high" | "medium" | "low"
    });
  }
  
  if (readabilityScore < 70) {
    suggestions.push({
      id: `suggestion-${suggestionCounter++}`,
      title: "Improve the formatting for better readability",
      description: "Make your resume easier to scan quickly by improving its structure and layout.",
      examples: [
        "Use clear section headings with consistent formatting",
        "Ensure proper alignment and spacing throughout",
        "Employ bullet points for better readability"
      ],
      priority: "medium" as "high" | "medium" | "low"
    });
  }
  
  if (atsCompatibilityScore < 70) {
    suggestions.push({
      id: `suggestion-${suggestionCounter++}`,
      title: "Optimize for ATS systems",
      description: "Ensure your resume can be properly parsed by Applicant Tracking Systems.",
      examples: [
        "Use standard section headings (Experience, Education, Skills)",
        "Avoid tables, text boxes, headers, and footers",
        "Match keywords from job descriptions"
      ],
      priority: "high" as "high" | "medium" | "low"
    });
  }
  
  suggestions.push({
    id: `suggestion-${suggestionCounter++}`,
    title: "Tailor your resume for specific job targets",
    description: "Customize your content for each application to show you're a perfect fit.",
    examples: [
      "Emphasize relevant experience for each specific role",
      "Adjust skills section to highlight job requirements",
      "Mirror language from the job description"
    ],
    priority: "medium" as "high" | "medium" | "low"
  });
  
  // Analyze missing keywords based on industry
  const missingKeywords = [];
  const overusedTerms = [];
  
  // Find potentially overused generic terms
  const genericTerms = ['team player', 'hard worker', 'detail-oriented', 'self-starter', 'motivated', 'passionate'];
  genericTerms.forEach(term => {
    const regex = new RegExp(term, 'gi');
    const matches = text.match(regex);
    if (matches && matches.length > 2) {
      overusedTerms.push(term);
    }
  });
  
  // Find missing industry keywords
  if (industry && industryKeywords.length > 0) {
    missingKeywords.push(...industryKeywords.filter(keyword => 
      !resumeContent.includes(keyword.toLowerCase())
    ).slice(0, 5)); // Just show top 5 missing keywords
  }
  
  // Generate industry analysis
  const selectedIndustry = industry || "general";
  
  // Identify skills mentioned in the resume
  const mentionedSkills: string[] = [];
  
  if (industry && industryKeywords.length > 0) {
    industryKeywords.forEach(keyword => {
      if (resumeContent.includes(keyword.toLowerCase())) {
        mentionedSkills.push(keyword);
      }
    });
  }
  
  // Generate industry analysis
  const industryAnalysis = {
    industry: selectedIndustry,
    relevantSkills: mentionedSkills.slice(0, 5),
    missingSkills: missingKeywords.slice(0, 5),
    industryTrends: getIndustryTrends(selectedIndustry)
  };
  
  // Generate ATS analysis
  const atsAnalysis = {
    isParseable: atsCompatibilityScore > 60,
    missingKeywords: missingKeywords.slice(0, 5),
    formatIssues: potentialFormattingIssues.concat(atsPotentialIssues).slice(0, 3),
    overallCompatibility: atsCompatibilityScore > 75 ? "high" : atsCompatibilityScore > 60 ? "medium" : "low" as "high" | "medium" | "low"
  };
  
  // Generate keyword suggestions
  const keywordSuggestions = [
    {
      category: "Technical Skills",
      missing: missingKeywords.filter(keyword => isSkill(keyword)).slice(0, 5),
      overused: overusedTerms.filter(term => term.includes("skill") || term.includes("proficient")).slice(0, 3)
    },
    {
      category: "Soft Skills",
      missing: ["Problem Solving", "Critical Thinking", "Time Management"].filter(skill => !resumeContent.includes(skill.toLowerCase())),
      overused: overusedTerms.filter(term => !term.includes("skill") && !term.includes("proficient")).slice(0, 3)
    },
    {
      category: "Industry Terms",
      missing: missingKeywords.filter(keyword => !isSkill(keyword)).slice(0, 5),
      overused: []
    }
  ];
  
  // Ensure we have valid strengths and weaknesses
  const validStrengths = strengths.length > 0 ? strengths : [
    {
      id: "strength-default",
      text: "Resume content detected",
      impact: "You've provided content that can be improved with our suggestions."
    }
  ];
  
  const validWeaknesses = weaknesses.length > 0 ? weaknesses : [
    {
      id: "weakness-default",
      text: "Resume needs more specific content",
      suggestion: "Add more detailed information about your experience, skills, and achievements."
    }
  ];
  
  // Return the structured analysis data
  return {
    overallScore,
    readabilityScore,
    relevanceScore,
    keywordsScore,
    atsCompatibilityScore,
    industryFitScore,
    strengths: validStrengths,
    weaknesses: validWeaknesses,
    suggestions,
    keywordSuggestions,
    industryAnalysis,
    atsAnalysis
  };
};

// Helper function to determine if a keyword is a skill
function isSkill(keyword: string): boolean {
  const skillKeywords = ['programming', 'development', 'design', 'management', 'analysis', 'skill', 'proficient', 'certified'];
  return skillKeywords.some(skill => keyword.toLowerCase().includes(skill));
}

// Helper function to get industry trends
function getIndustryTrends(industry: string): string[] {
  switch(industry) {
    case 'technology':
      return [
        "Increasing demand for AI and machine learning expertise",
        "Growth in cloud computing and serverless architectures",
        "Rising importance of cybersecurity knowledge",
        "Shift towards full-stack development skills"
      ];
    case 'healthcare':
      return [
        "Growing adoption of telehealth technologies",
        "Increased focus on data security and HIPAA compliance",
        "Rising demand for healthcare informatics",
        "Expansion of patient-centered care models"
      ];
    case 'finance':
      return [
        "Expansion of fintech and digital banking",
        "Growing importance of data analysis skills",
        "Increased regulatory compliance requirements",
        "Rising demand for blockchain and cryptocurrency knowledge"
      ];
    case 'marketing':
      return [
        "Growing focus on data-driven marketing strategies",
        "Increased importance of social media expertise",
        "Rising demand for content marketing skills",
        "Expansion of marketing automation technologies"
      ];
    case 'education':
      return [
        "Increasing adoption of educational technology",
        "Growth in online and hybrid learning models",
        "Rising importance of personalized learning approaches",
        "Expansion of competency-based education"
      ];
    default:
      return [
        "Increasing importance of digital literacy across all roles",
        "Growing demand for adaptability and continuous learning",
        "Rising value of communication and collaboration skills",
        "Expansion of remote and hybrid work models"
      ];
  }
}
