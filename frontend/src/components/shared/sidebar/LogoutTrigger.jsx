"use-client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { userContext } from "@/context/UserProvider";
import { LogOut } from "lucide-react";
import { useContext } from "react";

const LogoutTrigger = () => {
  const { setOpenLogoutModal } = useContext(userContext);

  const triggerLogout = () => {
    setOpenLogoutModal(true);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem className="pl-1">
        <SidebarMenuButton
          onClick={triggerLogout}
          className={`w-full my-2 flex items-center gap-3 px-4 py-5 rounded-lg hover:cursor-pointer  transition-colors duration-200 `}
        >
          <LogOut />
          Logout
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default LogoutTrigger;
