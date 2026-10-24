"use client";

import { motion } from "framer-motion";
import { Box, Cpu, Mic2, MessageCircle, Computer } from "lucide-react";
import Image from "next/image";

const pillars = [
  {
    title: "Cinematic HDR Worlds",
    icon: <Box className="w-5 h-5 text-primary" />,
    description:
      "Practice in hyper-realistic 3D environments—from high-stakes boardrooms to sunset rooftop lounges—rendered with HDR lighting to trigger real-world spatial memory.",
  },
  {
    title: "Avatars With Unique Personalities",
    icon: <Cpu className="w-5 h-5 text-primary" />,
    description:
      "Our avatars aren't bots; they're personalities. Each has a distinct backstory, voce, and regional accent, forcing you to adapt to different social dynamics, leveraging realtime voice synthesis, our avatars respond with human-like latency for true immersion.",
  },
  {
    title: "Unscripted Conversations",
    icon: <MessageCircle className="w-5 h-5 text-primary" />,
    description:
      "Ditch the robotic scripts. Whether you’re debating fan theories or roleplaying a Martian landing, iFluenter lets you master a language by actually living in it. No rules, just real talk.",
  },
  {
    title: "Any Device, Any Time",
    icon: <Computer className="w-5 h-5 text-primary" />,
    description:
      "From desktop to smartphone, your classroom is wherever you are. Access the full iFluenter experience directly in your browser with zero setup required.",
  },
];

export default function OurPhilosophy() {
  return (
    <section
      id="features"
      className="relative pt-20 pb-10 sm:py-32 px-6 md:px-20 bg-[#030303] overflow-hidden border-y border-white/5"
    >
      {/* Background radial accent */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        {/* Left Side: Editorial Content */}
        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">
              How iFluenter is different?
            </h2>
            <h3 className="text-5xl md:text-6xl font-extrabold text-white tracking-tighter leading-[0.95]">
              Beyond voice. <br />
              <span className="text-gray-500 italic font-serif">
                Human-centric
              </span>{" "}
              AI.
            </h3>
            <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
              We believe fluency isn't about memorizing rules; it's about the
              emotional connection between environment and speech.
            </p>
          </motion.div>

          <div className="space-y-8">
            {pillars.map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex gap-6"
              >
                <div className="flex-none w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                  {pillar.icon}
                </div>
                <div className="space-y-2">
                  <h4 className="text-white font-bold tracking-tight">
                    {pillar.title}
                  </h4>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-md group-hover:text-gray-400 transition-colors">
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side: The "3D Viewport" Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 group"
        >
          {/* Mock HDR Environment Background */}
          <Image
            height={1500}
            width={500}
            src="/assets/avatars_standing.jpg"
            alt="HDR Environment"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />

          {/* Glass Overlay UI */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/30 blur-[80px] rounded-full animate-pulse" />
        </motion.div>
      </div>
    </section>
  );
}
