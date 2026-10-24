import OnboardingForm from "@/components/forms/Onboarding";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "iFluenter || Onboarding ",
  description: "onboarding page for iFluenter.",
};

const Onboarding = () => {
  return (
    <div className="flex h- w-full flex-col my-12  self-start px-2 sm:px-6">
      <h2 className="text-2xl font-extrabold text-white">Onboarding</h2>
      <p className=" mt-1 text-sm text-slate-100 font-light">
        Customize your profile to get more personalized experience
      </p>
      <section className="w-full h-full mt-8">
        <Card className="w-full h-full shadow-xl mx-auto">
          <CardContent className="w-full h-full p-4 sm:p-8">
            <OnboardingForm />
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Onboarding;
