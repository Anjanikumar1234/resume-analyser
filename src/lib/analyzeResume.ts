
import { Strength, Weakness } from "../components/StrengthsWeaknesses";
import { Suggestion } from "../components/Suggestions";
import { AnalysisData } from "../components/AnalysisResults";

// Helper function to generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Function to calculate a random score within a range
const calculateRandomScore = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
          title: "Tailor your resume for each application",
          description: "Customize your resume to match the specific job description keywords and requirements.",
          examples: [
            "Review the job posting and include relevant keywords in your skills and experience sections",
            "Reorder your bullet points to prioritize the most relevant experiences for each position",
            "Adjust your professional summary to align with the specific role"
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
          title: "Improve readability with better formatting",
          description: "Make your resume easy to scan by using consistent formatting and white space.",
          examples: [
            "Use bullet points instead of paragraphs for experience and skills",
            "Create clear section headings with visual separation",
            "Ensure consistent spacing, font sizes, and margins throughout"
          ],
          priority: "medium"
        },
        {
          id: generateId(),
          title: "Enhance your skills section",
          description: "Organize skills by category and focus on those most relevant to your target roles.",
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
