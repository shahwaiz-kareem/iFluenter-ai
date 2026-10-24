"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavMain({ items }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem className="pl-1" key={item.title}>
            <SidebarMenuButton
              asChild
              className={`w-full my-2 flex items-center gap-3 px-4 py-5 rounded-lg  transition-colors duration-200  ${
                item.href === pathname
                  ? "bg-primary hover:bg-primary text-primary-foreground"
                  : ""
              }`}
            >
              <Link
                onClick={() => setOpenMobile(false)}
                href={item.href}
                className="text-gray-200 "
              >
                <span>{item.icon}</span>
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
