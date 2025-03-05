
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface IndustrySelectProps {
  value: string;
  onChange: (value: string) => void;
}

const industries = [
  { id: "technology", name: "Technology" },
  { id: "healthcare", name: "Healthcare" },
  { id: "finance", name: "Finance & Banking" },
  { id: "marketing", name: "Marketing & Advertising" },
  { id: "education", name: "Education" },
  { id: "engineering", name: "Engineering" },
  { id: "retail", name: "Retail & E-commerce" },
  { id: "manufacturing", name: "Manufacturing" },
  { id: "hospitality", name: "Hospitality & Tourism" },
  { id: "media", name: "Media & Entertainment" },
  { id: "nonprofit", name: "Nonprofit & NGO" },
  { id: "government", name: "Government & Public Sector" },
  { id: "legal", name: "Legal Services" },
  { id: "construction", name: "Construction & Architecture" },
  { id: "transportation", name: "Transportation & Logistics" },
  { id: "art", name: "Art & Design" },
  { id: "science", name: "Science & Research" },
  { id: "agriculture", name: "Agriculture & Farming" },
  { id: "other", name: "Other" }
];

const IndustrySelect: React.FC<IndustrySelectProps> = ({ value, onChange }) => {
  return (
    <Select
      value={value}
      onValueChange={onChange}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select industry" />
      </SelectTrigger>
      <SelectContent>
        {industries.map((industry) => (
          <SelectItem key={industry.id} value={industry.id}>
            {industry.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default IndustrySelect;
