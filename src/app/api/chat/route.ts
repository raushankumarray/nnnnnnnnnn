import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const NPB_KNOWLEDGE_BASE = `
# NPB Media - Official Company Information & Website Guide

NPB Media is an enterprise digital transformation and high-end software development agency founded and headquartered in Begusarai, Bihar, serving global clients.

### Key Offerings & Solutions:
1. **Custom Software & Web Engineering** (/services, /services/web-development):
   - Modern Next.js, React, Node.js, and TypeScript architectures.
   - Enterprise SaaS, scalable microservices, secure API development.
2. **Mobile Application Development** (/services/mobile-development):
   - Native & cross-platform apps for iOS and Android (React Native, Flutter, Kotlin, Swift).
3. **Cloud & DevOps Infrastructure** (/services/cloud-solutions):
   - Google Cloud Platform (GCP), AWS, Firebase, CI/CD automated pipelines, Zero-Trust security.
4. **Cloud POS & Retail Billing Management** (/products, /billing/login):
   - Real-time inventory tracking, barcode integration, multi-counter billing, IGST/CGST invoice printing.
5. **Enterprise HRMS & Workforce Suite** (/hrms/login):
   - Multi-tenant tenant access, geofenced GPS employee attendance, payroll automation, audit tracking.
6. **UI/UX & Branding Design** (/services/ui-ux-design):
   - High-fidelity component systems, user research, vibrant and responsive interfaces.
7. **Virtual Discovery Consultation** (/contact/schedule-meeting):
   - 30-minute virtual technical consultation with lead engineering architects.
8. **Careers & Talent Portal** (/career, /career/opportunities):
   - Active hiring for Software Engineers, Full-Stack Developers, UI/UX Designers, and Cloud Specialists.
9. **Direct Support & Inquiries** (/contact):
   - Official Email: contact@npbmedia.com, support@npbmedia.com
   - Official Address: Begusarai, Bihar, India
   - WhatsApp Support: Accessible via the floating WhatsApp icon on the website.

Tone and Personality:
- Professional, welcoming, concise, accurate, and deeply knowledgeable about all pages and features of NPB Media.
- Always provide direct links (like /services, /contact, /products, /career/opportunities, /contact/schedule-meeting) so users can easily navigate.
`;

function getIntelligentFallback(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("service") || q.includes("development") || q.includes("build") || q.includes("app") || q.includes("web")) {
    return "NPB Media specializes in full-stack web engineering (Next.js, React, Node.js), scalable mobile applications (iOS/Android), and cloud infrastructure. Explore our offerings at /services or view our web solutions at /services/web-development.";
  }
  if (q.includes("meeting") || q.includes("consult") || q.includes("call") || q.includes("schedule") || q.includes("book") || q.includes("talk")) {
    return "You can schedule a direct 30-minute virtual discovery consultation with our technical leads at /contact/schedule-meeting.";
  }
  if (q.includes("job") || q.includes("career") || q.includes("hir") || q.includes("work") || q.includes("intern") || q.includes("apply") || q.includes("vacancy")) {
    return "NPB Media is actively hiring talented developers and designers! You can review current open roles and submit your application at /career/opportunities.";
  }
  if (q.includes("bill") || q.includes("pos") || q.includes("product") || q.includes("retail") || q.includes("invoice") || q.includes("pricing") || q.includes("software")) {
    return "We develop robust enterprise software modules including our Cloud POS & Retail Billing Management system with real-time inventory and GST invoicing. Explore our products at /products or login to the terminal at /billing/login.";
  }
  if (q.includes("hrms") || q.includes("attendance") || q.includes("payroll") || q.includes("employee")) {
    return "Our automated HRMS suite provides geofenced GPS attendance logging, multi-tenant company administration, and payroll management. Access the portal at /hrms/login.";
  }
  if (q.includes("contact") || q.includes("email") || q.includes("phone") || q.includes("address") || q.includes("location") || q.includes("begusarai") || q.includes("support")) {
    return "NPB Media is located in Begusarai, Bihar. You can contact us via our portal at /contact or email support@npbmedia.com. You can also chat directly via WhatsApp on our site.";
  }
  if (q.includes("about") || q.includes("who") || q.includes("npb")) {
    return "NPB Media is an enterprise technology company delivering high-impact software, mobile applications, and cloud architecture right from Begusarai. Read our full story at /about.";
  }
  return "Welcome to NPB Media! We engineer high-performance web systems, mobile apps, enterprise POS billing, and cloud solutions. How can I assist you with your project, services, or career inquiry today?";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, message } = body;
    const currentPrompt = message || (messages && messages[messages.length - 1]?.content) || "Hello";

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;

    if (!apiKey || apiKey === "TODO" || apiKey === "placeholder") {
      return NextResponse.json({ reply: getIntelligentFallback(currentPrompt) });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `You are the official NPB Assistant for NPB Media's website.
Your objective:
1. Assist users by resolving any website-related queries, questions about our services, products, pricing, careers, and consultation booking.
2. Provide concise, accurate, well-described, and professional answers.
3. Suggest relevant page paths (e.g., /services, /products, /contact, /contact/schedule-meeting, /career/opportunities) when appropriate.
4. Maintain a warm, authoritative, and helpful tone representing NPB Media.

Knowledge Base:
${NPB_KNOWLEDGE_BASE}`;

      const conversationHistory = Array.isArray(messages)
        ? messages.map((m: { role: string; content: string }) => `${m.role === 'user' ? 'User' : 'NPB Assistant'}: ${m.content}`).join('\n')
        : '';

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            text: `${systemInstruction}\n\nChat History:\n${conversationHistory}\n\nUser: ${currentPrompt}\nNPB Assistant:`,
          },
        ],
      });

      const reply = response.text || getIntelligentFallback(currentPrompt);
      return NextResponse.json({ reply });
    } catch (apiError: any) {
      console.warn("Gemini API call note, using intelligent knowledge fallback:", apiError?.message || apiError);
      return NextResponse.json({ reply: getIntelligentFallback(currentPrompt) });
    }
  } catch (error: any) {
    console.warn("Chat API route error, using fallback response:", error?.message || error);
    return NextResponse.json({
      reply: "Thank you for reaching out! Our team is available to assist you. You can schedule a virtual consultation directly at /contact/schedule-meeting or drop an inquiry via /contact.",
    });
  }
}
