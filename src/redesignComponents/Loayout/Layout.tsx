import { useT } from "@transifex/react";
import { ComponentProps, useState } from "react";

import { UserIcon } from "../foundations/Icons/Function/UserIcon";
import { DashboardIcon } from "../foundations/Icons/NavigationSections/DashboardIcon";
import { MessagesIcon } from "../foundations/Icons/NavigationSections/MessagesIcon";
import { NotificationIcon } from "../foundations/Icons/NavigationSections/NotificationIcon";
import { NurseryIcon } from "../foundations/Icons/NavigationSections/NurseryIcon";
import { OrganizationIcon } from "../foundations/Icons/NavigationSections/OrganizationIcon";
import { ProgrammeIcon } from "../foundations/Icons/NavigationSections/ProgrammeIcon";
import { ProjectIcon } from "../foundations/Icons/NavigationSections/ProjectIcon";
import { ReportsIcon } from "../foundations/Icons/NavigationSections/ReportsIcon";
import { SiteIcon } from "../foundations/Icons/NavigationSections/SiteIcon";
import Navbar from "../navigation/NavBar/Navbar";
import SideNavigation from "../navigation/NavBar/SideNavigation/SideNavigation";
import InlineMessage from "../status/InlineMessage/InlineMessage";
import { LayoutShellProvider, useLayoutShell } from "./LayoutShell.provider";

type NavGroups = ComponentProps<typeof SideNavigation>["groups"];

// The default admin-review sidebar. Links, labels, and notification counts are design placeholders.
// Exported so pages can reuse this set and augment it (e.g. add a selected feature link).
export const defaultAdminNavGroups: NavGroups = [
  {
    links: [
      { href: "#", icon: <NotificationIcon boxSize={4} />, label: "Notifications" },
      { href: "#", icon: <MessagesIcon boxSize={4} />, label: "Messages" }
    ]
  },
  {
    links: [
      { href: "#", icon: <DashboardIcon boxSize={4} />, label: "Dashboard" },
      { href: "#", icon: <OrganizationIcon boxSize={4} />, label: "Organizations" },
      { href: "#", icon: <ProgrammeIcon boxSize={4} />, label: "Programmes" },
      { href: "#", icon: <ProjectIcon boxSize={4} />, label: "Projects" },
      { href: "#", icon: <SiteIcon boxSize={4} />, label: "Sites" },
      { href: "#", icon: <NurseryIcon boxSize={4} />, label: "Nurseries" },
      { href: "#", icon: <ReportsIcon boxSize={4} />, label: "Reports" },
      { href: "#", icon: <UserIcon boxSize={4} />, label: "Users" }
    ]
  }
];

interface LayoutProps {
  children: React.ReactNode;
  // Override the sidebar groups (defaults to the shared admin-review placeholders). A link whose
  // href matches the current path renders as selected.
  navGroups?: NavGroups;
  navTitle?: string;
  // Initial collapsed state of the side nav (default collapsed). Pass false to open it expanded.
  collapsed?: boolean;
}

function LayoutContent({
  children,
  navGroups = defaultAdminNavGroups,
  navTitle = "Management Panel",
  collapsed = true
}: LayoutProps) {
  const [isWarningVisible, setIsWarningVisible] = useState(true);
  const { isSidebarCollapseDisabled } = useLayoutShell();
  const t = useT();

  return (
    <div className="flex h-screen w-full flex-col">
      <header className="fixed inset-x-0 top-0 z-50 h-[3rem]">
        <Navbar />
      </header>
      <div className="flex min-h-0 flex-1 overflow-hidden pt-[3rem]">
        <SideNavigation
          collapsed={collapsed}
          isCollapsedDisabled={isSidebarCollapseDisabled}
          groups={navGroups}
          title={navTitle}
        />
        <main className="flex min-h-0 flex-[1_1_0] flex-col overflow-auto">
          {isWarningVisible && (
            <InlineMessage
              className="!w-full"
              variant="warning"
              label={t("We are improving TerraMatch")}
              caption={t(
                "You may notice some pages look different while we update the design to make your experience better."
              )}
              size="full-width"
              actionLabel={t("Close")}
              onActionClick={() => setIsWarningVisible(false)}
              isButtonRight={true}
            />
          )}
          {children}
        </main>
      </div>
    </div>
  );
}

export default function Layout({ children, navGroups, navTitle, collapsed }: LayoutProps) {
  return (
    <LayoutShellProvider>
      <LayoutContent navGroups={navGroups} navTitle={navTitle} collapsed={collapsed}>
        {children}
      </LayoutContent>
    </LayoutShellProvider>
  );
}
