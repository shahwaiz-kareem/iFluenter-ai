"use client";

import { motion } from "framer-motion";
import { GraduationCap, Coffee, Zap, Globe, ArrowUpRight } from "lucide-react";

const personas = [
  {
    category: "Academic",
    title: "The Ambitious Student",
    icon: <GraduationCap className="w-6 h-6 text-primary" />,
    description:
      "Bridge the gap between textbook grammar and real-world fluency for exams, study abroad, or campus life with the most affordable pricing.",
  },
  {
    category: "Lifestyle",
    title: "The Casual Learner",
    icon: <Coffee className="w-6 h-6 text-primary" />,
    description:
      "Master daily conversations, travel the world with confidence, and connect with people in their native tongue.",
  },
  {
    category: "Professional",
    title: "The Career Climber",
    icon: <Zap className="w-6 h-6 text-primary" />,
    description:
      "Command respect in meetings, nail high-stakes interviews, and lead international teams with absolute precision.",
  },
  {
    category: "Everyone",
    title: "The Global Citizen",
    icon: <Globe className="w-6 h-6 text-primary" />,
    description:
      "Eliminate language barriers and express your personality naturally, no matter who you're speaking to.",
  },
];

export default function Personas() {
  return (
    <section className="relative py-24 px-6 md:px-10 bg-[#030303] overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-30" />
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none opacity-20" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <div className="h-[1px] w-12 bg-primary/50" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
              Built for Everyone
            </span>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]"
            >
              Mastery for <br />
              <span className="text-primary italic font-serif">
                Every Journey.
              </span>
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gray-500 max-w-sm text-lg font-medium leading-relaxed"
            >
              Whether you’re passing an exam or closing a deal, we provide the
              environment to any kind of learner to achieve fluency.
            </motion.p>
          </div>
        </div>

        {/* Responsive Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {personas.map((persona, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="group relative h-full"
            >
              {/* Card Container */}
              <div className="relative h-full p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 overflow-hidden transition-all duration-500 group-hover:border-primary/40 group-hover:bg-white/[0.04]">
                {/* Internal Glow Effect */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative z-10 flex flex-col h-full space-y-12">
                  {/* Icon Wrapper */}
                  <div className="w-14 h-14 rounded-2xl bg-black/50 border border-white/5 flex items-center justify-center group-hover:scale-110 group-hover:border-primary/30 transition-all duration-500">
                    {persona.icon}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-80">
                        {persona.category}
                      </p>
                      <h4 className="text-2xl font-bold text-white tracking-tight group-hover:text-primary transition-colors duration-300">
                        {persona.title}
                      </h4>
                    </div>

                    <p className="text-gray-500 text-sm leading-relaxed font-medium group-hover:text-gray-300 transition-colors duration-300">
                      {persona.description}
                    </p>
                  </div>

                  {/* Bottom Action Section */}
                  {/* <div className="pt-4 mt-auto border-t border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                      Learn More
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-primary" />
                  </div> */}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
