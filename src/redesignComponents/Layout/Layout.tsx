import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FC, PropsWithChildren } from "react";

import { useMyOrg } from "@/connections/Organisation";
import { useMyUser } from "@/connections/User";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import LayoutChromeScale from "@/styles/LayoutChromeScale";
import { userHasNurseries } from "@/utils/userAccessUtils";

import { NurseryIcon } from "../foundations/Icons/NavigationSections/NurseryIcon";
import { OpportunitiesIcon } from "../foundations/Icons/NavigationSections/OpportunitiesIcon";
import { OrganizationIcon } from "../foundations/Icons/NavigationSections/OrganizationIcon";
import { ProjectIcon } from "../foundations/Icons/NavigationSections/ProjectIcon";
import { ReportsIcon } from "../foundations/Icons/NavigationSections/ReportsIcon";
import { SiteIcon } from "../foundations/Icons/NavigationSections/SiteIcon";
import Navbar from "../navigation/NavBar/Navbar";
import SideNavigation, { SideNavigationGroup } from "../navigation/NavBar/SideNavigation/SideNavigation";
import { useNavbarData } from "../navigation/NavBar/useNavbarData";
import { LayoutShellProvider, useLayoutShell } from "./LayoutShell.provider";

const LayoutContent: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const profileOpenedFromProject = router.pathname === "/site/[uuid]" && router.query.origin !== "sites";
  const nurseryOpenedFromProject = router.pathname === "/nurserie/[uuid]" && router.query.origin !== "nurseries";
  const { isSidebarCollapseDisabled } = useLayoutShell();
  const [, myOrg] = useMyOrg();
  const [, { user: myUser }] = useMyUser();
  const data = useNavbarData();
  const isAdmin = useIsAdmin();
  const showNurseries = userHasNurseries(myUser);

  const sideNavigationGroups: SideNavigationGroup[] = [
    {
      id: "management",
      links: [
        {
          href: isAdmin
            ? "/admin#/organisation"
            : myOrg?.organisationId
            ? `/organization/${myOrg?.organisationId}`
            : "/",
          icon: <OrganizationIcon boxSize={4} />,
          label: "Organizations"
        },
        {
          href: "/my-projects",
          activePaths: [
            "/my-projects",
            "/project",
            ...(profileOpenedFromProject ? [`/site/${router.query.uuid}`] : []),
            ...(nurseryOpenedFromProject ? [`/nurserie/${router.query.uuid}`] : [])
          ],
          icon: <ProjectIcon boxSize={4} />,
          label: "Projects"
        },
        {
          href: isAdmin ? "/admin#/site" : "/site",
          activePaths: profileOpenedFromProject ? [] : undefined,
          icon: <SiteIcon boxSize={4} />,
          label: "Sites"
        },
        ...(showNurseries
          ? [
              {
                href: isAdmin ? "/admin#/nursery" : "/nurserie",
                activePaths: nurseryOpenedFromProject ? [] : undefined,
                icon: <NurseryIcon boxSize={4} />,
                label: "Nurseries"
              }
            ]
          : []),
        {
          href: isAdmin ? "/admin#/projectReport" : "/reports",
          icon: <ReportsIcon boxSize={4} />,
          label: "Reports"
        },
        {
          href: "/opportunities",
          icon: <OpportunitiesIcon boxSize={4} />,
          label: "Opportunities"
        }
      ]
    }
  ];

  return (
    <Flex height="100vh" width="100%" flexDirection="column">
      <LayoutChromeScale />
      <Box className="shrink-0 [zoom:var(--layout-chrome-zoom,1)]">
        <Navbar mobileMenuGroups={data.isLoggedIn ? sideNavigationGroups : undefined} />
      </Box>
      {data.isLoggedIn ? (
        <Flex className="min-h-0 flex-1 overflow-hidden">
          <Flex display={{ base: "none", md: "flex" }} className="[zoom:var(--layout-chrome-zoom,1)]">
            <SideNavigation
              isCollapsedDisabled={isSidebarCollapseDisabled}
              groups={sideNavigationGroups}
              title="Management Panel"
            />
          </Flex>
          <Flex as="main" className="min-h-0 flex-[1_1_0] flex-col overflow-auto">
            {children}
          </Flex>
        </Flex>
      ) : (
        <Flex as="main" className="min-h-0 flex-1 flex-col overflow-auto">
          {children}
        </Flex>
      )}
    </Flex>
  );
};

const Layout: FC<PropsWithChildren> = ({ children }) => (
  <LayoutShellProvider>
    <LayoutContent>{children}</LayoutContent>
  </LayoutShellProvider>
);

export default Layout;
