import { Separator } from "../ui/separator";
import { ChartDisplay } from "./ChartDisplay";
import StatsDisplay from "./StatsDisplay";

const ProgressStatsContainer = ({ data }) => {
  const { todayData, thisWeekData, lastWeekData, fluencyScoreData } = data;

  return (
    <>
      <h3 className=" text-xl font-semibold py-2 tracking-tight">
        Speaking Analysis
      </h3>
      <StatsDisplay data={todayData} progressOf={"Today"} />
      <Separator />
      <StatsDisplay data={thisWeekData} progressOf={"This week"} />
      <ChartDisplay data={fluencyScoreData} />
      <Separator />
      <StatsDisplay data={lastWeekData} progressOf={"Last week"} />
    </>
  );
};

export default ProgressStatsContainer;
