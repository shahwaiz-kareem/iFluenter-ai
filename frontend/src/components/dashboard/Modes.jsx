import Link from "next/link";
import ModesCard from "./ModesCard";
import { ArrowRight, MoveRight } from "lucide-react";
import { Button } from "../ui/button";
import { modesList } from "@/constant/modes";

const Modes = () => {
  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-2  h-full gap-6 ">
        {/* Correction Mode Card */}
        {modesList.slice(0, 2).map((mode, index) => (
          <ModesCard
            key={index}
            title={mode.name}
            description={mode.description}
            imgSrc={mode.imgSrc}
            link={mode.href}
          />
        ))}
      </section>
      <Link
        className="flex items-center pr-4 gap-1 mt-6 rounded w-64 h-full font-semibold "
        href={"/dashboard/modes"}
      >
        <span className="relative flex h-10 items-center justify-center overflow-hidden rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all duration-300 group-hover:pr-10">
          See All Modes
          <ArrowRight className="absolute right-4 h-4 w-4 translate-x-10 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
        </span>
      </Link>
    </>
  );
};

export default Modes;
