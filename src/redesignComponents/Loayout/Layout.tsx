import { useT } from "@transifex/react";
import { useState } from "react";

import { UserIcon } from "../foundations/Icons/Function/UserIcon";
import { DashboardIcon } from "../foundations/Icons/NavigationSections/DashboardIcon";
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

// Temporary admin-review shell: sidebar links, labels, and notification counts are design placeholders.
function LayoutContent({ children }: { children: React.ReactNode }) {
  const [isWarningVisible, setIsWarningVisible] = useState(true);
  const { isSidebarCollapseDisabled } = useLayoutShell();
  const t = useT();

  return (
    <div className="flex h-screen w-full flex-col">
      <header className="fixed inset-x-0 top-0 z-50 h-[3rem]">
        <Navbar />
      </header>
      <div className="flex min-h-0 overflow-hidden pt-[3rem]">
        <SideNavigation
          collapsed={true}
          isCollapsedDisabled={isSidebarCollapseDisabled}
          groups={[
            {
              links: [
                {
                  href: "#",
                  icon: <DashboardIcon boxSize={4} />,
                  label: "Dashboard"
                },
                {
                  href: "#",
                  icon: <OrganizationIcon boxSize={4} />,
                  label: "Organizations"
                },
                {
                  href: "#",
                  icon: <ProgrammeIcon boxSize={4} />,
                  label: "Programmes"
                },
                {
                  href: "#",
                  icon: <ProjectIcon boxSize={4} />,
                  label: "Projects"
                },
                {
                  href: "#",
                  icon: <SiteIcon boxSize={4} />,
                  label: "Sites"
                },
                {
                  href: "#",
                  icon: <NurseryIcon boxSize={4} />,
                  label: "Nurseries"
                },
                {
                  href: "#",
                  icon: <ReportsIcon boxSize={4} />,
                  label: "Reports"
                },
                {
                  href: "#",
                  icon: <UserIcon boxSize={4} />,
                  label: "Users"
                }
              ]
            }
          ]}
          title="Management Panel"
        />
        <main className="flex min-h-0 flex-[1_1_0] flex-col overflow-auto">
          {isWarningVisible && (
            <InlineMessage
              className="!w-full"
              variant="warning"
              label={t("We are Improving TerraMatch")}
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

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutShellProvider>
      <LayoutContent>{children}</LayoutContent>
    </LayoutShellProvider>
  );
}
