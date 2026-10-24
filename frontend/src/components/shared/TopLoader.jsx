"use client";

import NextTopLoader from "nextjs-toploader";

const TopLoader = ({ height, speed }) => {
  return (
    <NextTopLoader
      color={"hsl(var(--primary))"}
      height={height}
      showSpinner={false}
      speed={speed}
    />
  );
};

export default TopLoader;
