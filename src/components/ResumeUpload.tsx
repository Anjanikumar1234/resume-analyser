import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Upload, Clipboard, Check, X, BriefcaseIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import IndustrySelect from "./IndustrySelect";

interface ResumeUploadProps {
  onUpload: (text: string, industry?: string) => void;
  onAuthNeeded: () => void;
  isLoggedIn: boolean;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onUpload, onAuthNeeded, isLoggedIn }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileUploaded, setFileUploaded] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (!isLoggedIn) {
      onAuthNeeded();
      return;
    }
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isLoggedIn) {
      onAuthNeeded();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }
    
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };
  
  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.txt') && !file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
      toast.error("Please upload a .txt, .pdf, or .docx file");
      return;
    }
    
    setFileName(file.name);
    setIsProcessing(true);
    
    try {
      if (file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setResumeText(result);
          setFileUploaded(true);
          setIsProcessing(false);
          toast.success("Resume uploaded successfully!");
        };
        reader.onerror = () => {
          toast.error("Failed to read file. Please try again.");
          setIsProcessing(false);
        };
        reader.readAsText(file);
      } 
      else {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          let extractedText = "";
          
          try {
            extractedText = result.replace(/[^\x20-\x7E]/g, " ").trim();
            extractedText = extractedText.replace(/\s+/g, " ");
          } catch (err) {
            console.error("Error extracting text:", err);
            extractedText = "Text extraction failed. Please paste your resume text manually.";
          }
          
          setResumeText(extractedText);
          setFileUploaded(true);
          setIsProcessing(false);
          toast.success("Resume uploaded successfully!");
        };
        reader.onerror = () => {
          toast.error("Failed to read file. Please try again.");
          setIsProcessing(false);
        };
        reader.readAsText(file);
      }
    } catch (error) {
      console.error("File handling error:", error);
      toast.error("An error occurred while processing your file. Please try again.");
      setIsProcessing(false);
    }
  };
  
  const handlePaste = async () => {
    if (!isLoggedIn) {
      onAuthNeeded();
      return;
    }
    
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setResumeText(text);
        setFileName("Pasted text");
        setFileUploaded(true);
        toast.success("Text pasted successfully!");
      } else {
        toast.error("No text found in clipboard");
      }
    } catch (err) {
      toast.error("Failed to read clipboard. Please paste manually.");
    }
  };
  
  const handleClearText = () => {
    setResumeText("");
    setFileName("");
    setFileUploaded(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const handleSubmit = () => {
    if (!resumeText.trim()) {
      toast.error("Please upload or paste your resume text");
      return;
    }
    
    onUpload(resumeText, selectedIndustry || undefined);
  };
  
  return (
    <section className="container max-w-4xl mx-auto py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold tracking-tight mb-4 gradient-text">Upload Your Resume</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Upload your resume as a document or paste the text. Our AI will analyze it and provide detailed feedback.
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-card cyber-border rounded-xl shadow-lg overflow-hidden backdrop-blur-sm bg-white/50 dark:bg-gray-900/50"
      >
        <div className="p-6 md:p-8">
          {!fileUploaded ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                isDragging ? "border-primary bg-primary/5" : "border-muted"
              }`}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: isDragging ? 1.05 : 1 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-primary/10 flex items-center justify-center rounded-full mb-4">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="text-xl font-medium mb-2">Drag & Drop Your Resume</h3>
                <p className="text-muted-foreground mb-6">
                  Supports .txt, .pdf and .docx files
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => {
                      if (!isLoggedIn) {
                        onAuthNeeded();
                      } else {
                        fileInputRef.current?.click();
                      }
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                  >
                    <Upload className="w-4 h-4" />
                    Browse File
                  </Button>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInput}
                    accept=".txt,.pdf,.docx"
                    className="hidden"
                  />
                  
                  <Button 
                    variant="outline" 
                    onClick={handlePaste}
                    className="flex items-center gap-2 border-indigo-300 hover:bg-indigo-50 dark:border-indigo-800 dark:hover:bg-indigo-950/20"
                  >
                    <Clipboard className="w-4 h-4" />
                    Paste Text
                  </Button>
                </div>
              </motion.div>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-between bg-muted/30 p-6 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Resume Uploaded Successfully</h3>
                    <p className="text-sm text-muted-foreground">{fileName}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleClearText}
                  className="h-8 w-8"
                >
                  <X className="w-5 h-5" />
                </Button>
              </motion.div>
            </AnimatePresence>
          )}
          
          <div className="mt-6">
            <div className="space-y-2">
              <Label htmlFor="industry" className="flex items-center gap-2">
                <BriefcaseIcon className="w-4 h-4" />
                Target Industry (Optional)
              </Label>
              <IndustrySelect 
                value={selectedIndustry} 
                onChange={(value) => setSelectedIndustry(value)} 
              />
              <p className="text-xs text-muted-foreground">
                Select an industry to get more targeted analysis and recommendations
              </p>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex justify-center"
          >
            <Button 
              onClick={handleSubmit}
              disabled={!fileUploaded || isProcessing}
              className="w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {isProcessing ? "Processing..." : "Analyze Resume"}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default ResumeUpload;
