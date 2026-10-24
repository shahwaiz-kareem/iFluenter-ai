import DisplayPlans from "@/components/pricing/DisplayPlans";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export const metadata = {
  title: "Pricing || iFluenter",
  description: "Affordable pricing by iFluenter",
};
const Pricing = () => {
  return (
    <Suspense
      fallback={
        <div className="h-[60vh] w-full flex flex-col items-center justify-center space-y-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
            Initialising Secure Gateway
          </p>
        </div>
      }
    >
      <DisplayPlans />
    </Suspense>
  );
};

export default Pricing;
