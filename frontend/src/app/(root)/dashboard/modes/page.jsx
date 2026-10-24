import ModesCard from "@/components/dashboard/ModesCard";
import { modesList } from "@/constant/modes";

const Page = () => {
  return (
    <div className="flex  max-w-7xl mx-auto flex-col gap-4 justify-center w-full px-4">
      <h2 className="text-xl dark:text-white font-bold mt-4">Modes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2  gap-6 ">
        {modesList.map((mode, index) => (
          <ModesCard
            key={index}
            title={mode.name}
            description={mode.description}
            imgSrc={mode.imgSrc}
            link={mode.href}
          />
        ))}
      </div>
      <div className="flex items-center justify-center w-full">
        <p className="font-light text-sm text-gray-300">More Coming Soon...</p>
      </div>
    </div>
  );
};

export default Page;
