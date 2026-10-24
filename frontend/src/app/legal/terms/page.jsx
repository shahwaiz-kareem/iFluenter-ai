import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function TermsOfService() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0">
          <CardTitle className="text-4xl font-extrabold tracking-tight">
            Terms of Service
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Effective Date: March 18, 2026
          </p>
        </CardHeader>
        <Separator className="my-8" />
        <CardContent className="px-0 space-y-8 text-sm md:text-base leading-7">
          <section>
            <h2 className="text-xl font-bold mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using iFluenter, you agree to be bound by these
              Terms of Service. If you do not agree, please do not use our
              platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">
              2. Description of Service
            </h2>
            <p>
              iFluenter provides AI-powered English speaking practice, featuring
              3D avatar interactions and real-time grammar feedback. Services
              are provided "as-is" and are subject to change as we evolve our
              beta features.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">3. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials. You agree to notify us immediately of any
              unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">
              4. Subscription and Payments
            </h2>
            <p>
              Payments are processed via Lemon Squeezy. By subscribing, you
              authorize us to charge the applicable fees to your provided
              payment method. <strong>All payments are non-refundable</strong>{" "}
              as detailed in our Refund Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">5. Intellectual Property</h2>
            <p>
              The 3D models, AI implementations, and codebase are the exclusive
              property of iFluenter. You may not scrape, reverse-engineer, or
              redistribute our proprietary technology.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-3">6. Demo</h2>
            <p>
              We encourage all users to utilize demo video to evaluate the
              service before upgrading to a paid plan.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
