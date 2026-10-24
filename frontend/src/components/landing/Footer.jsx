"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative py-10 px-6 md:px-20 bg-[#030303] overflow-hidden border-t border-white/5">
      {/* Background Mesh Glow for Premium Finish */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-8">
          {/* Brand Identity */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 group cursor-pointer">
              <Image
                src={"/logo.jpg"}
                height={100}
                width={100}
                alt="iFluenter logo"
                className="h-8 w-8 rounded"
              />
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
                iFluenter
              </span>
            </div>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed font-light">
              The premium AI-native environment for mastering spoken English.
              Refined for high-stakes performance.
            </p>
          </div>

          {/* Links Grid with Glassmorphic Typography */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-16 gap-y-12 text-sm">
            <div className="flex flex-col gap-5">
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                Product
              </span>
              <div className="flex flex-col gap-3">
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-all duration-300"
                >
                  How it Works
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-all duration-300"
                >
                  Pricing
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                Legal
              </span>
              <div className="flex flex-col gap-3">
                <Link
                  href="legal/terms"
                  className="text-gray-400 hover:text-white transition-all duration-300"
                >
                  Terms of Service
                </Link>
                <Link
                  href="legal/refund"
                  className="text-gray-400 hover:text-white transition-all duration-300"
                >
                  Refund Policy
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                Connect
              </span>
              <div className="flex flex-col gap-3">
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-all duration-300"
                >
                  Twitter
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-all duration-300"
                >
                  Support
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Monospace Editorial Style */}
        <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
              © {year} iFluenter. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest hidden sm:block">
              Built for the future of language.
            </p>
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-white/50 uppercase">
              v1.0.0
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
