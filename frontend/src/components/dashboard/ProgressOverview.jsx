"use client";

import { Card } from "@/components/ui/card";
import { CheckSquare, Clock, Loader2 } from "lucide-react";
import StreakCard from "../dashboard/Streaks";
import { useEffect, useState } from "react";

const ProgressOverview = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/chat-session/get-stats`, {
          method: "GET",
          credentials: "include",
          signal,
        });
        if (!res.ok) return router.push("/sign-in");
        const data = await res.json();
        setData(data);
        setIsLoading(false);
      } catch (error) {
        router.push("/sign-in");
      }
    };
    fetchUser();
    return () => controller.abort();
  }, []);

  const { totalSpokenMinutes, streak, totalSessions, todayMinutes } = data;

  const formatDuration = (seconds) => {
    if (typeof seconds !== "number" || seconds < 0) return "0s";
    const remainingSeconds = (seconds % 60).toFixed(0);
    const mins = (seconds / 60).toFixed(0);
    if (seconds > 0) {
      return `${mins > 0 ? mins.toString() + "m" : ""} ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const overallStats = [
    {
      title: "Total Spoken Duration",
      value: formatDuration(totalSpokenMinutes),
      icon: <Clock className="w-4 h-4 text-muted-foreground" />,
    },
    {
      title: "Total Sessions",
      value: totalSessions,
      icon: <CheckSquare className="w-4 h-4 text-muted-foreground" />,
    },
  ];
  const stat = {
    title: "Spoken Today",
    value: formatDuration(todayMinutes),
    unit: "",
    icon: <Clock className="w-4 h-4 text-muted-foreground" />,
  };

  return (
    <>
      {!isLoading ? (
        <div className="w-full sm:columns-1 md:columns-2 gap-4 space-y-4">
          {/* Left Section content merged into Masonry Flow */}

          {/* Streak Card */}
          <div className="break-inside-avoid">
            <StreakCard streak={streak || 0} />
          </div>

          {/* Recent Stat Card */}
          <div key={stat.title} className="break-inside-avoid group relative">
            <div className="absolute -inset-0.5 rounded-xl bg-primary opacity-0 blur transition group-hover:opacity-10" />
            <Card className="relative overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-300 group-hover:border-primary/30">
              <div className="p-5">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {stat.title}
                  </p>
                  <div className="text-primary/70 transition-transform group-hover:scale-110 group-hover:text-primary">
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-black tracking-tight text-foreground italic">
                    {stat.value || 0}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-muted-foreground/60">
                    {stat.unit}
                  </span>
                </div>
              </div>
              <div className="absolute bottom-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Card>
          </div>

          {/* Overall Stats Section content merged into Masonry Flow */}
          {overallStats.map((stat) => (
            <div key={stat.title} className="break-inside-avoid group relative">
              <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-background p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
                <div className="absolute inset-0 z-0 opacity-[0.02] [mask-image:linear-gradient(to_bottom,white,transparent)]">
                  <svg
                    className="h-full w-full"
                    xmlns="http://www.w3.org/2000/svg"
                    width="60"
                    height="60"
                    viewBox="0 0 100 100"
                  >
                    <path
                      d="M100 0H0V100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                  </svg>
                </div>

                <div className="relative z-10 flex items-center gap-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/5 border border-primary/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <div className="text-primary h-8 w-8">{stat.icon}</div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      {stat.title}
                    </p>
                    <div className="text-2xl md:text-4xl font-black tracking-tighter italic text-foreground transition-all duration-300 group-hover:translate-x-1">
                      {stat.value || 0}
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Loader2 className="animate-spin" size={30} />
        </div>
      )}
    </>
  );
};

export default ProgressOverview;
