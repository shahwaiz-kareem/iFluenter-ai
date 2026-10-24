import { tipsData } from "@/constant/tips";
import Tips from "./Tips";

// export const revalidate = 3; // 24 hours
export const revalidate = 86400; // 24 hours

const TipsWrapper = () => {
  const today = new Date().toISOString().split("T")[0];

  const getDailyTips = (seed, count) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }

    const selected = [];
    for (let i = 0; i < count; i++) {
      const index = Math.abs((hash + i) % tipsData.length);
      selected.push(tipsData[index]);
    }
    return selected;
  };

  const randomTips = getDailyTips(today, 5);

  return <Tips randomTips={randomTips} />;
};

export default TipsWrapper;
