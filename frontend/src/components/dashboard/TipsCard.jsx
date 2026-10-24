import { Card } from "@/components/ui/card";

const TipsCard = ({ title, description, icon }) => {
  return (
    <div className="group h-full ">
      <div className="absolute  -inset-0.5 rounded-2xl bg-gradient-to-r from-primary to-primary/50 opacity-0 blur transition duration-500 " />

      <Card className="relative h-full  min-h-[14rem] overflow-hidden border-border/40 bg-background/50 backdrop-blur-sm transition-all  duration-500 hover:translate-y-[-4px] hover:border-primary/40">
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

        <div className="z-10 flex h-full flex-col  items-center justify-center py-6">
          <div className="flex flex-1 flex-col items-center h-full justify-center text-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 scale-150 rounded-full bg-primary/20 blur-2xl transition-transform duration-700 hover:scale-[2.5]" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-primary/20 to-transparent text-4xl shadow-xl backdrop-blur-md transition-all duration-500 hover:rotate-6 hover:scale-110">
                {icon}
              </div>
            </div>

            <div className="space-y-2 ">
              {/* <div className="max-sm:scale-150">
              </div> */}
              <h3 className="text-xl font-black tracking-tight text-foreground italic">
                {title}
              </h3>
              <p className="max-w-[200px] text-sm leading-relaxed text-muted-foreground transition-colors hover:text-foreground/80">
                {description}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-1 w-1 rounded-full bg-primary/40 hover:bg-primary" />
            <div className="h-1 w-8 rounded-full bg-primary/20 hover:bg-primary/40" />
            <div className="h-1 w-1 rounded-full bg-primary/40 hover:bg-primary" />
          </div>
        </div>

        <div className="absolute bottom-0 h-[3px] w-0 bg-gradient-to-r from-primary/50 via-primary to-primary/50 transition-all duration-500 hover:w-full" />
      </Card>
    </div>
  );
};

export default TipsCard;
