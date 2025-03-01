
import { OpenAI } from "openai";

// Define type for resume analysis function
export interface AnalysisData {
  overallScore: number;
  readabilityScore: number;
  relevanceScore: number;
  keywordsScore: number;
  strengths: { id: string; text: string; impact: string }[];
  weaknesses: { id: string; text: string; suggestion: string }[];
  suggestions: { id: string; title: string; description: string; examples: string[]; priority: "high" | "medium" | "low" }[];
}

// Create a mock OpenAI instance (in a real app, you would use your API key)
const openai = new OpenAI({
  apiKey: "dummy-key", // This is a placeholder, in a real app you would use a real API key
  dangerouslyAllowBrowser: true // Only for demo purposes
});

/**
 * Analyzes a resume text and returns detailed analysis data
 * In a real application, this would connect to an AI service
 */
export const analyzeResume = async (text: string): Promise<AnalysisData> => {
  console.log("Analyzing resume text...", text.substring(0, 100) + "...");
  
  // In a real app, this would use the OpenAI API
  // openai.chat.completions.create({...})
  
  // For demo purposes, we'll generate deterministic results based on the text content
  // This ensures the same resume text always gets the same scores
  
  // Simulate a processing delay to make it feel more realistic
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Calculate deterministic scores based on text content
  const getScoreFromText = (text: string, base: number): number => {
    // Use string length combined with character code sums to create a deterministic but varied score
    const textHash = text.split('').reduce((sum, char, index) => 
      sum + char.charCodeAt(0) * (index % 5 + 1), 0);
    
    // Normalize to a score between base and base+30
    return Math.min(100, Math.max(40, base + (textHash % 30)));
  };
  
  // Generate fixed scores based on resume content to ensure consistency
  const overallScore = getScoreFromText(text, 70);
  const readabilityScore = getScoreFromText(text, 65);
  const relevanceScore = getScoreFromText(text, 60);
  const keywordsScore = getScoreFromText(text, 55);
  
  // Create sample data based on text length and common resume elements
  const hasQuantifiableResults = text.match(/increased|improved|reduced|achieved|delivered|managed|led|created/gi);
  const hasEducation = text.match(/degree|university|college|bachelor|master|phd|diploma|graduate/gi);
  const hasSkills = text.match(/proficient|skill|experienced|expertise|knowledge|familiar|advanced|certified/gi);
  
  // Generate some dummy feedback based on content
  const data = {
    strengths: [
      "Clear professional experience",
      "Good use of action verbs",
      "Relevant skills highlighted",
      hasQuantifiableResults ? "Quantifiable achievements" : "Experience properly detailed",
      hasEducation ? "Strong educational background" : "Professional focus",
      text.length > 1500 ? "Comprehensive experience detailing" : "Concise presentation"
    ],
    weaknesses: [
      text.length < 800 ? "Resume appears too short" : "Some sections could be more concise",
      hasSkills ? "Skills section could be more specific" : "Technical skills not clearly highlighted",
      "Limited use of industry keywords",
      hasQuantifiableResults ? "More quantifiable achievements needed" : "Achievements not quantified",
      text.length > 2500 ? "Resume is too verbose" : "Could include more details"
    ],
    suggestions: [
      "Add more measurable achievements",
      "Incorporate more industry-specific keywords",
      "Improve the formatting for better readability",
      "Tailor your resume for specific job targets",
      "Highlight key skills more prominently",
      hasEducation ? "Place education section strategically" : "Consider adding relevant education or certifications"
    ]
  };
  
  // Ensure we have at least 3-5 of each category
  const ensureItemCount = (arr: string[], min: number, max: number) => {
    const targetLength = Math.min(Math.max(arr.length, min), max);
    return arr.slice(0, targetLength);
  };
  
  const strengths = ensureItemCount(data.strengths, 3, 5);
  const weaknesses = ensureItemCount(data.weaknesses, 3, 4);
  const suggestions = ensureItemCount(data.suggestions, 3, 5);
  
  // Transform strengths to expected format
  const formattedStrengths = strengths.map((strength, index) => ({
    id: `strength-${index + 1}`,
    text: strength,
    impact: [
      "This makes your resume stand out to recruiters.",
      "This significantly improves your chances of getting interviews.",
      "This demonstrates your professional capabilities effectively.",
      "This helps differentiate you from other candidates.",
      "This showcases your value to potential employers."
    ][index % 5]
  }));
  
  // Transform weaknesses to expected format
  const formattedWeaknesses = weaknesses.map((weakness, index) => ({
    id: `weakness-${index + 1}`,
    text: weakness,
    suggestion: [
      "Try adding more specific examples with measurable outcomes.",
      "Consider restructuring this section to highlight your achievements.",
      "Add industry-specific terminology to pass ATS scans.",
      "Provide more context about your role and contributions.",
      "Consider improving this area to enhance your overall resume effectiveness."
    ][index % 5]
  }));
  
  // Transform suggestions to expected format with proper typing
  const formattedSuggestions = suggestions.map((suggestion, index) => {
    // Explicitly type the priority as one of the allowed values
    const priority: "high" | "medium" | "low" = index === 0 ? "high" : index === 1 ? "medium" : "low";
    return {
      id: `suggestion-${index + 1}`,
      title: suggestion,
      description: [
        "Adding measurable results will significantly strengthen your resume.",
        "Using industry-specific keywords helps your resume pass ATS systems.",
        "Improved formatting makes your resume more scannable for busy recruiters.",
        "Tailoring your content shows you're a good fit for specific roles.",
        "Highlighting key skills helps employers quickly identify your qualifications."
      ][index % 5],
      examples: [
        [
          "Increased sales by 25% in the first quarter",
          "Reduced operational costs by $50,000 annually",
          "Managed a team of 12 developers across 3 projects"
        ],
        [
          "Implemented CI/CD pipeline reducing deployment time by 40%",
          "Designed REST API architecture for improved data flow",
          "Utilized React hooks for state management optimization"
        ],
        [
          "Use clear section headings with consistent formatting",
          "Ensure proper alignment and spacing throughout",
          "Employ bullet points for better readability"
        ],
        [
          "Emphasize project management skills for leadership roles",
          "Highlight customer service experience for client-facing positions",
          "Feature relevant certifications prominently for technical roles"
        ],
        [
          "Place key skills in a dedicated section at the top",
          "Bold important capabilities throughout your experience section",
          "Include skill proficiency levels where appropriate"
        ]
      ][index % 5],
      priority: priority
    };
  });
  
  // Return the formatted analysis data
  return {
    overallScore,
    readabilityScore,
    relevanceScore,
    keywordsScore,
    strengths: formattedStrengths,
    weaknesses: formattedWeaknesses,
    suggestions: formattedSuggestions
  };
};
