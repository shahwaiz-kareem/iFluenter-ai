import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, Calendar, CheckSquare } from "lucide-react";
import StreakCard from "../dashboard/Streaks";

const SessionProgress = ({ data }) => {
  const {
    totalSessions,
    totalSpokenMinutes,
    todaySessions,
    todayMinutes,
    weekSessions,
    weekMinutes,
    streak,
  } = data;

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
      title: "Total Sessions",
      value: totalSessions,
      icon: <CheckSquare className="w-4 h-4 text-muted-foreground" />,
    },
    {
      title: "Total Spoken Duration",
      value: formatDuration(totalSpokenMinutes),
      icon: <Clock className="w-4 h-4 text-muted-foreground" />,
    },
  ];

  const recentStats = [
    {
      title: "Today's Sessions",
      value: todaySessions,
      unit: "",
      icon: <Calendar className="w-4 h-4 text-muted-foreground" />,
    },
    {
      title: "Spoken Today",
      value: formatDuration(todayMinutes),
      unit: "",
      icon: <Clock className="w-4 h-4 text-muted-foreground" />,
    },
    {
      title: "This Week's Sessions",
      value: weekSessions,
      unit: "",
      icon: <Calendar className="w-4 h-4 text-muted-foreground" />,
    },
    {
      title: "Spoken This Week",
      value: formatDuration(weekMinutes),
      // value: weekMinutes,
      unit: "",
      icon: <Clock className="w-4 h-4 text-muted-foreground" />,
    },
  ];

  const streakColor = streak > 7 ? "green-500" : "yellow-500";

  return (
    <div className="space-y-8 p-1">
      {/* 1. Main Hero: The Streak Card */}
      <StreakCard streak={streak || 0} />

      {/* 2. Recent Activity Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-1 rounded-full bg-primary" />
          <h3 className="text-xl font-bold tracking-tight">Recent Activity</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {recentStats.map((stat) => (
            <div key={stat.title} className="group relative">
              {/* Subtle hover aura to match StreakCard */}
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
                {/* Decorative bottom line that expands on hover */}
                <div className="absolute bottom-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </Card>
            </div>
          ))}
        </div>
      </div>

      <Separator className="opacity-50" />

      {/* 3. Overall Progress Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-1 rounded-full bg-primary" />
          <h3 className="text-xl font-bold tracking-tight">Overall Progress</h3>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {overallStats.map((stat) => (
            <div key={stat.title} className="group relative">
              {/* Inner Mesh Background Pattern */}
              <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-background p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
                {/* Same SVG Grid Pattern from Mode/Streak cards for consistency */}
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
                    <div className="text-4xl font-black tracking-tighter italic text-foreground transition-all duration-300 group-hover:translate-x-1">
                      {stat.value || 0}
                    </div>
                  </div>
                </div>

                {/* Floating Glow in corner */}
                <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SessionProgress;
