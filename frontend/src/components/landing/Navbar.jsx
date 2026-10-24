import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="fixed z-50 flex justify-center  w-full">
      <nav
        className="w-full   h-16 flex items-center justify-between px-6  bg-primary/5 backdrop-blur-xl border border-primary/20
   shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]
  transition-all duration-300 ease-in-out"
      >
        {/* Logo with Primary Glow */}
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

        {/* Navigation Links with animated underlines */}
        <div className="hidden md:flex items-center gap-10 text-sm font-medium">
          {["Features", "How it Works", "About Us", "Pricing"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="relative text-gray-300 hover:text-white transition-colors group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Premium Action Button */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="hidden sm:inline-flex text-gray-300 hover:text-white hover:bg-white/5"
          >
            <Link href={"/sign-in"}>Log in</Link>
          </Button>
          <Button
            className="relative overflow-hidden bg-primary text-primary-foreground
            hover:scale-105 hover:shadow-[0_0_20px_rgba(var(--primary),0.4)]
            transition-all duration-300 rounded-xl px-6"
          >
            <Link href={"/sign-up"}>
              <span className="relative z-10">Start Speaking</span>
              {/* Subtle Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-[shimmer_2s_infinite]" />
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
