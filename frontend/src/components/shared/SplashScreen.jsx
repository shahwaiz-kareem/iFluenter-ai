import Image from "next/image";

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      <div className="flex flex-col items-center space-y-6 max-w-xs w-full px-4">
        <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg ">
          <Image
            src={"/logo.jpg"}
            className="w-full h-full rounded-lg"
            height={200}
            width={200}
            priority
            alt="logo"
          />
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">iFluenter</h1>
          <p className="text-base text-muted-foreground animate-pulse">
            Fluency in a higher dimension
          </p>
        </div>

        {/* <Loader2 size={30} className="animate-spin" /> */}
        {/* <Progress value={progress} /> */}
      </div>
    </div>
  );
};

export default SplashScreen;
