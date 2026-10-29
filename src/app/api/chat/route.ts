import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, message } = body;

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        reply: "Hello! Welcome to NPB Media. We engineer high-performance web systems, mobile applications, cloud infrastructures, and retail billing software. How can I help you today?",
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are the official AI Assistant for NPB Media, an enterprise software engineering company based in Begusarai.
NPB Media delivers:
- Enterprise Software Development (Next.js, React, Node.js, Microservices)
- Cloud Infrastructure & Scalable APIs (GCP, AWS, Firebase)
- POS & Retail Billing Management Softwares
- Automated HRMS & Workforce Platforms
- UI/UX & Digital Transformation

Be courteous, concise, and helpful. Direct users to:
- Schedule a virtual discovery call (/contact/schedule-meeting)
- Explore Services (/services)
- View Products & Billing Modules (/products)
- Career Opportunities (/career/opportunities)
- Contact Support (/contact)`;

    const conversationHistory = Array.isArray(messages)
      ? messages.map((m: { role: string; content: string }) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n')
      : '';

    const currentPrompt = message || (messages && messages[messages.length - 1]?.content) || "Hello";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          text: `${systemInstruction}\n\nConversation History:\n${conversationHistory}\n\nUser: ${currentPrompt}\nAssistant:`,
        },
      ],
    });

    const reply = response.text || "I'm here to assist you with NPB Media's software solutions. How can I help you today?";
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API route error:", error);
    return NextResponse.json(
      {
        reply: "Thank you for reaching out! Our team is available to assist you. You can schedule a virtual consultation directly at /contact/schedule-meeting or drop an inquiry via /contact.",
      },
      { status: 200 }
    );
  }
}
