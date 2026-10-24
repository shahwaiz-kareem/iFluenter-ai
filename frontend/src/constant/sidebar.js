import {
  LayoutDashboard,
  LayoutTemplate,
  LineChart,
  User2,
  Users,
  ChartPie,
} from "lucide-react";

export const dashboardSidebarItems = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    href: "/dashboard",
  },

  {
    title: "Progress",
    icon: <LineChart size={20} />,
    href: "/dashboard/progress",
  },

  {
    title: "Account",
    icon: <User2 size={20} />,
    href: "/dashboard/account",
  },
];
export const adminDashboardSidebarItems = [
  {
    title: "Statistics",
    icon: <ChartPie size={20} />,
    href: "/admin",
  },

  {
    title: "Users",
    icon: <Users size={20} />,
    href: "/admin/users",
  },

  {
    title: "Avatars",
    icon: <User2 size={20} />,
    href: "/admin/avatars",
  },
  {
    title: "Environments",
    icon: <LayoutTemplate size={20} />,
    href: "/admin/envs",
  },
];
