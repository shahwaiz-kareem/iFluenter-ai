import Modes from "@/components/dashboard/Modes";
import ProgressOverview from "@/components/dashboard/ProgressOverview";
import TipsWrapper from "@/components/dashboard/TipsWrapper";

const page = () => {
  return (
    <div className="flex max-w-7xl mx-auto flex-1 flex-col gap-8 p-4">
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          Select Mode
        </h2>
        <Modes />
      </section>
      <ProgressOverview />
      <TipsWrapper />
    </div>
  );
};

export default page;
