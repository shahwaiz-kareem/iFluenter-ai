"use client";
import { Progress } from "@/components/ui/progress";
import { Download } from "lucide-react";

const CanvasLoader = ({ assetsStatus }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-xl mx-auto  py-2 animate-in fade-in duration-700">
      <div className="w-full space-y-10">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <div className="relative bg-background border border-border p-6 rounded-3xl shadow-xl">
              <Download
                className="text-primary animate-bounce"
                size={64}
                strokeWidth={1.5}
              />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Preparing Your Experience
            </h2>
            <p className="text-primary font-medium text-sm animate-pulse">
              {assetsStatus.text}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative pt-1">
            <Progress
              className="h-3 w-full bg-secondary shadow-inner"
              value={assetsStatus.value}
            />
            {/* Percentage Label */}
            {/* <span className="absolute -top-6 right-0 text-xs font-bold font-mono text-primary">
              {Math.round(assetsStatus.value)}%
            </span> */}
          </div>

          <div className="bg-accent/30 border border-primary/10 rounded-2xl p-5 space-y-3">
            <p className="text-sm leading-relaxed text-muted-foreground text-center">
              Please wait while we download the necessary assets. This depends
              on your
              <span className="text-foreground font-semibold">
                {" "}
                internet speed
              </span>
              . To save data, these files will be stored locally for instant
              access next time.
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-full border border-border">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              iFluenter
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasLoader;
