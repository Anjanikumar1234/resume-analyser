
import { Strength, Weakness } from "../components/StrengthsWeaknesses";
import { Suggestion } from "../components/Suggestions";
import { AnalysisData } from "../components/AnalysisResults";

// Helper function to generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Function to calculate a consistent score for a given text
const calculateConsistentScore = (text: string, baseMin: number, baseMax: number): number => {
  // Create a simple hash of the text to ensure consistent scoring
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  
  // Use the hash to generate a score within the range
  const range = baseMax - baseMin;
  const absHash = Math.abs(hash);
  const normalizedHash = absHash / 2147483647; // Max 32-bit integer value
  const score = Math.floor(baseMin + normalizedHash * range);
  
  return score;
};

// Function to extract job roles from resume text
const extractJobRoles = (text: string) => {
  // Convert to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase();
  
  // Define role categories with keywords
  const roleCategories = {
    development: [
      'software', 'developer', 'engineer', 'coding', 'programming', 'javascript', 'python', 'java', 
      'c\\+\\+', 'react', 'node', 'full stack', 'frontend', 'backend', 'web', 'mobile', 'app', 
      'development', 'angular', 'vue', 'typescript', 'ruby', 'php', 'golang', 'rust'
    ],
    design: [
      'design', 'designer', 'ux', 'ui', 'user experience', 'user interface', 'graphic', 
      'figma', 'sketch', 'adobe', 'photoshop', 'illustrator', 'xd', 'creative', 'art director'
    ],
    data: [
      'data', 'analyst', 'analytics', 'science', 'scientist', 'machine learning', 'ml', 'ai', 
      'artificial intelligence', 'big data', 'statistics', 'statistical', 'sql', 'database', 
      'tableau', 'power bi', 'visualization', 'python', 'r', 'pandas', 'numpy', 'tensorflow'
    ],
    management: [
      'manager', 'management', 'project', 'product', 'team lead', 'director', 'executive', 
      'agile', 'scrum', 'kanban', 'jira', 'coordinator', 'administration', 'supervisor'
    ],
    marketing: [
      'marketing', 'seo', 'content', 'social media', 'digital', 'brand', 'market research',
      'campaign', 'advertising', 'growth', 'sales', 'copywriting', 'communications', 'pr'
    ],
    finance: [
      'finance', 'financial', 'accounting', 'accountant', 'analyst', 'banking', 'investment',
      'budget', 'auditor', 'tax', 'revenue', 'bookkeeping', 'cpa', 'treasurer'
    ],
    healthcare: [
      'health', 'healthcare', 'medical', 'clinical', 'doctor', 'nurse', 'physician', 'dental',
      'therapy', 'therapist', 'pharmacist', 'patient', 'care', 'hospital', 'clinic'
    ],
    education: [
      'education', 'teacher', 'professor', 'instructor', 'tutor', 'academic', 'school',
      'teaching', 'training', 'curriculum', 'lecturer', 'faculty', 'coach', 'mentor'
    ],
    customerService: [
      'customer', 'service', 'support', 'representative', 'client', 'helpdesk', 'call center',
      'satisfaction', 'resolution', 'assistance', 'chat', 'ticket', 'inquiry'
    ],
    administrative: [
      'administrative', 'assistant', 'secretary', 'receptionist', 'office', 'clerical',
      'coordinator', 'administration', 'organizational', 'scheduling', 'filing'
    ]
  };
  
  // Count occurrences of keywords for each category
  const categoryScores: Record<string, number> = {};
  
  for (const [category, keywords] of Object.entries(roleCategories)) {
    categoryScores[category] = 0;
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        categoryScores[category] += matches.length;
      }
    });
  }
  
  // Sort categories by score
  const sortedCategories = Object.entries(categoryScores)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, score]) => score > 0)
    .slice(0, 3)
    .map(([category]) => category);
    
  return sortedCategories;
};

// Define job recommendations by category
const getJobRecommendationsByCategory = (categories: string[], score: number) => {
  const jobRecommendations: Record<string, {entry: string[], mid: string[], senior: string[]}> = {
    development: {
      entry: ['Junior Software Developer', 'Frontend Developer Intern', 'QA Engineer', 'Technical Support Specialist'],
      mid: ['Full Stack Developer', 'Mobile App Developer', 'DevOps Engineer', 'Web Developer'],
      senior: ['Senior Software Engineer', 'Technical Lead', 'Software Architect', 'CTO']
    },
    design: {
      entry: ['UI/UX Design Intern', 'Junior Graphic Designer', 'Design Assistant', 'Production Artist'],
      mid: ['UI/UX Designer', 'Visual Designer', 'Product Designer', 'Marketing Designer'],
      senior: ['Senior UX Designer', 'Creative Director', 'Design Manager', 'Art Director']
    },
    data: {
      entry: ['Junior Data Analyst', 'Data Entry Specialist', 'Research Assistant', 'BI Reporting Analyst'],
      mid: ['Data Analyst', 'Business Intelligence Analyst', 'Database Administrator', 'Data Engineer'],
      senior: ['Senior Data Scientist', 'Machine Learning Engineer', 'Data Science Manager', 'Chief Data Officer']
    },
    management: {
      entry: ['Assistant Project Manager', 'Project Coordinator', 'Team Lead', 'Supervisor'],
      mid: ['Project Manager', 'Product Manager', 'Operations Manager', 'Scrum Master'],
      senior: ['Senior Program Manager', 'Director of Operations', 'VP of Product', 'Chief Operating Officer']
    },
    marketing: {
      entry: ['Marketing Assistant', 'Social Media Coordinator', 'Content Writer', 'SEO Specialist'],
      mid: ['Digital Marketing Manager', 'Content Marketing Manager', 'Brand Manager', 'Marketing Analyst'],
      senior: ['Marketing Director', 'Chief Marketing Officer', 'Brand Strategist', 'VP of Marketing']
    },
    finance: {
      entry: ['Accounting Clerk', 'Financial Analyst Intern', 'Accounts Payable Specialist', 'Bookkeeper'],
      mid: ['Financial Analyst', 'Accountant', 'Tax Specialist', 'Finance Manager'],
      senior: ['Senior Financial Analyst', 'Controller', 'Finance Director', 'Chief Financial Officer']
    },
    healthcare: {
      entry: ['Medical Assistant', 'Nursing Assistant', 'Healthcare Technician', 'Medical Receptionist'],
      mid: ['Registered Nurse', 'Physical Therapist', 'Clinical Specialist', 'Healthcare Administrator'],
      senior: ['Chief Nursing Officer', 'Medical Director', 'Healthcare Executive', 'Clinical Manager']
    },
    education: {
      entry: ['Teaching Assistant', 'Tutor', 'Teacher\'s Aide', 'Admissions Counselor'],
      mid: ['Teacher', 'Instructor', 'Academic Advisor', 'Education Coordinator'],
      senior: ['Principal', 'Department Head', 'Education Director', 'Dean']
    },
    customerService: {
      entry: ['Customer Service Representative', 'Help Desk Support', 'Call Center Agent', 'Customer Support Specialist'],
      mid: ['Customer Experience Manager', 'Support Team Lead', 'Client Success Manager', 'Service Coordinator'],
      senior: ['Director of Customer Experience', 'Head of Support', 'Client Relations Director', 'VP of Customer Success']
    },
    administrative: {
      entry: ['Administrative Assistant', 'Office Assistant', 'Receptionist', 'Data Entry Clerk'],
      mid: ['Office Manager', 'Executive Assistant', 'Administrative Coordinator', 'Operations Specialist'],
      senior: ['Chief of Staff', 'Administrative Director', 'Executive Operations Manager', 'Facilities Director']
    }
  };
  
  let recommendedJobs: string[] = [];
  
  // Determine experience level based on overall score
  let level;
  if (score >= 80) {
    level = 'senior';
  } else if (score >= 60) {
    level = 'mid';
  } else {
    level = 'entry';
  }
  
  // Add recommendations for each identified category
  categories.forEach(category => {
    if (jobRecommendations[category]) {
      recommendedJobs = [...recommendedJobs, ...jobRecommendations[category][level]];
    }
  });
  
  // If no specific categories were identified or matched, return general recommendations
  if (recommendedJobs.length === 0) {
    return [
      'Administrative Assistant', 
      'Customer Service Representative', 
      'Sales Associate',
      'Project Coordinator',
      'Marketing Assistant'
    ];
  }
  
  // Return unique job recommendations
  return [...new Set(recommendedJobs)].slice(0, 5);
};

// Extract keywords from resume text
const extractKeywords = (text: string): string[] => {
  const commonKeywords = [
    'leadership', 'teamwork', 'communication', 'problem-solving', 'analytical', 
    'project management', 'time management', 'innovation', 'creativity', 'detail-oriented',
    'organized', 'multi-tasking', 'adaptability', 'flexibility', 'initiative',
    'research', 'planning', 'supervision', 'mentoring', 'negotiation',
    'presentation', 'conflict resolution', 'decision-making', 'critical thinking', 'strategic planning'
  ];
  
  const foundKeywords: string[] = [];
  
  commonKeywords.forEach(keyword => {
    if (text.toLowerCase().includes(keyword.toLowerCase())) {
      foundKeywords.push(keyword);
    }
  });
  
  return foundKeywords.slice(0, 8); // Return top 8 keywords
};

// Generate more specific and tailored analysis
const generateSpecificAnalysis = (text: string, categories: string[]): { strengths: Strength[], weaknesses: Weakness[] } => {
  const keywords = extractKeywords(text);
  const textLower = text.toLowerCase();
  
  // Basic text analysis
  const hasQuantifiedAchievements = /\d+%|\d+ percent|increased|decreased|improved|reduced|achieved|delivered|generated|\$\d+|\d+ dollars/i.test(text);
  const hasActionVerbs = /managed|developed|created|implemented|designed|led|coordinated|analyzed|improved|resolved/i.test(text);
  const hasProfessionalSummary = /^.{0,500}(summary|profile|objective|about me)/i.test(text);
  const hasLongBulletPoints = text.split(/\n/).some(line => line.trim().length > 100);
  const hasTechnicalJargon = /\b(api|sdk|sql|framework|architecture|infrastructure|backend|frontend|algorithm|methodology|implementation|interface|integration|deployment|optimization)\b/gi.test(text);
  
  // Generate strengths based on actual content
  const strengths: Strength[] = [];
  
  if (hasProfessionalSummary) {
    strengths.push({
      id: generateId(),
      text: "Clear professional summary",
      impact: "Immediately showcases your value proposition to employers and highlights your career focus."
    });
  }
  
  if (hasQuantifiedAchievements) {
    strengths.push({
      id: generateId(),
      text: "Quantified achievements",
      impact: "Numbers and metrics make your accomplishments more credible and demonstrate your impact."
    });
  }
  
  if (hasActionVerbs) {
    strengths.push({
      id: generateId(),
      text: "Good use of action verbs",
      impact: "Makes your experience sound more dynamic and clearly demonstrates your contributions."
    });
  }
  
  if (keywords.length >= 5) {
    strengths.push({
      id: generateId(),
      text: "Strong inclusion of relevant keywords",
      impact: `Improves visibility to ATS systems with key terms like ${keywords.slice(0, 3).join(', ')}.`
    });
  }
  
  // Generate weaknesses based on actual content
  const weaknesses: Weakness[] = [];
  
  if (hasLongBulletPoints) {
    weaknesses.push({
      id: generateId(),
      text: "Lengthy bullet points",
      suggestion: "Keep bullets concise (1-2 lines) and focused on achievements rather than responsibilities."
    });
  }
  
  if (hasTechnicalJargon && categories.some(cat => !['development', 'data', 'healthcare'].includes(cat))) {
    weaknesses.push({
      id: generateId(),
      text: "Too much technical jargon",
      suggestion: "Balance technical terms with plain language to ensure all readers understand your value."
    });
  }
  
  if (keywords.length < 5) {
    weaknesses.push({
      id: generateId(),
      text: "Missing keywords from job descriptions",
      suggestion: "Add industry-specific keywords that appear in job postings to pass ATS screening."
    });
  }
  
  if (!hasQuantifiedAchievements) {
    weaknesses.push({
      id: generateId(),
      text: "Limited quantifiable achievements",
      suggestion: "Add metrics and numbers to demonstrate the impact of your work (e.g., percentages, dollar amounts)."
    });
  }
  
  // Fill in with generic strengths/weaknesses if we don't have enough
  while (strengths.length < 4) {
    strengths.push({
      id: generateId(),
      text: "Consistent formatting",
      impact: "Creates a professional appearance and improves readability."
    });
  }
  
  while (weaknesses.length < 4) {
    weaknesses.push({
      id: generateId(),
      text: "Generic skill descriptions",
      suggestion: "Replace generic skills with specific examples of how you've applied them."
    });
  }
  
  return { strengths, weaknesses };
};

export const analyzeResume = (resumeText: string): Promise<AnalysisData> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Calculate consistent scores for the same text
      const textLength = resumeText.length;
      
      // Generate consistent scores based on the resume text
      // (hash-based to ensure the same text always gets the same score)
      const overallScore = calculateConsistentScore(resumeText, 50, 95);
      const readabilityScore = calculateConsistentScore(resumeText + "readability", 40, 90);
      const relevanceScore = calculateConsistentScore(resumeText + "relevance", 35, 95);
      const keywordsScore = calculateConsistentScore(resumeText + "keywords", 30, 90);
      
      // Extract job role categories from resume text
      const jobCategories = extractJobRoles(resumeText);
      
      // Generate recommended jobs based on categories and score
      const recommendedJobs = getJobRecommendationsByCategory(jobCategories, overallScore);
      
      // Generate strengths and weaknesses based on content
      const { strengths, weaknesses } = generateSpecificAnalysis(resumeText, jobCategories);
      
      // Generate more specific suggestions
      const suggestions: Suggestion[] = [
        {
          id: generateId(),
          title: "Tailor your resume for " + recommendedJobs[0],
          description: `Customize your resume to match the specific requirements for a ${recommendedJobs[0]} position.`,
          examples: [
            `Include relevant keywords found in ${recommendedJobs[0]} job postings`,
            "Reorder your bullet points to prioritize the most relevant experiences",
            "Adjust your professional summary to align with the role"
          ],
          priority: "high"
        },
        {
          id: generateId(),
          title: "Strengthen your achievement statements",
          description: "Focus on quantifiable achievements rather than just listing job duties.",
          examples: [
            "Change 'Responsible for customer service' to 'Increased customer satisfaction by 22% through personalized service initiatives'",
            "Add metrics like percentages, dollar amounts, or time saved wherever possible",
            "Use the CAR format: Challenge, Action, Result for each achievement"
          ],
          priority: "medium"
        },
        {
          id: generateId(),
          title: recommendedJobs[1] ? `Improve readability for ${recommendedJobs[1]} roles` : "Improve overall readability",
          description: recommendedJobs[1] ? `Format your resume to appeal to ${recommendedJobs[1]} hiring managers with clear sections.` : "Make your resume easier to scan with clear formatting and organization.",
          examples: [
            "Use bullet points instead of paragraphs for experience and skills",
            "Create clear section headings with visual separation",
            "Ensure consistent spacing, font sizes, and margins throughout"
          ],
          priority: "medium"
        },
        {
          id: generateId(),
          title: recommendedJobs[2] ? `Add key skills for ${recommendedJobs[2]} roles` : "Enhance your skills section",
          description: recommendedJobs[2] ? `Enhance your skills section with abilities specifically desired in ${recommendedJobs[2]} positions.` : "Make your skills section more comprehensive and relevant to your target roles.",
          examples: [
            "Group skills into categories like 'Technical Skills', 'Soft Skills', and 'Industry Knowledge'",
            "Remove outdated or irrelevant skills",
            "Add proficiency levels for technical skills when appropriate"
          ],
          priority: "low"
        }
      ];
      
      // Return analysis results
      resolve({
        overallScore,
        readabilityScore,
        relevanceScore,
        keywordsScore,
        strengths,
        weaknesses,
        suggestions
      });
    }, 2500); // Simulating a 2.5 second analysis
  });
};
