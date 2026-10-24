"use client";

import { motion } from "framer-motion";
import { AlertCircle, XCircle, ZapOff } from "lucide-react";

const problems = [
  {
    title: "Fear of judgment",
    icon: <AlertCircle className="w-5 h-5 text-primary" />,
    description:
      "The anxiety of making mistakes in front of native speakers stops you from ever starting a conversation.",
  },
  {
    title: "No practice partners",
    icon: <XCircle className="w-5 h-5 text-primary" />,
    description:
      "Tutors are expensive, and friends are busy. You lack a consistent space to speak daily.",
  },
  {
    title: "The 'Textbook' Trap",
    icon: <ZapOff className="w-5 h-5 text-primary" />,
    description:
      "You know the grammar rules, but your brain freezes when it's time to speak in real-world scenarios.",
  },
];

export default function Problem() {
  return (
    <section className="relative py-32 px-6 bg-[#030303] overflow-hidden">
      {/* Background radial gradient to create a 'heavy' atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-24 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1 rounded-full border border-red-500/20 bg-red-500/5 text-red-500 text-[10px] font-bold uppercase tracking-[0.3em]"
          >
            The Friction
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold text-white tracking-tighter leading-tight"
          >
            Why fluency feels <br />
            <span className="text-gray-600 italic">out of reach.</span>
          </motion.h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="group relative p-8 rounded-[2rem] bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 backdrop-blur-md overflow-hidden"
            >
              {/* Inner Glow Effect */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[60px] group-hover:bg-primary/20 transition-colors duration-500" />

              <div className="relative z-10 space-y-6">
                <div className="w-12 h-12 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center shadow-2xl group-hover:border-primary/40 transition-all">
                  {problem.icon}
                </div>

                <div className="space-y-3">
                  <h4 className="text-xl font-bold text-white tracking-tight group-hover:text-primary transition-colors">
                    {problem.title}
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed font-light">
                    {problem.description}
                  </p>
                </div>

                <div className="pt-4 flex items-center gap-2">
                  <div className="h-[1px] w-8 bg-primary/40 group-hover:w-12 transition-all" />
                  <span className="text-[10px] font-mono text-gray-600 uppercase">
                    Issue_0{i + 1}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Closing bridge to the solution */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-24 text-center"
        >
          <p className="text-gray-500 text-sm font-medium">
            Traditional methods weren't built for your confidence. <br />
            <span className="text-white">
              We built iFluenter for the real world.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
