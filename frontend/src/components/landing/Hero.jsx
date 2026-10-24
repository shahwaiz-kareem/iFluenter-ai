"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 md:px-20 py-32 overflow-hidden bg-[#030303]">
      {/* --- BACKGROUND ELEMENTS --- */}
      {/* Primary Glow Mesh */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none" />

      <div className="z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* --- LEFT SIDE: CONTENT --- */}
        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase"
          >
            <Sparkles className="w-3 h-3" />
            AI-Powered Fluency
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-[0.95]">
              Speak <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/50">
                Confidently.
              </span>
            </h1>
            <p className="mt-8 text-lg md:text-xl text-gray-400 max-w-lg leading-relaxed border-l-2 border-primary/30 pl-6">
              Practice real-world English with an AI that listens, understands,
              and corrects you in real-time. No judgment, just fluency.
            </p>
          </motion.div>

          <motion.div
            className="flex w-full flex-col sm:flex-row gap-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link href={"/sign-in"}>
              <Button
                size="lg"
                className="bg-primary text-white hover:shadow-[0_0_30px_rgba(var(--primary),0.4)] transition-all duration-300 rounded-full h-14 px-8 text-base font-semibold gap-2"
              >
                Start Practicing <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href={"#how-it-works"}>
              <Button
                size="lg"
                variant="outline"
                className="border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 rounded-full h-14 px-8 text-base font-medium"
              >
                See How It Works
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative z-10 w-full  mt-3 px-4"
        >
          {/* <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              See iFluenter in Action
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
          </div> */}

          {/* The Glass Video Frame */}
          <div className="group relative p-2 bg-gradient-to-br from-white/20 via-white/5 to-transparent backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl">
            <div className="relative aspect-video  rounded-[2rem] overflow-hidden bg-black/40">
              <video
                src="/demo.webm"
                className="w-full h-full "
                autoPlay
                controls
              ></video>
            </div>
          </div>
        </motion.div>
      </div>

      {/* --- VIDEO DEMO SECTION --- */}
    </section>
  );
}
