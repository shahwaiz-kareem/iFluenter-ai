import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "../ui/card";

const ModesCard = ({ title, description, link, imgSrc }) => {
  return (
    <Link href={link} className="group relative block focus:outline-none">
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary to-blue-600 opacity-0 blur  group-hover:opacity-20" />

      <Card className="relative h-full overflow-hidden border-border/40 bg-background/50 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-[-4px] group-hover:border-primary/40">
        {/* <div className="absolute inset-0 z-0 opacity-[0.03] [mask-image:linear-gradient(to_bottom,white,transparent)]">
          <svg
            className="h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="100"
            viewBox="0 0 100 100"
          >
            <path
              d="M100 0H0V100"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div> */}

        <div className="relative z-10 flex  p-8 flex-row sm:items-center sm:gap-8">
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {title}
              </h3>
              <p className="max-w-[320px] text-xs sm:text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <span className="relative flex h-10 items-center justify-center overflow-hidden rounded-lg bg-primary px-6 text-xs  sm:text-sm font-semibold text-primary-foreground transition-all duration-300 group-hover:pr-10">
                Get Started
                <ArrowRight className="absolute right-4 h-4 w-4 translate-x-10 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
              </span>
            </div>
          </div>

          <div className="relative mt-8 sm:mt-0">
            <div className="absolute inset-0 scale-150 rounded-full bg-primary/20 blur-[40px] transition-transform duration-700 group-hover:scale-[2]" />

            <div className="relative h-40 w-40 overflow-visible transition-all duration-500 group-hover:rotate-3 group-hover:scale-110 sm:h-48 sm:w-48">
              <Image
                src={imgSrc}
                alt={title}
                fill
                className="drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)] object-contain"
              />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ModesCard;
