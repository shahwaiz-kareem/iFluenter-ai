import { useRouter } from "next/navigation";
import { CheckCircle, CheckCircle2, CreditCard, Gem, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function SubscriptionTab({ status, planName }) {
  const router = useRouter();
  const isFree = status === "free";

  const handleAction = () => {
    if (isFree) {
      router.push("/pricing");
    } else {
      // Logic for Stripe Customer Portal or Billing settings
      window.open(
        `https://${process.env.NEXT_PUBLIC_LEMONSQUEEZY_STORE}.lemonsqueezy.com/billing
`,
        "_blank"
      );
    }
  };

  return (
    <Card className="w-full border-2">
      <CardHeader className="pb-6">
        <div className="w-full flex items-center justify-start">
          {/* <p className="text-sm font-bold">Status</p> */}
          <Badge
            variant={isFree ? "secondary" : "default"}
            className={cn(
              status === "active" ? "bg-green-500" : "bg-yellow-400",
              "capitalize"
            )}
          >
            {status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg ">
          <div className="flex items-center ">
            <div className="mr-4 bg-primary/10 p-2 flex items-center justify-center gap-2 rounded-full">
              {isFree ? (
                <Zap className="h-5 w-5 text-primary" />
              ) : (
                <Gem className="h-5 w-5 text-primary" />
              )}
            </div>
            <p className="text-lg font-bold text-foreground ">
              {planName} Plan
            </p>
          </div>
          <div
            title={status}
            className="mr-4 bg-primary/10 p-2 flex items-center justify-center gap-2 rounded-full"
          >
            <CheckCircle2
              className={cn(
                status === "active" ? "text-green-500" : "text-yellow-400",
                "h-5 w-5 "
              )}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={handleAction} className="w-full" variant="default">
          {isFree ? (
            "👑 Upgrade to Pro"
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" /> Manage Subscription
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
