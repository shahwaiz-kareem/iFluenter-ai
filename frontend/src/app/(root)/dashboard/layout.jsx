// import localFont from "next/font/local";
import "@/app/globals.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/shared/sidebar/AppSidebar";
import AppHeader from "@/components/shared/AppHeader";
import TopLoader from "@/components/shared/TopLoader";
import { Toaster } from "@/components/ui/toaster";
import localFont from "next/font/local";
import { dashboardSidebarItems } from "@/constant/sidebar";
import NavMain from "@/components/shared/sidebar/NavMain";
import UserProvider from "@/context/UserProvider";
import LogoutConfirm from "@/components/shared/LogoutConfirm";

export const metadata = {
  title: "iFluenter",
  description: "iFluenter the place to charge your speaking skills.",
};
export const viewport = {
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }) {
  return (
    <section>
      <UserProvider>
        <SidebarProvider>
          <AppSidebar showLogoutTrigger={true}>
            <NavMain items={dashboardSidebarItems} />
          </AppSidebar>
          <SidebarInset>
            <TopLoader color={"hsl(var(--primary))"} />
            <AppHeader />
            <Toaster />
            <main className="mt-16 h-full w-full">{children}</main>
          </SidebarInset>
        </SidebarProvider>
        <LogoutConfirm />
      </UserProvider>
    </section>
  );
}
