import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import InfoBanner from "./InfoBanner";

const AppHeader = () => {
  return (
    <header className="flex h-16 shrink-0 items-center bg-background gap-2 fixed top-0 w-full border-b px-4 z-50">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="h-full w-full bg-background  "></div>
      {/* <InfoBanner content={"hi"} /> */}
    </header>
  );
};

export default AppHeader;
