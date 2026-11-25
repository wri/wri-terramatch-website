import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { ReactElement, useCallback, useMemo } from "react";

import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useOrganisation } from "@/connections/Organisation";
import { getReportsIndexUrl } from "@/pages/reports/reportIndex.utils";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { OrganizationIcon } from "@/redesignComponents/foundations/Icons";
import ResponsiveTypography from "@/styles/ResponsiveTypography";

import OrganizationDetailsTabContent from "./components/details/OrganizationDetailsTabContent";
import FinancialTabContent from "./components/financial/FinancialTabContent";
import OrganizationBanner from "./components/OrganizationBanner";
import OverviewTabContent from "./components/overview/OverviewTabContent";
import ProjectsTabContent from "./components/projects/ProjectsTabContent";
import TeamTabContent from "./components/team/TeamTabContent";

type TabItem = {
  key: string;
  title: string;
  body: ReactElement;
};

const OrganizationPage = () => {
  const router = useRouter();
  const organizationId = router.query.id as string;
  const t = useT();

  const [loaded, { data: organisation, isLoading: organizationLoading }] = useOrganisation({
    id: organizationId,
    sideloads: [
      "media",
      "financialCollection",
      "financialReport",
      "fundingTypes",
      "leadership",
      "ownershipStakes",
      "treeSpeciesHistorical"
    ]
  });

  const currentTab = (router.query.tab as string) ?? "overview";
  const pageTitle = organisation?.name?.trim() ?? t("My Organization");

  const navigateToTab = useCallback(
    (tab: string) => {
      router.push(`/organization/${organizationId}?tab=${tab}`, undefined, { shallow: true });
    },
    [organizationId, router]
  );

  const gotoTeamMembers = useCallback(() => navigateToTab("team"), [navigateToTab]);

  const goToFinancialReports = useCallback(
    () =>
      router.push(
        getReportsIndexUrl("organisation", organizationId, {
          tab: "additional-reports",
          reportType: "financial-report"
        })
      ),
    [organizationId, router]
  );

  const goToProjects = useCallback(() => router.push("/my-projects"), [router]);

  const tabItems = useMemo<TabItem[]>(
    () => [
      {
        key: "overview",
        title: t("Overview"),
        body: <OverviewTabContent organization={organisation ?? undefined} navigateToTab={navigateToTab} />
      },
      {
        key: "organization_details",
        title: t("Organization Details"),
        body: <OrganizationDetailsTabContent organization={organisation ?? undefined} />
      },
      {
        key: "financial_information",
        title: t("Financial Information"),
        body: <FinancialTabContent organization={organisation ?? undefined} />
      },
      {
        key: "projects",
        title: t("Projects"),
        body: <ProjectsTabContent />
      },
      {
        key: "team",
        title: t("Team Members"),
        body: <TeamTabContent />
      }
    ],
    [navigateToTab, organisation, t]
  );

  const activeTab = tabItems.some(tab => tab.key === currentTab) ? currentTab : "overview";

  return (
    <LoadingContainer loading={!loaded || organizationLoading}>
      <ResponsiveTypography />
      <title>{pageTitle}</title>

      <div className="contents [&>div:last-child]:!top-[2.5625rem] mobile:[&>div:last-child]:!top-[4.0625rem]">
        <OrganizationBanner
          organization={organisation ?? undefined}
          gotoTeamMembers={gotoTeamMembers}
          breadcrumbs={[
            {
              label: t("Organization"),
              link: `/organization/${organizationId}`,
              icon: <OrganizationIcon className="!text-theme-primary-900" />
            }
          ]}
          suffix={
            <Flex alignItems="center" gap={1.5}>
              <Button
                variant="borderless"
                size="small"
                className="underline underline-offset-2"
                onClick={goToFinancialReports}
              >
                {t("Financial Reports")}
              </Button>
              <Text as="span" textStyle="300" color="neutral.300">
                |
              </Text>
              <Button variant="borderless" size="small" className="underline underline-offset-2" onClick={goToProjects}>
                {t("Projects")}
              </Button>
            </Flex>
          }
          toolbar={{
            tabBar: {
              tabs: tabItems.map(tab => ({ value: tab.key, label: tab.title })),
              defaultValue: activeTab,
              onTabClick: navigateToTab
            }
          }}
        />
      </div>

      <div className="flex flex-1">{tabItems.find(tab => tab.key === activeTab)?.body}</div>
    </LoadingContainer>
  );
};

export default OrganizationPage;
