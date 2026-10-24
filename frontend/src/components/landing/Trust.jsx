"use client";

import { motion } from "framer-motion";

export default function Trust() {
  return (
    <section className="relative py-24 bg-[#030303] overflow-hidden border-t border-white/5">
      {/* Subtle background glow to lift the logos */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 px-6 md:px-20 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-16">
          {/* Label with glass pill effect */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-none"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500 border-l-2 border-primary pl-4">
              Trusted by professionals from
            </p>
          </motion.div>

          {/* Logos with Glassmorphic hover states */}
          <div className="flex flex-wrap gap-x-12 gap-y-10 md:gap-x-20 items-center">
            {[
              { name: "FORBES", font: "font-bold tracking-tighter" },
              { name: "WIRED", font: "font-bold tracking-tighter" },
              { name: "TechCrunch", font: "font-semibold tracking-tight" },
              { name: "The Times", font: "font-serif italic" },
            ].map((brand, i) => (
              <motion.span
                key={brand.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 0.4, y: 0 }}
                whileHover={{
                  opacity: 1,
                  color: "var(--primary)",
                  scale: 1.05,
                }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`${brand.font} text-2xl md:text-3xl text-white cursor-default transition-all duration-300`}
              >
                {brand.name}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      {/* Glass line separator at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
