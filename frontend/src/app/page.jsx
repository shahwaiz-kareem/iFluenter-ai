import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Trust from "@/components/landing/Trust";
import Problems from "@/components/landing/Problems";
import Solutions from "@/components/landing/Solution";
import HowItWorks from "@/components/landing/HowItWorks";
import Personas from "@/components/landing/Personas";
import Pricing from "@/components/landing/Pricing";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import "@/app/globals.css";
import OurPhilosophy from "@/components/landing/OurPhilosophy";
import AboutUs from "@/components/landing/AboutUs";

export const metadata = {
  title: "iFluenter | AI-Powered English Fluency",
  description:
    "Master spoken English with real-time AI corrections. No judgment, just premium speaking practice.",
};

export default function LandingPage() {
  return (
    <div className="bg-black min-h-screen text-white selection:bg-white selection:text-black">
      {/* 1. Global Navigation */}
      <Navbar />

      <main>
        {/* 2. Above the fold - Hero */}
        <Hero />

        {/* 3. Immediate Credibility Bar */}
        <OurPhilosophy />
        {/* 3. Immediate Credibility Bar */}
        {/* <Trust /> */}

        {/* 4. Emotional Hook - Why traditional apps fail */}
        <Problems />

        {/* 5. The Solutions - Introducing iFluenter */}
        <Solutions />

        {/* 6. Process - How simplicity drives results */}
        <HowItWorks />

        {/* 8. Segmentation - Qualifying the premium user */}
        <Personas />
        <AboutUs />

        <Pricing />

        {/* 10. The Closer */}
        <FinalCTA />
      </main>

      {/* 11. Footer */}
      <Footer />
    </div>
  );
}
