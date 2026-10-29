"use client";

import React, { useRef } from "react";
import { Quote, Star, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const feedback = [
  {
    quote: "NPB Media helped us launch our software platform successfully. Their team was highly professional and responsive.",
    author: "Technology Startup Founder",
    role: "Founder, SaaS Enterprise",
    rating: 5,
    bg: "bg-blue-600"
  },
  {
    quote: "Great communication, quality development, and on-time delivery. They truly understand business goals and deliver real value.",
    author: "Business Owner",
    role: "CEO, Global Logistics",
    rating: 5,
    bg: "bg-orange-500"
  },
  {
    quote: "Innovative solutions and a dedicated team. They transformed our legacy systems into a modern, scalable architecture.",
    author: "Operations Director",
    role: "Director, Fintech Corp",
    rating: 5,
    bg: "bg-emerald-600"
  },
  {
    quote: "Excellent support and modern technology stack. NPB Media is our go-to partner for all digital transformation projects.",
    author: "Marketing Manager",
    role: "Lead, E-commerce Hub",
    rating: 5,
    bg: "bg-indigo-600"
  }
];

export function Testimonials() {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 relative overflow-hidden">
      {/* Dynamic Background accents */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16 space-y-6 animate-in fade-in slide-in-from-top duration-1000">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/20 border-2 border-white/30 text-white text-sm font-black uppercase tracking-widest shadow-xl">
            <Sparkles className="w-5 h-5" />
            Client Feedback
          </div>
          <h2 className="text-5xl md:text-7xl font-headline font-black text-white italic drop-shadow-2xl">
            Why Businesses <span className="text-secondary">Trust Us</span>
          </h2>
          <p className="text-white/90 text-xl font-medium leading-relaxed max-w-2xl mx-auto">Hear from our partners about how we've helped them succeed in the digital age.</p>
        </div>

        <div className="relative px-2 sm:px-12">
          <Carousel
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-6 md:-ml-8">
              {feedback.map((item, idx) => (
                <CarouselItem key={idx} className="pl-6 md:pl-8 md:basis-1/2 lg:basis-1/2">
                  <Card className={`h-full group border-none shadow-2xl rounded-[3rem] ${item.bg} text-white p-8 md:p-12 relative overflow-hidden transition-all duration-700 hover:-translate-y-2 hover:scale-[1.01]`}>
                    <div className="absolute top-0 right-0 p-8 md:p-12 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                      <Quote className="w-24 h-24 md:w-32 md:h-32" />
                    </div>
                    <CardContent className="h-full space-y-8 md:space-y-12 p-0 relative z-10 flex flex-col justify-between">
                      <div className="space-y-6">
                        <div className="flex gap-2">
                          {[...Array(item.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 md:w-6 md:h-6 fill-secondary text-secondary drop-shadow-md" />
                          ))}
                        </div>
                        <p className="text-xl md:text-2xl font-black leading-tight italic text-white font-headline">
                          "{item.quote}"
                        </p>
                      </div>
                      <div className="pt-8 border-t border-white/20 flex items-center justify-between">
                        <div>
                          <h4 className="text-xl md:text-2xl font-black text-secondary font-headline italic">{item.author}</h4>
                          <p className="text-white/70 font-black text-xs md:text-sm uppercase tracking-widest mt-2">{item.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="hidden sm:block">
              <CarouselPrevious className="absolute -left-8 lg:-left-16 h-12 w-12 bg-white/10 hover:bg-white text-white hover:text-primary transition-all shadow-2xl border-none" />
              <CarouselNext className="absolute -right-8 lg:-right-16 h-12 w-12 bg-white/10 hover:bg-white text-white hover:text-primary transition-all shadow-2xl border-none" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}