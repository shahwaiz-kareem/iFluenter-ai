// import localFont from "next/font/local";
import "@/app/globals.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/shared/sidebar/AppSidebar";
import AppHeader from "@/components/shared/AppHeader";
import TopLoader from "@/components/shared/TopLoader";
import { Toaster } from "@/components/ui/toaster";
import NavMain from "@/components/shared/sidebar/NavMain";
import { adminDashboardSidebarItems } from "@/constant/sidebar";
import React from "react";

export const metadata = {
  title: "iFluenter || Admin ",
  description: "Admin dashboard",
};
// Todo: using middleware check if user includes isAdmin cookie
export default function RootLayout({ children }) {
  return (
    <section>
      <SidebarProvider>
        <AppSidebar>
          <NavMain items={adminDashboardSidebarItems} />
        </AppSidebar>
        <SidebarInset>
          <TopLoader color={"hsl(var(--primary))"} />
          <AppHeader />
          <Toaster />
          <main className="mt-16 h-full w-full">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </section>
  );
}
