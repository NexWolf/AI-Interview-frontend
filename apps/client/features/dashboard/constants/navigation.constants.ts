import {
  LayoutDashboard,
  Briefcase,
  User,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  labelKey:
    | "dashboard.nav.dashboard"
    | "dashboard.nav.myInterviews"
    | "dashboard.nav.profile"
    | "dashboard.nav.settings";
  icon: LucideIcon;
  exact?: boolean;
}

export const DASHBOARD_NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    labelKey: "dashboard.nav.dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/dashboard/interviewDetails",
    labelKey: "dashboard.nav.myInterviews",
    icon: Briefcase,
  },
  {
    href: "/dashboard/profile",
    labelKey: "dashboard.nav.profile",
    icon: User,
  },
  {
    href: "/dashboard/setting",
    labelKey: "dashboard.nav.settings",
    icon: Settings,
  },
];
