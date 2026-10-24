"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="relative pt-4 py-32 px-6 bg-[#030303] overflow-hidden">
      {/* Intense Primary Mesh Gradient for the grand finale */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[140px] rounded-full pointer-events-none opacity-60" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-4"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80">
            Suitable for every kind of learner.
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-9xl font-extrabold text-white tracking-tighter leading-[0.85]"
        >
          Stop learning. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
            Start speaking.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto font-light leading-relaxed"
        >
          Join the elite circle of fluent English speakers.{" "}
          <br className="hidden md:block" />
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center gap-6"
        >
          <Link href="/sign-up">
            <Button
              size="lg"
              className="group relative bg-primary text-white overflow-hidden rounded-2xl h-20 px-16 text-2xl font-black
                       shadow-[0_0_50px_rgba(var(--primary),0.4)] hover:shadow-[0_0_80px_rgba(var(--primary),0.6)]
                       transition-all duration-500 hover:scale-[1.05] active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-3">
                Join iFluenter
              </span>
              {/* Glossy Shimmer Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </Link>

          <div className="flex items-center gap-2 opacity-50 group">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
              Platform Status: Online & Accepting Beta Members
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
