
import React, { useState } from "react";
import { Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { improveSentence } from "@/lib/analyzeResume";

interface SentenceImproverProps {
  originalSentence: string;
  industry?: string;
  onImproved?: (improvedSentence: string) => void;
}

const SentenceImprover: React.FC<SentenceImproverProps> = ({
  originalSentence,
  industry,
  onImproved
}) => {
  const [sentence, setSentence] = useState(originalSentence);
  const [isImproving, setIsImproving] = useState(false);
  const [improvedSentence, setImprovedSentence] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleImprove = async () => {
    if (!sentence.trim()) {
      toast.error("Please enter a sentence to improve");
      return;
    }

    setIsImproving(true);
    try {
      const improved = await improveSentence(sentence, industry);
      setImprovedSentence(improved);
      
      // Notify parent component if callback is provided
      if (onImproved) {
        onImproved(improved);
      }
    } catch (error) {
      console.error("Error improving sentence:", error);
      toast.error("Failed to improve sentence. Please try again.");
    } finally {
      setIsImproving(false);
    }
  };

  const handleApply = () => {
    setSentence(improvedSentence);
    setImprovedSentence("");
    setIsOpen(false);
    
    if (onImproved) {
      onImproved(improvedSentence);
    }
    
    toast.success("Improved sentence applied!");
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex items-center gap-1 text-xs"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Wand2 className="w-3 h-3" />
          Improve Sentence
        </Button>
      </div>

      {isOpen && (
        <Card className="p-4 mt-2 bg-muted/20">
          <div className="space-y-4">
            <div>
              <Label htmlFor="original-sentence">Original Sentence</Label>
              <Textarea
                id="original-sentence"
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
                placeholder="Enter a sentence to improve..."
                className="mt-1"
              />
            </div>

            <div className="flex justify-center">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleImprove}
                disabled={isImproving}
              >
                {isImproving ? "Improving..." : "Improve"}
              </Button>
            </div>

            {improvedSentence && (
              <div>
                <Label htmlFor="improved-sentence">Improved Sentence</Label>
                <Textarea
                  id="improved-sentence"
                  value={improvedSentence}
                  onChange={(e) => setImprovedSentence(e.target.value)}
                  className="mt-1 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                />
                <div className="flex justify-end mt-2">
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={handleApply}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default SentenceImprover;
