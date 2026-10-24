// import Streaks from "@/components/dashboard/Streaks";
"use client";
import ProgressStatsContainer from "@/components/progress/ProgressStatsContainer";
import SessionProgress from "@/components/progress/SessionProgress";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Progress = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progressData, setProgressData] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const progressRes = await fetch(`/api/progress/get-stats`, {
          method: "GET",
          credentials: "include",
          signal,
        });
        // if (!progressRes.ok) return router.push("/sign-in");
        const progressData = await progressRes.json();

        setProgressData(progressData);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    return () => controller.abort();
  }, []);

  return (
    <section className="pt-2 pb-4 flex flex-col gap-4  px-4 md:px-6 lg:max-w-screen-lg">
      <h2 className="text-xl  font-bold mt-4">Progress 📊 </h2>
      {isLoading ? (
        <div className="w-full h-full flex items-center mt-8 justify-center">
          <Loader2 className="animate-spin" size={30} />
        </div>
      ) : (
        <>
          <SessionProgress data={progressData.chatSessionData} />
          <Separator />
          <ProgressStatsContainer data={progressData} />
          <div className="text-yellow-500 border-yellow-500 none" />
          <div className="text-green-500 border-green-500 none" />
        </>
      )}
    </section>
  );
};

export default Progress;
