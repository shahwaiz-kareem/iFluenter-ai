"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, AlertCircle, CheckCircle2, History } from "lucide-react";
import { useSearchParams } from "next/navigation";

const statusConfig = {
  active: { label: "Active", variant: "default", icon: CheckCircle2 },
  on_trial: { label: "Trialing", variant: "outline", icon: History },
  paused: { label: "Paused", variant: "secondary", icon: AlertCircle },
  free: { label: "Unsubscribed", variant: "outline", icon: AlertCircle },
  past_due: { label: "Past Due", variant: "destructive", icon: AlertCircle },
  unpaid: { label: "Unpaid", variant: "destructive", icon: AlertCircle },
  cancelled: { label: "Cancelled", variant: "secondary", icon: AlertCircle },
  expired: { label: "Expired", variant: "outline", icon: AlertCircle },
};

export default function SubscriptionManager() {
  const params = useSearchParams();
  const status = params.get("status");
  if (!status) return null;
  // console.log(status);
  const config = statusConfig?.[status];
  const Icon = config.icon;

  return (
    <div className="flex flex-col md:flex-row mt-12 justify-center md:items-stretch gap-8 w-full max-w-4xl mx-auto p-6 bg-card rounded-2xl border shadow-sm">
      {/* Left Section: Status Details */}
      <div className="flex-1 flex flex-col justify-between py-2">
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Subscription Status
            </h3>
            <div className="flex items-center gap-3">
              <h2 className="text-4xl font-extrabold tracking-tight capitalize">
                {status.replace("_", " ")}
              </h2>
              <Badge
                variant={config.variant}
                className="h-7 px-3 text-xs font-bold uppercase shadow-sm"
              >
                <Icon className="mr-1.5 h-3.5 w-3.5" /> {config.label}
              </Badge>
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border ${
              status === "active"
                ? "bg-primary/5 border-primary/10"
                : status === "free"
                ? "bg-muted border-border"
                : "bg-destructive/5 border-destructive/10"
            }`}
          >
            <p className="text-sm leading-relaxed font-medium">
              {status === "active" &&
                "Your subscription is healthy and will renew automatically."}
              {status === "past_due" &&
                "Payment failed. Please update your billing info to avoid losing access."}
              {status === "cancelled" &&
                "Plan cancelled. Access remains until the end of your billing cycle."}
              {status === "expired" &&
                "Plan expired. Access remains before start of the expiry date."}
              {status === "unpaid" &&
                "Access restricted due to multiple failed payment attempts."}
              {status === "free" &&
                "Enjoy your limited access. Upgrade to unlock all features."}
            </p>
          </div>
        </div>

        {/* Optional: Add a 'Last Sync' or footer text here */}
        <p className="text-[10px] text-muted-foreground mt-4">
          System last synced: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Right Section: Action Card */}
      <Card className="w-full md:w-[340px] border-none bg-muted/30 shadow-inner overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-bold">
            Billing & Invoices
          </CardTitle>
          <CardDescription className="text-xs">
            Manage payment methods and history.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="group flex items-center gap-4 p-4 rounded-xl bg-background border border-border transition-colors hover:border-primary/50">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div className="text-sm">
              <p className="font-semibold text-foreground leading-none">
                Billing Portal
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Securely via Lemon Squeezy
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full font-bold shadow-sm"
            variant={
              status === "past_due" || status === "free"
                ? "default"
                : "secondary"
            }
            onClick={() =>
              window.open(
                `https://${process.env.NEXT_PUBLIC_LEMONSQUEEZY_STORE}.lemonsqueezy.com/billing`,
                "_blank"
              )
            }
          >
            {status === "free" ? "Upgrade Now" : "Manage Subscription"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
