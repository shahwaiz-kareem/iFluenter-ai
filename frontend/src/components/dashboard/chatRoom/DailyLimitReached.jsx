import { Button } from "@/components/ui/button";
import { userContext } from "@/context/UserProvider";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";
const DailyLimitReached = () => {
  const { userData } = useContext(userContext);
  const isFreeUser = userData.subscriptionStatus === "free";
  return (
    <div className="flex items-center mb-16 flex-col gap-4 justify-center h-full w-full">
      <header className="text-center space-y-4  w-full">
        <div className="mx-auto w-16 h-16 flex items-center text-red-500 justify-center rounded-full bg-red-100">
          <TriangleAlert size={30} />
        </div>
        <h2 className="text-3xl font-extrabold ">Daily Limit Reached</h2>
      </header>

      <section className="text-center w-full flex items-center justify-center flex-col gap-2">
        <p className="text-primary/80 ">
          It looks like you've reached your daily usage limit.
        </p>

        <p className="text-lg mt-4 font-medium text-primary">
          Get Back Tomorrow!
        </p>
      </section>

      {isFreeUser && (
        <footer className="space-y-4 w-[90%]">
          <div className="relative flex items-center justify-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-sm text-gray-500 font-medium uppercase">
              OR
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <Button asChild className="mx-auto w-full" type="button">
            <Link
              href={
                isFreeUser
                  ? "/pricing"
                  : `https://${process.env.NEXT_PUBLIC_LEMONSQUEEZY_STORE}.lemonsqueezy.com/billing
`
              }
              target={isFreeUser ? "" : "_blank"}
            >
              {isFreeUser ? "👑 Upgrade to pro" : "🚀 Activate Pro Plan"}
            </Link>
          </Button>

          <p className="text-xs text-center text-gray-400">
            Get **unlimited** access and premium features.
          </p>
        </footer>
      )}
    </div>
  );
};

export default DailyLimitReached;
