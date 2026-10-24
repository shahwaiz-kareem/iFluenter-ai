"use client";

import { motion } from "framer-motion";
import { Mic2, MessageSquare, LineChart } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Select Or Type Your Topic",
    icon: <MessageSquare className="w-5 h-5" />,
    description:
      "Choose from business communication, travel chats, or custom interview prep scenarios.",
  },

  {
    number: "03",
    title: "Design Your World",
    icon: <Mic2 className="w-5 h-5" />,
    description:
      "Customize your journey by choosing your favorite AI avatar and stepping into stunning HDR environments. From a garden to a stunning real city, you control the vibe.",
  },
  {
    number: "04",
    title: "You Are Ready For Real-time Coaching",
    icon: <LineChart className="w-5 h-5" />,
    description:
      "Stop making the same mistakes. Your digital tutor provides instant, constructive feedback and shows you exactly how to sound more like a local with every sentence you speak.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative py-20 px-6 md:px-20 bg-[#030303] overflow-hidden"
    >
      {/* Background Decorative Glows */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-start">
        {/* Left Side: Sticky Header */}
        <div className="lg:sticky lg:top-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-[0.2em] uppercase">
              The Process
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tighter leading-tight">
              The Path to <br />
              <span className="text-primary italic font-serif">
                Effortless
              </span>{" "}
              Fluency
            </h2>
            <p className="text-gray-400 text-lg max-w-md leading-relaxed border-l border-white/10 pl-6">
              We removed the friction of traditional language apps. No typing,
              no multiple choice—just the natural flow of human voice.
            </p>

            {/* Minimal Stat/Proof */}
            {/* <div className="pt-8 flex items-center gap-4 text-white/80 text-sm font-medium">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-black bg-gray-800"
                  />
                ))}
              </div>
              <span>Join by 10k+ learners</span>
            </div> */}
          </motion.div>
        </div>

        {/* Right Side: Step Cards with Connecting Line */}
        <div className="relative space-y-12">
          {/* Vertical Connecting Line */}
          <div className="absolute left-8 top-4 bottom-4 w-[1px] bg-gradient-to-b from-primary/50 via-primary/20 to-transparent hidden md:block" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative flex gap-2  md:gap-8 items-start"
            >
              {/* Icon / Number Indicator */}
              <div className="relative z-10 flex-none w-16 h-16 rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center shadow-xl group-hover:border-primary/50 transition-colors duration-500">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <span className="text-primary group-hover:scale-110 transition-transform duration-500">
                  {step.icon}
                </span>
              </div>

              {/* Glass Card */}
              <div className="flex-grow p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {step.title}
                  </h3>
                  <span className="text-xs font-mono text-primary/40 group-hover:text-primary transition-colors">
                    STEP_{step.number}
                  </span>
                </div>
                <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                  {step.description}
                </p>

                {/* Visual Accent */}
                <div className="mt-6 w-full h-[1px] bg-gradient-to-r from-primary/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
