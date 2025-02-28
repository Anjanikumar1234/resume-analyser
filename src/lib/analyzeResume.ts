
import { Strength, Weakness } from "../components/StrengthsWeaknesses";
import { Suggestion } from "../components/Suggestions";
import { AnalysisData } from "../components/AnalysisResults";

// Helper function to generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Function to calculate a random score within a range
const calculateRandomScore = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to extract job roles from resume text
const extractJobRoles = (text: string) => {
  // Convert to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase();
  
  // Define role categories with keywords
  const roleCategories = {
    development: [
      'software', 'developer', 'engineer', 'coding', 'programming', 'javascript', 'python', 'java', 
      'c++', 'react', 'node', 'full stack', 'frontend', 'backend', 'web', 'mobile', 'app', 
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
      entry: ['Teaching Assistant', 'Tutor', 'Teacher's Aide', 'Admissions Counselor'],
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

export const analyzeResume = (resumeText: string): Promise<AnalysisData> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Calculate "scores" based on text length and random factors
      // In a real app, this would use actual AI analysis
      const textLength = resumeText.length;
      
      // Generate random scores but weight them based on text length
      // (simulate that longer resumes might have more content)
      const lengthFactor = Math.min(Math.max(textLength / 2000, 0.5), 1.2);
      
      const baseOverallScore = calculateRandomScore(50, 85);
      const baseReadabilityScore = calculateRandomScore(40, 90);
      const baseRelevanceScore = calculateRandomScore(35, 85);
      const baseKeywordsScore = calculateRandomScore(30, 80);
      
      // Apply length factor
      const overallScore = Math.min(Math.floor(baseOverallScore * lengthFactor), 100);
      const readabilityScore = Math.min(Math.floor(baseReadabilityScore * (lengthFactor * 0.9)), 100);
      const relevanceScore = Math.min(Math.floor(baseRelevanceScore * lengthFactor), 100);
      const keywordsScore = Math.min(Math.floor(baseKeywordsScore * (lengthFactor * 1.1)), 100);
      
      // Extract job role categories from resume text
      const jobCategories = extractJobRoles(resumeText);
      
      // Generate recommended jobs based on categories and score
      const recommendedJobs = getJobRecommendationsByCategory(jobCategories, overallScore);
      
      // Generate mock strengths
      const strengths: Strength[] = [
        {
          id: generateId(),
          text: "Clear professional summary",
          impact: "Immediately showcases your value proposition to employers."
        },
        {
          id: generateId(),
          text: "Quantified achievements",
          impact: "Numbers make your accomplishments more credible and impressive."
        },
        {
          id: generateId(),
          text: "Consistent formatting",
          impact: "Creates a professional appearance and improves readability."
        },
        {
          id: generateId(),
          text: "Good use of action verbs",
          impact: "Makes your experience sound more dynamic and impactful."
        }
      ];
      
      // Generate mock weaknesses
      const weaknesses: Weakness[] = [
        {
          id: generateId(),
          text: "Too much technical jargon",
          suggestion: "Balance technical terms with plain language to ensure all readers understand your value."
        },
        {
          id: generateId(),
          text: "Missing keywords from job descriptions",
          suggestion: "Add industry-specific keywords that appear in job postings to pass ATS screening."
        },
        {
          id: generateId(),
          text: "Lengthy bullet points",
          suggestion: "Keep bullets concise (1-2 lines) and focused on achievements rather than responsibilities."
        },
        {
          id: generateId(),
          text: "Generic skill descriptions",
          suggestion: "Replace generic skills with specific examples of how you've applied them."
        }
      ];
      
      // Generate mock suggestions
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
          title: "Improve readability for " + recommendedJobs[1],
          description: `Format your resume to appeal to ${recommendedJobs[1]} hiring managers with clear sections.`,
          examples: [
            "Use bullet points instead of paragraphs for experience and skills",
            "Create clear section headings with visual separation",
            "Ensure consistent spacing, font sizes, and margins throughout"
          ],
          priority: "medium"
        },
        {
          id: generateId(),
          title: `Add key skills for ${recommendedJobs[2]} roles`,
          description: `Enhance your skills section with abilities specifically desired in ${recommendedJobs[2]} positions.`,
          examples: [
            "Group skills into categories like 'Technical Skills', 'Soft Skills', and 'Industry Knowledge'",
            "Remove outdated or irrelevant skills",
            "Add proficiency levels for technical skills when appropriate"
          ],
          priority: "low"
        }
      ];
      
      // Return mock analysis results
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
