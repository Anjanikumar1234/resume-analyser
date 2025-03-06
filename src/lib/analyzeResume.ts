
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
  
  // Extract text contents and clean it up
  let resumeContent = text.toLowerCase();
  // Remove non-printable characters that might appear in PDF/DOCX extraction
  resumeContent = resumeContent.replace(/[\x00-\x1F\x7F-\x9F]/g, " ");
  
  // 1. Check for education keywords - advanced detection
  const educationTerms = [
    'degree', 'university', 'college', 'bachelor', 'master', 'phd', 'diploma', 'graduate', 'certification', 'certificate',
    'b.s.', 'b.a.', 'm.s.', 'm.a.', 'ph.d', 'mba', 'major', 'minor', 'gpa', 'cum laude', 'magna cum laude', 'summa cum laude'
  ];
  const educationMatches = educationTerms.filter(term => resumeContent.includes(term));
  const hasEducation = educationMatches.length > 0;
  // Score based on how many education terms found (more terms = better detail)
  const educationScore = Math.min(100, 40 + (educationMatches.length * 10));
  
  // 2. Check for experience keywords - advanced detection
  const experienceTerms = [
    'experience', 'work', 'job', 'position', 'role', 'company', 'employer', 'client',
    'responsible for', 'lead', 'manage', 'develop', 'create', 'implement', 'coordinator', 'specialist',
    'analyst', 'assistant', 'director', 'supervisor', 'manager', 'head', 'chief', 'senior', 'junior',
    'intern', 'consultant', 'contractor', 'freelance'
  ];
  const experienceMatches = experienceTerms.filter(term => resumeContent.includes(term));
  const hasExperience = experienceMatches.length > 0;
  // Score based on how many experience terms found
  const experienceScore = Math.min(100, 40 + (experienceMatches.length * 5));
  
  // 3. Check for skills
  const skillsTerms = [
    'skill', 'proficient', 'knowledge', 'expertise', 'competent', 'capable', 'familiar', 'advanced', 
    'programming', 'language', 'software', 'tool', 'framework', 'platform', 'system', 'methodology',
    'certified', 'trained', 'experienced in', 'proficiency', 'fluent', 'excel at'
  ];
  const skillMatches = skillsTerms.filter(term => resumeContent.includes(term));
  const hasSkills = skillMatches.length > 0;
  // Score based on how many skill terms found
  const skillsScore = Math.min(100, 50 + (skillMatches.length * 8));
  
  // 4. Check for achievements with quantifiable results
  const achievementTerms = [
    'achieved', 'led', 'increased', 'improved', 'reduced', 'created', 'developed', 'managed', 'organized',
    'generated', 'delivered', 'produced', 'launched', 'implemented', 'established', 'streamlined', 'optimized'
  ];
  const quantifiableTerms = [
    '%', 'percent', 'increased by', 'reduced by', 'million', 'thousand', 'grew', 'decreased', 'saved',
    'revenue', 'profit', 'cost', 'budget', 'roi', 'kpi', 'metric', 'target', 'goal', 'rate', 'average',
    '$', '€', '£', '¥', 'dollar', 'euro'
  ];
  
  const achievementMatches = achievementTerms.filter(term => resumeContent.includes(term));
  const quantifiableMatches = quantifiableTerms.filter(term => resumeContent.includes(term));
  
  const hasAchievements = achievementMatches.length > 0;
  const hasQuantifiableResults = quantifiableMatches.length > 0;
  
  // Better score if both achievement words and quantifiable results are present
  const achievementsScore = Math.min(100, 
    40 + (achievementMatches.length * 5) + (quantifiableMatches.length * 10));
  
  // 5. Check for contact information - advanced detection with regex
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const phoneRegex = /(\+\d{1,3}[\s.-])?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g;
  const linkedinRegex = /linkedin\.com\/in\/[a-zA-Z0-9_-]+/g;
  
  const hasEmail = emailRegex.test(resumeContent);
  const hasPhone = phoneRegex.test(resumeContent);
  const hasLinkedin = linkedinRegex.test(resumeContent);
  
  // Calculate contact score based on which contact elements are present
  const contactScore = Math.min(100, 
    (hasEmail ? 40 : 0) + 
    (hasPhone ? 30 : 0) + 
    (hasLinkedin ? 30 : 0));
  
  // 6. Analyze readability
  // Split text into words, sentences, and paragraphs
  const words = text.match(/\b\w+\b/g) || [];
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const paragraphs = text.split(/\n\s*\n/).filter(Boolean);
  
  const wordCount = words.length;
  const sentenceCount = sentences.length;
  const avgWordLength = words.join('').length / wordCount;
  const wordsPerSentence = wordCount / Math.max(1, sentenceCount);
  const paragraphCount = paragraphs.length;
  
  // Flesch-Kincaid inspired formula: more paragraphs and reasonable sentence length = better
  // Ideal readability: 15-20 words per sentence, multiple paragraphs, avg word length 4-6 characters
  const readabilityScore = Math.min(100, Math.max(40, 
    80 - Math.abs(wordsPerSentence - 17) * 2 - 
    Math.abs(avgWordLength - 5) * 3 +
    Math.min(20, paragraphCount * 2)));
  
  // 7. Check for industry-specific keywords based on selected industry
  const industryKeywords: Record<string, string[]> = {
    technology: [
      'software', 'development', 'programming', 'code', 'javascript', 'python', 'java', 'c++', 'react', 
      'angular', 'vue', 'node', 'web', 'app', 'mobile', 'cloud', 'aws', 'azure', 'database', 'sql', 
      'nosql', 'api', 'rest', 'graphql', 'git', 'agile', 'scrum', 'devops', 'ci/cd', 'cybersecurity',
      'machine learning', 'ai', 'data science', 'blockchain', 'frontend', 'backend', 'fullstack'
    ],
    healthcare: [
      'patient', 'care', 'medical', 'clinical', 'health', 'hospital', 'doctor', 'nurse', 'therapy', 
      'treatment', 'diagnosis', 'pharmaceutical', 'medicine', 'healthcare', 'ehr', 'emr', 'hipaa',
      'biology', 'anatomy', 'physiology', 'radiology', 'surgery', 'emergency', 'pharmacy', 'laboratory',
      'diagnostic', 'therapeutic', 'rehabilitation', 'clinical trials', 'medical record'
    ],
    finance: [
      'financial', 'accounting', 'audit', 'tax', 'investment', 'banking', 'loan', 'credit', 'mortgage', 
      'finance', 'portfolio', 'budget', 'revenue', 'profit', 'asset', 'liability', 'capital', 'equity', 
      'stock', 'bond', 'security', 'risk', 'compliance', 'regulatory', 'fintech', 'analysis', 'forecast',
      'valuation', 'merger', 'acquisition', 'hedge fund', 'private equity', 'trading', 'wealth management'
    ],
    marketing: [
      'marketing', 'brand', 'advertising', 'campaign', 'social media', 'digital', 'seo', 'ppc', 'content', 
      'strategy', 'analytics', 'target', 'market', 'audience', 'consumer', 'customer', 'conversion', 
      'engagement', 'roi', 'ctr', 'cpa', 'cpc', 'funnel', 'lead generation', 'email marketing', 'crm',
      'affiliate', 'influencer', 'viral', 'growth hacking', 'marketing automation', 'a/b testing'
    ],
    education: [
      'education', 'teaching', 'learning', 'student', 'curriculum', 'instruction', 'classroom', 'school', 
      'college', 'university', 'course', 'professor', 'teacher', 'faculty', 'academic', 'assessment', 
      'pedagogy', 'e-learning', 'lesson plan', 'educational technology', 'distance learning', 'tutoring',
      'educational psychology', 'special education', 'higher education', 'k-12', 'esl', 'stem'
    ],
    general: [
      'professional', 'experience', 'skill', 'qualified', 'knowledge', 'leadership', 'management', 
      'communication', 'teamwork', 'project', 'problem-solving', 'detail-oriented', 'analytical',
      'strategic', 'planning', 'organization', 'time management', 'adaptability', 'flexibility',
      'creative', 'innovative', 'resource', 'efficient', 'productive', 'proactive'
    ]
  };
  
  let selectedIndustryKeywords = industryKeywords.general;
  let industryFitScore = 50;
  
  if (industry && industryKeywords[industry as keyof typeof industryKeywords]) {
    selectedIndustryKeywords = industryKeywords[industry as keyof typeof industryKeywords];
    
    // Calculate how many of these keywords are present in the resume
    const presentKeywords = selectedIndustryKeywords.filter(keyword => 
      resumeContent.includes(keyword.toLowerCase())
    );
    
    industryFitScore = Math.min(100, Math.max(40, 
      Math.round((presentKeywords.length / selectedIndustryKeywords.length) * 100)
    ));
  }
  
  // 8. Check ATS compatibility
  const atsPotentialIssues = [];
  
  if (wordCount < 300) {
    atsPotentialIssues.push("Resume is too short for effective ATS scanning");
  }
  
  if (!hasEducation) {
    atsPotentialIssues.push("Education section may be missing or not clearly identified");
  }
  
  if (!hasExperience) {
    atsPotentialIssues.push("Work experience section may be missing or not clearly formatted");
  }
  
  if (contactScore < 70) {
    atsPotentialIssues.push("Contact information may be missing or not clearly formatted");
  }
  
  // Common formatting issues that cause ATS problems
  const potentialFormattingIssues = [];
  
  // Check for potentially problematic characters
  const problematicChars = ['•', '►', '→', '✓', '|', '*', '№', '©', '®', '™'];
  const foundProblematicChars = problematicChars.filter(char => text.includes(char));
  
  if (foundProblematicChars.length > 0) {
    potentialFormattingIssues.push(`Special characters like ${foundProblematicChars.join(', ')} may cause ATS parsing issues`);
  }
  
  // Check for potential tables (sequence of spaces/tabs)
  if (/(\s{3,}|\t{2,})/.test(text)) {
    potentialFormattingIssues.push("Text alignment using spaces or tabs may be interpreted as tables by ATS systems");
  }
  
  // Check for potential headers/footers
  const lines = text.split('\n');
  if (lines.length > 5) {
    const firstLines = lines.slice(0, 3).join(' ').toLowerCase();
    const lastLines = lines.slice(-3).join(' ').toLowerCase();
    
    if (firstLines.includes('page') || lastLines.includes('page')) {
      potentialFormattingIssues.push("Headers or footers with page numbers detected which can confuse ATS systems");
    }
  }
  
  // Calculate overall keywords score - weighting more important elements higher
  const keywordsScore = Math.round(
    (educationScore * 0.15) + 
    (experienceScore * 0.35) + 
    (skillsScore * 0.3) + 
    (achievementsScore * 0.2)
  );
  
  // Calculate ATS compatibility score based on issues found
  const atsCompatibilityScore = Math.max(40, 100 - 
    (atsPotentialIssues.length * 10) - 
    (potentialFormattingIssues.length * 8)
  );
  
  // Calculate relevance score based on presence of important resume elements
  const relevanceScore = Math.round(
    (experienceScore * 0.4) + 
    (educationScore * 0.15) + 
    (skillsScore * 0.25) + 
    (achievementsScore * 0.2)
  );
  
  // Calculate overall score - weighted average of all component scores
  const overallScore = Math.round(
    (readabilityScore * 0.15) + 
    (relevanceScore * 0.25) + 
    (keywordsScore * 0.2) + 
    (atsCompatibilityScore * 0.25) + 
    (industryFitScore * 0.15)
  );
  
  // Create strengths based on actual resume content
  const strengths = [];
  let strengthId = 1;
  
  if (hasEducation) {
    strengths.push({
      id: `strength-${strengthId++}`,
      text: "Strong educational background",
      impact: "This establishes your academic qualifications for the role."
    });
  }
  
  if (hasExperience) {
    strengths.push({
      id: `strength-${strengthId++}`,
      text: "Clear professional experience",
      impact: "This demonstrates your relevant work history to employers."
    });
  }
  
  if (hasSkills) {
    strengths.push({
      id: `strength-${strengthId++}`,
      text: "Well-defined skill set",
      impact: "This highlights your capabilities that match job requirements."
    });
  }
  
  if (hasAchievements) {
    strengths.push({
      id: `strength-${strengthId++}`,
      text: "Achievement-focused content",
      impact: "This shows your ability to deliver results, which employers value highly."
    });
  }
  
  if (hasQuantifiableResults) {
    strengths.push({
      id: `strength-${strengthId++}`,
      text: "Quantified accomplishments",
      impact: "This provides concrete evidence of your contributions and impact."
    });
  }
  
  if (contactScore > 70) {
    strengths.push({
      id: `strength-${strengthId++}`,
      text: "Clear contact information",
      impact: "This makes it easy for employers to reach out to you."
    });
  }
  
  if (readabilityScore > 70) {
    strengths.push({
      id: `strength-${strengthId++}`,
      text: "Good readability and structure",
      impact: "This helps hiring managers quickly scan and understand your resume."
    });
  }
  
  // Create weaknesses based on actual resume content
  const weaknesses = [];
  let weaknessId = 1;
  
  if (!hasEducation) {
    weaknesses.push({
      id: `weakness-${weaknessId++}`,
      text: "Missing or unclear education section",
      suggestion: "Add a dedicated education section with your degrees, institutions, and graduation dates."
    });
  }
  
  if (!hasExperience) {
    weaknesses.push({
      id: `weakness-${weaknessId++}`,
      text: "Work experience not clearly defined",
      suggestion: "Structure your work experience with company names, job titles, dates, and bullet points for responsibilities."
    });
  }
  
  if (!hasSkills) {
    weaknesses.push({
      id: `weakness-${weaknessId++}`,
      text: "Skills section could be improved",
      suggestion: "Add a dedicated skills section with relevant technical and soft skills for your target role."
    });
  }
  
  if (!hasAchievements) {
    weaknesses.push({
      id: `weakness-${weaknessId++}`,
      text: "Lacks achievement-focused content",
      suggestion: "Reframe job duties as accomplishments by describing problems solved and results achieved."
    });
  }
  
  if (!hasQuantifiableResults) {
    weaknesses.push({
      id: `weakness-${weaknessId++}`,
      text: "Achievements not quantified",
      suggestion: "Add numbers, percentages, and metrics to demonstrate the scale and impact of your work."
    });
  }
  
  if (wordCount > 700) {
    weaknesses.push({
      id: `weakness-${weaknessId++}`,
      text: "Resume may be too verbose",
      suggestion: "Consider condensing content to make it more focused and scannable."
    });
  } else if (wordCount < 300) {
    weaknesses.push({
      id: `weakness-${weaknessId++}`,
      text: "Resume appears too short",
      suggestion: "Add more detail about your experience, skills, and achievements."
    });
  }
  
  if (readabilityScore < 70) {
    weaknesses.push({
      id: `weakness-${weaknessId++}`,
      text: "Readability could be improved",
      suggestion: "Use shorter sentences, bullet points, and clear section headings to improve scannability."
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
  
  // Generate keyword suggestions
  // Find missing keywords based on industry
  const missingIndustryKeywords = selectedIndustryKeywords.filter(keyword => 
    !resumeContent.includes(keyword.toLowerCase())
  ).slice(0, 5);
  
  // Find potentially overused generic terms
  const genericTerms = ['team player', 'hard worker', 'detail-oriented', 'self-starter', 'motivated', 'passionate'];
  const overusedTerms = genericTerms.filter(term => {
    const regex = new RegExp(term, 'gi');
    const matches = text.match(regex);
    return matches && matches.length > 2;
  });
  
  // Generate keyword suggestions in categories
  const keywordSuggestions = [
    {
      category: "Technical Skills",
      missing: missingIndustryKeywords.filter(keyword => isSkill(keyword)).slice(0, 5),
      overused: overusedTerms.filter(term => term.includes("skill") || term.includes("proficient")).slice(0, 3)
    },
    {
      category: "Soft Skills",
      missing: ["Problem Solving", "Critical Thinking", "Time Management"].filter(skill => !resumeContent.includes(skill.toLowerCase())),
      overused: overusedTerms.filter(term => !term.includes("skill") && !term.includes("proficient")).slice(0, 3)
    },
    {
      category: "Industry Terms",
      missing: missingIndustryKeywords.filter(keyword => !isSkill(keyword)).slice(0, 5),
      overused: []
    }
  ];
  
  // Generate industry analysis
  const selectedIndustryName = industry || "general";
  
  // Build industry analysis
  const industryAnalysis = {
    industry: selectedIndustryName,
    relevantSkills: selectedIndustryKeywords.filter(keyword => 
      resumeContent.includes(keyword.toLowerCase())
    ).slice(0, 5),
    missingSkills: missingIndustryKeywords.slice(0, 5),
    industryTrends: getIndustryTrends(selectedIndustryName)
  };
  
  // Generate ATS analysis
  const atsAnalysis = {
    isParseable: atsCompatibilityScore > 60,
    missingKeywords: missingIndustryKeywords.slice(0, 5),
    formatIssues: [...potentialFormattingIssues, ...atsPotentialIssues].slice(0, 3),
    overallCompatibility: atsCompatibilityScore > 75 ? "high" : atsCompatibilityScore > 60 ? "medium" : "low" as "high" | "medium" | "low"
  };
  
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
  const skillKeywords = ['programming', 'development', 'design', 'management', 'analysis', 'skill', 'proficient', 'certified', 'tool', 'software', 'platform', 'language', 'framework'];
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

// New helper function to improve resume sentences
export const improveSentence = async (sentence: string, industry?: string): Promise<string> => {
  if (!sentence || sentence.trim().length === 0) {
    return "Please provide a valid sentence to improve.";
  }

  try {
    // For demonstration, generate a more improved version of the sentence
    // In a real implementation, you would use an actual AI model API call
    
    // Sample improvements based on common resume issues
    const wordCount = sentence.split(/\s+/).length;
    let improved = sentence;
    
    // Replace passive voice with active voice
    improved = improved.replace(/was (responsible for|tasked with)/gi, "managed");
    improved = improved.replace(/was (involved in|part of)/gi, "contributed to");
    
    // Add action verbs at the beginning if none present
    const actionVerbs = ["Spearheaded", "Implemented", "Delivered", "Orchestrated", "Developed", "Managed", "Achieved"];
    const startsWithActionVerb = /^(Led|Managed|Created|Developed|Implemented|Achieved|Increased|Reduced|Improved)/i.test(improved);
    
    if (!startsWithActionVerb) {
      // Choose a contextually appropriate action verb
      let actionVerb = "Led";
      
      if (improved.toLowerCase().includes("develop") || improved.toLowerCase().includes("creat")) {
        actionVerb = "Developed";
      } else if (improved.toLowerCase().includes("manage") || improved.toLowerCase().includes("lead")) {
        actionVerb = "Managed";
      } else if (improved.toLowerCase().includes("improv") || improved.toLowerCase().includes("enhanc")) {
        actionVerb = "Improved";
      } else {
        actionVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
      }
      
      improved = `${actionVerb} ${improved.charAt(0).toLowerCase() + improved.slice(1)}`;
    }
    
    // Add quantifiable results if none present
    const hasNumbers = /\d+/.test(improved);
    const hasPercentage = /%/.test(improved);
    
    if (!hasNumbers && !hasPercentage && wordCount > 5) {
      // Add a random quantifiable result
      const quantifiers = [
        "resulting in 20% efficiency improvement",
        "increasing team productivity by 25%",
        "reducing costs by 15%",
        "saving over 10 hours per week",
        "achieving 30% faster delivery"
      ];
      
      improved += `, ${quantifiers[Math.floor(Math.random() * quantifiers.length)]}`;
    }
    
    // Add industry-specific terminology if industry is provided
    if (industry) {
      const industryTerms: Record<string, string[]> = {
        technology: ["agile methodology", "DevOps practices", "cloud infrastructure", "cross-functional teams"],
        healthcare: ["patient outcomes", "care protocols", "clinical workflows", "healthcare regulations"],
        finance: ["financial analytics", "regulatory compliance", "risk management", "investment strategies"],
        marketing: ["conversion rates", "customer acquisition", "brand positioning", "market segmentation"],
        education: ["learning outcomes", "curriculum development", "student engagement", "educational assessments"]
      };
      
      const terms = industryTerms[industry as keyof typeof industryTerms] || [];
      
      if (terms.length > 0 && !terms.some(term => improved.toLowerCase().includes(term))) {
        const selectedTerm = terms[Math.floor(Math.random() * terms.length)];
        improved += ` utilizing ${selectedTerm}`;
      }
    }
    
    return improved;
  } catch (error) {
    console.error("Error improving sentence:", error);
    return sentence; // Return original sentence if there's an error
  }
};
