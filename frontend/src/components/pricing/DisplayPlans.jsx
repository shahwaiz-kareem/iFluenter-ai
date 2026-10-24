"use client";

import { CircleCheck, ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { plans } from "@/constant/pricing";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

const DisplayPlans = ({ className }) => {
  const params = useSearchParams();
  const email = params.get("email");
  const fullName = params.get("name");

  const getDiscountedPrice = (originalPrice, discount) => {
    const newPrice = originalPrice - (discount / 100) * originalPrice;
    // Returns string without .00 if it's a whole number, otherwise 2 decimal places
    return newPrice % 1 === 0 ? newPrice.toFixed(0) : newPrice.toFixed(2);
  };

  return (
    <section
      className={cn(
        "relative py-24 px-4 overflow-hidden bg-[#030303] text-white",
        className
      )}
    >
      {/* Premium Glow Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="container relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-6 text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter">
              Professional{" "}
              <span className="text-primary italic font-serif">Plans.</span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
              Choose the perfect tier to accelerate your fluency journey.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => {
            // "Gold" is usually the featured/popular plan based on your list
            const isFeatured = plan.id === "gold";
            const discountedPrice = getDiscountedPrice(
              plan.price,
              plan.discount
            );

            // Constructing LemonSqueezy links dynamically based on env vars
            const checkoutUrl =
              plan.id === "standard"
                ? `${process.env.NEXT_PUBLIC_STANDARD_VARIANT_LINK}?checkout[email]=${email}&checkout[name]=${fullName}&checkout[discount_code]=${plan.discountCode}`
                : plan.id === "gold"
                ? `${process.env.NEXT_PUBLIC_GOLD_VARIANT_LINK}?checkout[email]=${email}&checkout[name]=${fullName}&checkout[discount_code]=${plan.discountCode}`
                : `${process.env.NEXT_PUBLIC_ENTERPRISE_VARIANT_LINK}?checkout[email]=${email}&checkout[name]=${fullName}&checkout[discount_code]=${plan.discountCode}`;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex"
              >
                <Card
                  className={cn(
                    "flex flex-col w-full transition-all duration-500 bg-white/[0.02] border-white/10 rounded-[2.5rem] overflow-hidden hover:bg-white/[0.04]",
                    isFeatured &&
                      "border-primary/50 ring-1 ring-primary/20 shadow-[0_0_50px_-12px_rgba(var(--primary),0.2)]"
                  )}
                >
                  <CardHeader className="p-10 pb-6">
                    <div className="flex justify-between items-center mb-6">
                      <CardTitle
                        className={cn(
                          "text-2xl font-bold tracking-tight",
                          isFeatured ? "text-primary" : "text-white"
                        )}
                      >
                        {plan.name}
                      </CardTitle>
                      {isFeatured && (
                        <Badge className="bg-primary text-white font-black uppercase tracking-widest text-[10px] px-3 py-1">
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">
                      {plan.description}
                    </p>

                    <div className="flex flex-col gap-2 pt-10">
                      <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-black tracking-tighter text-white">
                          ${discountedPrice}
                        </span>
                        <span className="text-gray-500 font-bold text-lg uppercase tracking-widest">
                          /
                          {plan.isYearly
                            ? "Yr"
                            : plan.renewsPer === 1
                            ? "Mo"
                            : `${plan.renewsPer}Mo`}
                        </span>
                      </div>

                      {plan.discount > 0 && (
                        <div className="flex items-center gap-3">
                          <span className="text-lg line-through text-gray-700 font-medium">
                            ${plan.price.toFixed(2)}
                          </span>
                          <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-md uppercase">
                            Save {plan.discount}%
                          </span>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 p-10 pt-0">
                    <Separator className="my-8 bg-white/5" />
                    <ul className="space-y-5">
                      {plan.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-4 text-sm font-medium text-gray-300"
                        >
                          <div
                            className={cn(
                              "mt-0.5 rounded-full p-0.5 flex-shrink-0",
                              isFeatured ? "bg-primary/20" : "bg-white/5"
                            )}
                          >
                            <CircleCheck
                              className={cn(
                                "w-4 h-4",
                                isFeatured ? "text-primary" : "text-gray-500"
                              )}
                            />
                          </div>
                          <span className="leading-tight opacity-90">
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="p-10 pt-4">
                    <Button
                      asChild
                      className={cn(
                        "w-full h-16 rounded-2xl font-black text-lg transition-all duration-300 group",
                        isFeatured
                          ? "bg-primary text-white hover:shadow-[0_0_30px_rgba(var(--primary),0.4)] hover:scale-[1.02]"
                          : "bg-white text-black hover:bg-gray-200"
                      )}
                    >
                      {email && fullName ? (
                        <a
                          href={checkoutUrl}
                          className="flex items-center justify-center gap-2"
                        >
                          {plan.button.text}
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform opacity-50" />
                        </a>
                      ) : (
                        <Link
                          href="/sign-in"
                          className="flex items-center justify-center gap-2"
                        >
                          Get Started
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform opacity-50" />
                        </Link>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-20 flex flex-col items-center gap-4 text-center"
        >
          <div className="flex items-center gap-2 text-gray-500">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Secure SSL Encrypted Checkout
            </span>
          </div>
          <p className="text-gray-600 text-xs font-medium max-w-sm">
            All plans include a satisfaction guarantee. Switch or cancel your
            subscription at any time.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default DisplayPlans;
