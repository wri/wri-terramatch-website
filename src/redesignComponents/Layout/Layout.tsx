import { Box, Flex } from "@chakra-ui/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { FC, Fragment, PropsWithChildren } from "react";

import { useMyOrg } from "@/connections/Organisation";
import { useMyUser } from "@/connections/User";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import LayoutChromeScale from "@/styles/LayoutChromeScale";
import { getSidebarCollapsed, setSidebarCollapsed } from "@/utils/sidebarCollapsedState";
import { userHasNurseries } from "@/utils/userAccessUtils";

import { NurseryIcon } from "../foundations/Icons/NavigationSections/NurseryIcon";
import { OpportunitiesIcon } from "../foundations/Icons/NavigationSections/OpportunitiesIcon";
import { OrganizationIcon } from "../foundations/Icons/NavigationSections/OrganizationIcon";
import { ProjectIcon } from "../foundations/Icons/NavigationSections/ProjectIcon";
import { ReportsIcon } from "../foundations/Icons/NavigationSections/ReportsIcon";
import { SiteIcon } from "../foundations/Icons/NavigationSections/SiteIcon";
import Footer from "../navigation/Footer/Footer";
import Navbar from "../navigation/NavBar/Navbar";
import SideNavigation, { SideNavigationGroup } from "../navigation/NavBar/SideNavigation/SideNavigation";
import { useNavbarData } from "../navigation/NavBar/useNavbarData";
import { useLayoutShell } from "./LayoutShell.provider";

const FOOTER_CLASS_NAME = "mt-auto shrink-0 [zoom:var(--layout-chrome-zoom,1)]";

const LayoutContent: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  // Breadcrumbs of a site / nursery profile start at Projects unless the profile was opened from its own list,
  // so the side menu must highlight the same first level.
  const profileOpenedFromProject = router.pathname === "/site/[uuid]" && router.query.origin !== "sites";
  const nurseryOpenedFromProject = router.pathname === "/nursery/[uuid]" && router.query.origin !== "nurseries";
  const { isSidebarCollapseDisabled, pageResetKey } = useLayoutShell();
  const [, myOrg] = useMyOrg();
  const [, { user: myUser }] = useMyUser();
  const data = useNavbarData();
  const isAdmin = useIsAdmin();
  const showNurseries = userHasNurseries(myUser);
  const showLoggedInFooter = router.pathname === "/home";

  const sideNavigationGroups: SideNavigationGroup[] = [
    {
      id: "management",
      links: [
        {
          href: isAdmin
            ? "/admin#/organisation"
            : myOrg?.organisationId != null
            ? `/organization/${myOrg.organisationId}`
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
            ...(nurseryOpenedFromProject ? [`/nursery/${router.query.uuid}`] : [])
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
                href: isAdmin ? "/admin#/nursery" : "/nursery",
                activePaths: nurseryOpenedFromProject ? [] : undefined,
                icon: <NurseryIcon boxSize={4} />,
                label: "Nurseries"
              }
            ]
          : []),
        {
          href: isAdmin ? "/admin#/projectReport" : "/reports?view=all",
          activePaths: isAdmin ? undefined : ["/reports"],
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
        <Box className="grid min-h-0 flex-1 grid-cols-[auto_minmax(0,1fr)] grid-rows-[1fr_auto] overflow-auto [container-type:size]">
          <Flex
            display={{ base: "none", md: "flex" }}
            className="sticky top-0 col-start-1 row-span-2 row-start-1 h-[100cqh] self-start"
          >
            <Flex className="[zoom:var(--layout-chrome-zoom,1)]">
              <SideNavigation
                collapsed={getSidebarCollapsed()}
                onCollapsedChange={setSidebarCollapsed}
                isCollapsedDisabled={isSidebarCollapseDisabled}
                groups={sideNavigationGroups}
                title="Management Panel"
              />
            </Flex>
          </Flex>
          <Flex
            as="main"
            className={classNames(
              "col-start-2 row-start-1 min-w-0 flex-col",
              !showLoggedInFooter && "min-h-0 overflow-auto"
            )}
          >
            <Fragment key={pageResetKey}>{children}</Fragment>
          </Flex>
          {showLoggedInFooter && (
            <Footer className={classNames(FOOTER_CLASS_NAME, "relative z-10 col-span-2 col-start-1 row-start-2")} />
          )}
        </Box>
      ) : (
        <Flex as="main" className="min-h-0 flex-1 flex-col overflow-auto">
          <Fragment key={pageResetKey}>{children}</Fragment>
          <Footer className={FOOTER_CLASS_NAME} />
        </Flex>
      )}
    </Flex>
  );
};

const Layout: FC<PropsWithChildren> = ({ children }) => <LayoutContent>{children}</LayoutContent>;

export default Layout;
