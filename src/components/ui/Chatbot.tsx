"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, X, Send, Bot, Sparkles, Loader2, ArrowRight, HelpCircle, Compass, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  "What services does NPB Media offer?",
  "How can I book a virtual meeting?",
  "Tell me about the Retail POS billing software",
  "Are you hiring developers or designers?",
  "Where is NPB Media located?",
];

export function Chatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "model",
      content: "Hello and welcome to NPB Media! 👋 I'm your dedicated NPB Assistant. Whether you're inquiring about our software services, POS billing system, booking a consultation, or joining our engineering team, I'm here to assist and describe all our solutions. What can I help you with today?",
      timestamp: "Just now",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Don't show chatbot in internal admin dashboards to prevent UI clutter
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          message: query.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat API responded with status ${response.status}`);
      }

      const data = await response.json();
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "model",
        content: data.reply || "I'm here to help with your inquiry. What would you like to know more about?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot transmission error:", error);
      const fallbackMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "model",
        content: "NPB Media specializes in custom software, mobile apps, and retail billing systems. You can reach our team directly at /contact or schedule a meeting at /contact/schedule-meeting.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-8 left-8 z-[100]">
      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="absolute bottom-20 left-0 w-[92vw] sm:w-[420px] h-[580px] bg-slate-950 border border-slate-800 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shadow-inner">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-headline font-black italic text-white uppercase tracking-tight">NPB Assistant</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Website Query & AI Guide</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="rounded-full h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex flex-col max-w-[88%] rounded-2xl p-4 leading-relaxed",
                  msg.role === "user"
                    ? "ml-auto bg-primary text-white rounded-br-none shadow-md"
                    : "mr-auto bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none"
                )}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5 opacity-70 text-[9px] font-black uppercase tracking-wider">
                  <span>{msg.role === "user" ? "You" : "NPB Assistant"}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            ))}

            {isLoading && (
              <div className="mr-auto bg-slate-900 text-slate-400 border border-slate-800 rounded-2xl rounded-bl-none p-4 flex items-center gap-2 text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span>NPB Assistant is preparing your answer...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-5 py-2.5 flex flex-wrap gap-1.5 border-t border-slate-900 bg-slate-950/80">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="text-[10px] font-bold text-slate-400 bg-slate-900 hover:bg-primary/20 hover:text-primary border border-slate-800 rounded-full px-3 py-1 transition-colors text-left"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-slate-900/95 border-t border-slate-800 flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask any question about NPB Media, services, or products..."
              className="h-11 bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 rounded-xl text-xs focus:border-primary"
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !input.trim()}
              size="icon"
              className="h-11 w-11 rounded-xl bg-primary hover:bg-primary/90 text-white shrink-0 shadow-lg shadow-primary/20"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 px-5 h-14 rounded-full bg-slate-900 text-white border-2 border-slate-800 shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group hover:border-primary",
          isOpen && "bg-primary border-primary"
        )}
        aria-label="Toggle NPB Assistant"
      >
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:bg-white group-hover:text-primary transition-colors">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 group-hover:text-white leading-none">NPB Assistant</p>
          <p className="text-xs font-black text-white leading-none mt-1">Ask Any Question</p>
        </div>
      </button>
    </div>
  );
}
