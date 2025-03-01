
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AnalysisData {
  overallScore: number;
  readabilityScore: number;
  relevanceScore: number;
  keywordsScore: number;
  strengths: {
    id: string;
    text: string;
    impact: string;
  }[];
  weaknesses: {
    id: string;
    text: string;
    suggestion: string;
  }[];
  suggestions: {
    id: string;
    title: string;
    description: string;
    examples: string[];
    priority: "high" | "medium" | "low";
  }[];
  categoryScores: Record<string, number>;
  jobRecommendations: string[];
}

// Define category keywords
const categoryKeywords: Record<string, string[]> = {
  development: ['software', 'developer', 'engineer', 'programming', 'code', 'javascript', 'python', 'java', 'react', 'angular', 'node', 'database', 'api', 'frontend', 'backend', 'full stack', 'devops', 'testing', 'debugging', 'algorithm', 'data structures'],
  design: ['design', 'ui', 'ux', 'graphic', 'visual', 'creative', 'adobe', 'photoshop', 'illustrator', 'figma', 'wireframe', 'prototype', 'user interface', 'user experience', 'branding', 'layout', 'typography', 'color theory', 'web design', 'mobile design'],
  data: ['data', 'analyst', 'scientist', 'machine learning', 'ai', 'statistics', 'excel', 'sql', 'python', 'r', 'tableau', 'powerbi', 'database', 'hadoop', 'spark', 'big data', 'data mining', 'data visualization', 'data analysis'],
  management: ['management', 'project', 'product', 'team', 'leadership', 'strategy', 'planning', 'budget', 'operations', 'process', 'scrum', 'agile', 'communication', 'problem solving', 'decision making', 'organization', 'time management', 'risk management'],
  marketing: ['marketing', 'digital', 'social media', 'content', 'seo', 'advertising', 'brand', 'campaign', 'analytics', 'google analytics', 'facebook', 'instagram', 'twitter', 'linkedin', 'email marketing', 'market research', 'public relations', 'copywriting'],
  finance: ['finance', 'accounting', 'financial', 'budgeting', 'analysis', 'reporting', 'audit', 'tax', 'investment', 'banking', 'economics', 'forecasting', 'compliance', 'risk management', 'financial planning', 'accounts payable', 'accounts receivable'],
  healthcare: ['healthcare', 'medical', 'clinical', 'patient', 'nursing', 'therapy', 'diagnosis', 'treatment', 'hospital', 'pharmacy', 'research', 'health', 'wellness', 'anatomy', 'physiology', 'disease', 'prevention', 'rehabilitation'],
  education: ['education', 'teaching', 'teacher', 'instructor', 'curriculum', 'student', 'learning', 'classroom', 'training', 'development', 'assessment', 'pedagogy', 'literacy', 'numeracy', 'educational technology', 'special education', 'higher education'],
  customerService: ['customer service', 'support', 'client', 'help desk', 'communication', 'problem solving', 'empathy', 'patience', 'active listening', 'conflict resolution', 'customer satisfaction', 'customer retention', 'crm', 'salesforce', 'zendesk', 'customer experience'],
  administrative: ['administrative', 'office', 'clerical', 'support', 'organization', 'communication', 'scheduling', 'record keeping', 'data entry', 'customer service', 'microsoft office', 'typing', 'filing', 'receptionist', 'executive assistant', 'office management']
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

  let recommendations: string[] = [];
  categories.forEach(category => {
    if (score >= 7) {
      recommendations = recommendations.concat(jobRecommendations[category]?.senior || []);
    } else if (score >= 4) {
      recommendations = recommendations.concat(jobRecommendations[category]?.mid || []);
    } else {
      recommendations = recommendations.concat(jobRecommendations[category]?.entry || []);
    }
  });
  return recommendations;
};

export const analyzeResume = async (resumeText: string): Promise<AnalysisData> => {
  try {
    const prompt = `
      Analyze the following resume and provide an overall score (0-10), top 3 strengths, top 3 weaknesses, and 3 suggestions for improvement.
      Also, provide a score (0-10) for each of the following categories: Development, Design, Data, Management, Marketing, Finance, Healthcare, Education, Customer Service, and Administrative.
      Finally, based on the category scores, provide 3-5 job recommendations.
      
      Resume:
      ${resumeText}
      
      Response format:
      {
        "overallScore": number,
        "strengths": string[],
        "weaknesses": string[],
        "suggestions": string[],
        "categoryScores": {
          "Development": number,
          "Design": number,
          "Data": number,
          "Management": number,
          "Marketing": number,
          "Finance": number,
          "Healthcare": number,
          "Education": number,
          "Customer Service": number,
          "Administrative": number
        },
        "jobRecommendations": string[]
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [{ role: "system", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message?.content;

    if (!content) {
      throw new Error("No content in OpenAI response");
    }

    const data = JSON.parse(content) as {
      overallScore: number;
      strengths: string[];
      weaknesses: string[];
      suggestions: string[];
      categoryScores: Record<string, number>;
      jobRecommendations: string[];
    };

    // Basic validation
    if (typeof data.overallScore !== 'number' ||
        !Array.isArray(data.strengths) || data.strengths.length > 3 ||
        !Array.isArray(data.weaknesses) || data.weaknesses.length > 3 ||
        !Array.isArray(data.suggestions) || data.suggestions.length > 3 ||
        typeof data.categoryScores !== 'object' || Object.keys(data.categoryScores).length !== 10) {
      throw new Error("Invalid data format from OpenAI");
    }

    // Extract categories with scores above a threshold
    const relevantCategories = Object.entries(data.categoryScores)
      .filter(([, score]) => score > 3)
      .map(([category]) => category.toLowerCase());

    // Generate job recommendations based on categories and overall score
    const jobRecommendations = getJobRecommendationsByCategory(relevantCategories, data.overallScore);

    // Calculate additional scores based on the overall score for consistency
    const readabilityScore = Math.round((data.overallScore * 10) * (0.8 + Math.random() * 0.4));
    const relevanceScore = Math.round((data.overallScore * 10) * (0.7 + Math.random() * 0.5));
    const keywordsScore = Math.round((data.overallScore * 10) * (0.75 + Math.random() * 0.45));

    // Transform strengths to expected format
    const formattedStrengths = data.strengths.map((strength, index) => ({
      id: `strength-${index + 1}`,
      text: strength,
      impact: `This strength demonstrates your professional capability and adds significant value to your resume.`
    }));

    // Transform weaknesses to expected format
    const formattedWeaknesses = data.weaknesses.map((weakness, index) => ({
      id: `weakness-${index + 1}`,
      text: weakness,
      suggestion: `Consider improving this area to enhance your overall resume effectiveness.`
    }));

    // Transform suggestions to expected format
    const formattedSuggestions = data.suggestions.map((suggestion, index) => {
      const priority = index === 0 ? "high" : index === 1 ? "medium" : "low";
      return {
        id: `suggestion-${index + 1}`,
        title: suggestion,
        description: `Implementing this change will significantly improve your resume's effectiveness.`,
        examples: [`Example implementation of this suggestion.`],
        priority
      };
    });

    return {
      overallScore: data.overallScore * 10, // Convert to 0-100 scale
      readabilityScore,
      relevanceScore,
      keywordsScore,
      strengths: formattedStrengths,
      weaknesses: formattedWeaknesses,
      suggestions: formattedSuggestions,
      categoryScores: data.categoryScores,
      jobRecommendations
    };
  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw error;
  }
};
