"use client";

import React from "react";
import { Check, Crown, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { plans } from "@/constant/pricing";

const formatPrice = (price, discount) => {
  const finalPrice = price - (price * discount) / 100;
  return finalPrice % 1 === 0 ? finalPrice.toFixed(0) : finalPrice.toFixed(2);
};

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative py-24 px-4 md:px-10 bg-[#030303] text-white overflow-hidden"
    >
      {/* iFluenter-style background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-bold text-gray-300 uppercase tracking-[0.3em]">
              Pricing & Plans
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-8xl font-black tracking-tighter"
          >
            Master your{" "}
            <span className="text-primary italic font-serif">voice.</span>
          </motion.h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Transparent pricing designed for the next generation of language
            masters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plans.map((plan, index) => {
            const isGold = plan.id === "gold";
            const isEnterprise = plan.id === "enterprise";
            const currentPrice = formatPrice(plan.price, plan.discount);

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative group rounded-[2.5rem] flex flex-col transition-all duration-700 ${
                  isGold
                    ? "bg-white/[0.03] border border-primary/40 shadow-[0_0_80px_-20px_rgba(var(--primary),0.15)]"
                    : "bg-white/[0.02] border border-white/10 hover:border-white/20"
                }`}
              >
                {/* Glossy top highlight for the "Best Value" card */}
                {isGold && (
                  <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
                )}

                <div className="p-10 flex flex-col h-full relative z-10">
                  {isGold && (
                    <div className="absolute top-6 right-10">
                      <span className="flex items-center gap-1.5 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
                        <Crown className="w-3 h-3" /> Recommended
                      </span>
                    </div>
                  )}

                  <div className="mb-10">
                    <h3
                      className={`text-3xl font-bold mb-3 tracking-tight ${
                        isGold ? "text-primary" : "text-white"
                      }`}
                    >
                      {plan.name}
                    </h3>
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">
                      {plan.description}
                    </p>
                  </div>

                  <div className="mb-12">
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-black text-white tracking-tighter">
                        ${currentPrice}
                      </span>
                      <span className="text-gray-500 font-bold text-lg uppercase">
                        {plan.isYearly
                          ? "Year"
                          : plan.renewsPer === 1
                          ? "Mo"
                          : `${plan.renewsPer}Mo`}
                      </span>
                    </div>

                    {plan.discount > 0 && (
                      <div className="mt-4 flex items-center gap-3">
                        <span className="text-gray-600 line-through text-lg font-medium">
                          ${plan.price.toFixed(2)}
                        </span>
                        <span className="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-black uppercase">
                          Save {plan.discount}%
                        </span>
                      </div>
                    )}
                  </div>

                  <ul className="space-y-5 mb-12 flex-grow">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-4 text-gray-300 text-sm font-medium"
                      >
                        <div
                          className={`mt-0.5 flex-none w-5 h-5 rounded-full flex items-center justify-center ${
                            isGold ? "bg-primary/20" : "bg-white/10"
                          }`}
                        >
                          <Check
                            className={`w-3 h-3 ${
                              isGold ? "text-primary" : "text-gray-400"
                            } stroke-[4px]`}
                          />
                        </div>
                        <span className="opacity-80 group-hover:opacity-100 transition-opacity">
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.button?.url || "/sign-up"}
                    className="w-full"
                  >
                    <Button
                      className={`w-full h-16 rounded-2xl text-lg font-black tracking-tight transition-all duration-500 ${
                        isGold
                          ? "bg-primary text-white hover:shadow-[0_0_40px_rgba(var(--primary),0.4)] hover:scale-[1.02]"
                          : "bg-white text-black hover:bg-gray-200"
                      }`}
                    >
                      {plan.button?.text || "Get Started"}
                      <ShieldCheck className="ml-2 w-5 h-5 opacity-50" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 text-center border-t border-white/5 pt-10"
        >
          <p className="text-gray-500 font-medium">
            Join 10,000+ students mastering their fluency.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
