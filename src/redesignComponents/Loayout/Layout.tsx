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

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Navbar fixed at top — h-16 (64 px) matches the logo + default Chakra padding */}
      <header className="fixed inset-x-0 top-0 z-50 h-[3rem]">
        <Navbar />
      </header>

      {/* Push content below the fixed navbar */}
      <div className="flex flex-1 pt-[3rem]">
        <SideNavigation
          groups={[
            {
              links: [
                {
                  href: "/?path=/docs/redesign-components-navigation-sidenavigation-sidenavigation--docs",
                  icon: <NotificationIcon boxSize={4} />,
                  label: "Notifications",
                  notificationValue: 20
                },
                {
                  href: "/?path=/docs/redesign-components-navigation-sidenavigation-sidenavigation--docs",
                  icon: <MessagesIcon boxSize={4} />,
                  label: "Messages",
                  notificationValue: 20
                }
              ]
            },
            {
              links: [
                {
                  href: "/?path=/docs/redesign-components-navigation-sidenavigation-sidenavigation--docs",
                  icon: <DashboardIcon boxSize={4} />,
                  label: "Dashboard"
                },
                {
                  href: "/?path=/docs/redesign-components-navigation-sidenavigation-sidenavigation--docs",
                  icon: <OrganizationIcon boxSize={4} />,
                  label: "Organizations"
                },
                {
                  href: "/?path=/docs/redesign-components-navigation-sidenavigation-sidenavigation--docs",
                  icon: <ProgrammeIcon boxSize={4} />,
                  label: "Programmes"
                },
                {
                  href: "/?path=/docs/redesign-components-navigation-sidenavigation-sidenavigation--docs",
                  icon: <ProjectIcon boxSize={4} />,
                  label: "Projects"
                },
                {
                  href: "/?path=/docs/redesign-components-navigation-sidenavigation-sidenavigation--docs",
                  icon: <SiteIcon boxSize={4} />,
                  label: "Sites"
                },
                {
                  href: "/?path=/docs/redesign-components-navigation-sidenavigation-sidenavigation--docs",
                  icon: <NurseryIcon boxSize={4} />,
                  label: "Nurseries"
                },
                {
                  href: "/?path=/docs/redesign-components-navigation-sidenavigation-sidenavigation--docs",
                  icon: <ReportsIcon boxSize={4} />,
                  label: "Reports"
                },
                {
                  href: "/?path=/docs/redesign-components-navigation-sidenavigation-sidenavigation--docs",
                  icon: <UserIcon boxSize={4} />,
                  label: "Users"
                }
              ]
            }
          ]}
          title="Management Panel"
        />
        {/* overflow-x-hidden prevents horizontal blowout on mobile */}
        <main className="flex min-w-0 flex-1 flex-col overflow-x-auto overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
