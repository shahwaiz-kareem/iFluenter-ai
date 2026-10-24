import { Zap } from "lucide-react";
import { Card } from "../ui/card";

const StreakCard = ({ streak = 0 }) => {
  return (
    <div className="group relative block">
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary to-primary/50 opacity-0 blur transition duration-500 group-hover:opacity-20" />

      <Card className="relative overflow-hidden border-border/40 bg-background/50 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-[-4px] group-hover:border-primary/40">
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

        <div className="relative z-10 flex flex-col p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
              Personal Momentum
            </div>

            <div className="flex items-baseline gap-2">
              <h3 className="text-6xl font-black tracking-tighter text-foreground italic transition-transform duration-500 group-hover:scale-105">
                {streak || 0}
              </h3>
              <div className="flex flex-col">
                <span className="text-sm font-bold uppercase text-foreground">
                  {streak === 1 ? "Day" : "Days"}
                </span>
                <span className="text-[10px] font-medium text-muted-foreground">
                  Running Streak
                </span>
              </div>
            </div>
          </div>

          <div className="relative mt-6 flex items-center justify-center sm:mt-0">
            <div className="absolute inset-0 scale-150 rounded-full bg-primary/20 blur-[30px] transition-transform duration-700 group-hover:scale-[2]" />

            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-primary/20 to-transparent shadow-xl backdrop-blur-md transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
              <Zap
                className={`h-10 w-10 transition-all duration-500 ${
                  streak > 0
                    ? "fill-primary text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.8)]"
                    : "text-muted/40"
                }`}
              />

              {streak > 0 && (
                <div className="absolute inset-0 animate-pulse rounded-2xl border-2 border-primary/30" />
              )}
            </div>
          </div>
        </div>

        <div className="relative z-10 border-t border-border/40 bg-muted/20 px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">
              {streak > 0 ? "Keep the flame alive" : "Begin your journey"}
            </span>
            <div className="flex h-1.5 w-24 overflow-hidden rounded-full bg-border">
              <div
                className="h-full bg-primary transition-all duration-1000 group-hover:shadow-[0_0_8px_rgba(var(--primary),0.6)]"
                style={{ width: `${Math.min((streak / 7) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StreakCard;
