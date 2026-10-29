
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { WhoWeAre } from "@/components/sections/WhoWeAre";
import { Services } from "@/components/sections/Services";
import { Industries } from "@/components/sections/Industries";
import { Process } from "@/components/sections/Process";
import { TechStack } from "@/components/sections/TechStack";
import { Testimonials } from "@/components/sections/Testimonials";
import { Careers } from "@/components/sections/Careers";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background flex flex-col">
      <Navbar />
      <Hero />
      <WhoWeAre />
      <Services />
      <Industries />
      <Process />
      <TechStack />
      <Testimonials />
      <Careers />
      <Footer />
    </main>
  );
}
