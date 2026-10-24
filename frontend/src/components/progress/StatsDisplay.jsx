import { Card } from "@/components/ui/card";
import { Gauge, Clock, XCircle, Volume2, Mic } from "lucide-react";

const StatsDisplay = ({ data, progressOf }) => {
  const {
    avgWpm,
    avgFluencyScore,
    totalSpeechDuration,
    fillerCount,
    grammaticalMistakesCount,
  } = data;

  const formatDuration = (minutes) => {
    if (typeof minutes !== "number" || minutes < 0) return "0s";
    const remainingSeconds = (minutes % 60).toFixed(0);
    const mins = Math.floor(minutes / 60);
    if (minutes > 0) {
      return `${mins > 0 ? mins.toString() + "m" : ""} ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const fluencyColor = avgFluencyScore > 5 ? "green-500" : "yellow-500";

  // Define the dashboard metrics
  const metrics = [
    {
      title: "Avg. WPM",
      value: avgWpm?.toFixed(0),
      unit: "words/min",
      icon: <Volume2 className="w-4 h-4 text-primary" />,
    },
    {
      title: "Total Spoken Duration",
      value: formatDuration(totalSpeechDuration),
      unit: "",
      icon: <Clock className="w-4 h-4 text-primary" />,
    },
    {
      title: "Filler Words",
      value: fillerCount,
      unit: "",
      icon: <Mic className="w-4 h-4 text-primary" />,
    },
    {
      title: "Grammar Errors",
      value: grammaticalMistakesCount,
      unit: "",
      icon: <XCircle className="w-4 h-4 text-primary" />,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="h-6 w-1.5 rounded-full bg-primary" />
        <h2 className="text-2xl font-black tracking-tight italic">
          {progressOf}'s Performance
        </h2>
      </div>

      <div className="group relative block">
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary to-primary/50 opacity-0 blur transition duration-500 group-hover:opacity-20" />
        <Card className="relative overflow-hidden border-border/40 bg-background/50 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-[-4px] group-hover:border-primary/40">
          <div className="absolute inset-0 z-0 opacity-[0.03] [mask-image:linear-gradient(to_bottom,white,transparent)]">
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
          </div>

          <div className="relative z-10 flex flex-col p-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                Mastery Metric
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold uppercase text-muted-foreground">
                  Fluency Score
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-7xl font-black tracking-tighter text-foreground italic transition-transform duration-500 group-hover:scale-105">
                    {avgFluencyScore?.toString().slice(0, 3) || "--"}
                  </span>
                  <span className="text-xl font-bold text-muted-foreground/40">
                    / 10
                  </span>
                </div>
              </div>

              <div className="w-full max-w-xs space-y-2">
                <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)] transition-all duration-1000 ease-out"
                    style={{ width: `${(avgFluencyScore || 0) * 10}%` }}
                  />
                </div>
                <p className="text-[10px] font-medium text-muted-foreground italic">
                  A score above 8 is considered professional excellence.
                </p>
              </div>
            </div>

            <div className="relative mt-8 sm:mt-0">
              <div className="absolute inset-0 scale-150 rounded-full bg-primary/20 blur-[40px] transition-transform duration-700 group-hover:scale-[2]" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-primary/20 to-transparent shadow-2xl backdrop-blur-xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                <Gauge className="h-12 w-12 text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.8)]" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.title} className="group relative">
            <div className="absolute -inset-0.5 rounded-xl bg-primary opacity-0 blur transition group-hover:opacity-10" />
            <Card className="relative overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-300 group-hover:border-primary/30">
              <div className="p-5">
                <div className="flex items-center justify-between pb-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {metric.title}
                  </p>
                  <div className="text-primary/70 transition-transform group-hover:scale-110 group-hover:text-primary">
                    {metric.icon}
                  </div>
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-3xl font-black tracking-tight text-foreground italic">
                    {metric.value || 0}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-muted-foreground/60">
                    {metric.unit}
                  </span>
                </div>
              </div>
              <div className="absolute bottom-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsDisplay;
