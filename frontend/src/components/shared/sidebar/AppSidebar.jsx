"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import SidebarHeaderContent from "./SidebarHeaderContent";
import LogoutTrigger from "./LogoutTrigger";

export default function AppSidebar({ showLogoutTrigger, ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarHeaderContent />
      </SidebarHeader>
      <SidebarContent>{props.children}</SidebarContent>
      {showLogoutTrigger && (
        <SidebarFooter>
          <LogoutTrigger />
        </SidebarFooter>
      )}
      <SidebarRail />
    </Sidebar>
  );
}
