"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";
import { ExternalLink, Plus, Sparkles } from "lucide-react";

const categories = ["All", "Software", "Fintech", "Cloud"];

export function Portfolio() {
  const [activeTab, setActiveTab] = useState("All");

  const projects = useMemo(() => [
    {
      id: 1,
      title: "MediaPay Fintech Solution",
      category: "Fintech",
      image: PlaceHolderImages?.find(p => p.id === "portfolio-fintech"),
      tags: ["Mobile App", "Security", "Real-time"],
    },
    {
      id: 3,
      title: "CloudScale Platform",
      category: "Cloud",
      image: "https://picsum.photos/seed/npb6/800/600",
      tags: ["Kubernetes", "DevOps", "AWS"],
    },
    {
      id: 4,
      title: "E-Commerce Core",
      category: "Software",
      image: "https://picsum.photos/seed/npb7/800/600",
      tags: ["React", "NodeJS", "Scale"],
    }
  ], []);

  const filteredProjects = activeTab === "All" 
    ? projects 
    : projects.filter(p => p.category === activeTab);

  return (
    <section id="portfolio" className="py-20 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12 animate-in fade-in slide-in-from-bottom duration-700">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Products Overview
            </div>
            <h2 className="text-4xl md:text-5xl font-headline font-bold">Showcasing Our <span className="text-accent italic">Impact</span></h2>
            <p className="text-muted-foreground text-lg">
              A curated selection of high-complexity products where engineering meets creativity.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeTab === cat ? "default" : "outline"}
                onClick={() => setActiveTab(cat)}
                className="rounded-full px-6 transition-all duration-300"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project, idx) => (
            <div 
              key={project.id} 
              className="group relative overflow-hidden rounded-[2.5rem] bg-muted animate-in fade-in slide-in-from-bottom duration-700 fill-mode-both"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="aspect-[16/10] relative overflow-hidden">
                <Image
                  src={typeof project.image === 'string' ? project.image : project.image?.imageUrl || "https://picsum.photos/seed/placeholder/800/600"}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  data-ai-hint="software project"
                />
                <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/40 transition-colors duration-300" />
              </div>
              
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <div className="space-y-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border-none">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="text-3xl font-headline font-bold">{project.title}</h3>
                  <div className="flex gap-4">
                    <Button variant="secondary" size="sm" className="rounded-full gap-2 font-bold">
                      View Case Study <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="absolute top-6 right-6 w-12 h-12 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100 shadow-xl">
                <Plus className="text-white w-6 h-6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}