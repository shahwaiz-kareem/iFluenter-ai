import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export default function RefundPolicy() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0">
          <CardTitle className="text-4xl font-extrabold tracking-tight">
            Refund Policy
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Last Updated: March 18, 2026
          </p>
        </CardHeader>
        <Separator className="my-8" />
        <CardContent className="px-0 space-y-8">
          <Alert variant="default" className="bg-muted/50">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Important Notice</AlertTitle>
            <AlertDescription>
              Please read this policy carefully before making a purchase.
            </AlertDescription>
          </Alert>

          <section className="space-y-4">
            <h2 className="text-xl font-bold">1. No Refunds</h2>
            <p className="text-muted-foreground leading-7">
              Due to the digital nature of our AI-powered services and the
              immediate access provided to 3D avatar interactions and processing
              credits, <strong>iFluenter does not offer refunds</strong> for any
              purchases, including monthly or yearly subscriptions.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold">2. Subscription Cancellation</h2>
            <p className="text-muted-foreground leading-7">
              You may cancel your subscription at any time through the Lemon
              Squeezy billing portal. Upon cancellation, you will retain access
              to premium features until the end of your current billing cycle.
              No pro-rated refunds are provided for unused time.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold">3. Exceptions</h2>
            <p className="text-muted-foreground leading-7">
              Refunds will only be considered in cases of documented technical
              errors that prevented access to the service for more than 48
              hours, or as required by local law.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
