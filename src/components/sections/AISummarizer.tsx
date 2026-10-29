
"use client";

import React, { useState } from "react";
import { summarizeContent } from "@/ai/flows/summarize-content-flow";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, Loader2, Sparkles, Copy, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AISummarizer() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (!text.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some text to summarize.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setIsRateLimited(false);
    try {
      const result = await summarizeContent({ text });
      setSummary(result.summary);
      toast({
        title: "Success",
        description: "Summary generated successfully!",
      });
    } catch (error: any) {
      console.error("AI summarization error:", error);
      const errorMessage = error.message || "";
      if (errorMessage.includes("429") || errorMessage.includes("Resource exhausted")) {
        setIsRateLimited(true);
        toast({
          title: "Quota Exhausted",
          description: "The AI engine is currently at its limit. Please try again in 60 seconds.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to generate summary. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="ai-tools" className="py-24 bg-foreground text-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 grid-bg" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-[100px]" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-semibold mb-2">
            <BrainCircuit className="w-4 h-4" />
            Internal Innovation Tool
          </div>
          <h2 className="text-4xl font-headline font-bold">NPB AI <span className="text-primary">Summarizer</span></h2>
          <p className="text-slate-300 max-w-xl mx-auto">
            Leverage our proprietary Generative AI to distill complex project documentation into impactful summaries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-300">Detailed Content</label>
              <span className="text-xs text-slate-500">{text.length} characters</span>
            </div>
            <Textarea
              placeholder="Paste long descriptions, project requirements, or meeting notes here..."
              className="min-h-[300px] bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-2xl resize-none focus:ring-primary/50"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            
            {isRateLimited && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-in fade-in zoom-in duration-300">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="font-medium">The AI API quota has been reached (429). Please wait a minute before requesting another summary.</p>
              </div>
            )}

            <Button 
              className="w-full h-14 rounded-xl text-lg font-headline bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
              onClick={handleSummarize}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Magic...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Craft Impactful Summary
                </>
              )}
            </Button>
          </div>

          <div className="relative">
            <Card className="h-full bg-white/10 border-white/10 backdrop-blur-lg rounded-2xl overflow-hidden flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-headline text-white">Resulting Brief</CardTitle>
                    <CardDescription className="text-slate-400">Concise, professional summary</CardDescription>
                  </div>
                  {summary && (
                    <Button variant="ghost" size="icon" onClick={copyToClipboard} className="text-slate-300 hover:text-white">
                      {copied ? <Check className="text-green-400" /> : <Copy className="w-5 h-5" />}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-6">
                {summary ? (
                  <div className="prose prose-invert max-w-none text-lg leading-relaxed text-slate-200">
                    {summary}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <p className="text-sm max-w-[200px]">Generated content will appear here after processing.</p>
                  </div>
                )}
              </CardContent>
              {summary && (
                <div className="p-4 border-t border-white/10 bg-white/5 text-xs text-center text-slate-400">
                  Powered by NPB Media GenAI Engine v2.5
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
