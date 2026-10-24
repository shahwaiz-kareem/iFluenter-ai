"use client";

import { motion } from "framer-motion";
import { MessageSquare, Zap, Target, ArrowUpRight } from "lucide-react";

const features = [
  {
    title: "AI Conversation",
    description:
      "Engage in fluid, natural dialogue on any topic. The AI adapts to your level and keeps the flow going.",
    icon: <MessageSquare className="w-6 h-6" />,
    color: "from-blue-500/20",
  },
  {
    title: "Smart Corrections",
    description:
      "Instead of stopping you, iFluenter provides subtle, real-time feedback on grammar and pronunciation.",
    icon: <Zap className="w-6 h-6" />,
    color: "from-primary/20",
  },
  {
    title: "Focused Modes",
    description:
      "Switch between 'Coversation mode' for casual talk or 'Correction mode' for rigorous interview and exam prep.",
    icon: <Target className="w-6 h-6" />,
    color: "from-purple-500/20",
  },
];

export default function Solution() {
  return (
    <section className="relative py-32 px-6 md:px-20 bg-[#030303] overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(50%_50%_at_50%_0%,rgba(var(--primary-rgb),0.1)_0%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 gap-8">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-primary font-mono text-xs font-bold tracking-[0.3em] uppercase"
            >
              <span className="w-12 h-[1px] bg-primary/50" />
              The Solution
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter leading-[0.9]">
              Built for <br />
              <span className="text-primary italic font-serif">Everyone.</span>
            </h2>
          </div>
          <p className="text-gray-400 max-w-sm text-lg font-light leading-relaxed border-l border-white/10 pl-6">
            iFluenter isn't a game. It's a high-performance tool designed to
            bridge the gap between <span className="text-white">knowing</span>{" "}
            and <span className="text-white">speaking</span>.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative flex flex-col h-full"
            >
              {/* Premium Glass Card */}
              <div className="relative flex-1 p-10 rounded-[3rem] bg-white/[0.02] border border-white/10 backdrop-blur-2xl overflow-hidden transition-all duration-500 group-hover:border-primary/30 group-hover:bg-white/[0.04]">
                {/* Dynamic Hover Glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 text-primary">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-base leading-relaxed group-hover:text-gray-300 transition-colors">
                      {feature.description}
                    </p>
                  </div>

                  <div className="mt-12 flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    Learn More <ArrowUpRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
