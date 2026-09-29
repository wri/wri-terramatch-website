import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactElement, useCallback, useMemo } from "react";

import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useOrganisation } from "@/connections/Organisation";
import Banner from "@/redesignComponents/content/Banner/Banner";
import { OrganizationIcon } from "@/redesignComponents/foundations/Icons";
import ResponsiveTypography from "@/styles/ResponsiveTypography";

import FinancialTabContent from "./components/financial/FinancialTabContent";
import OrganizationHeader from "./components/OrganizationHeader";
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

  const tabItems = useMemo<TabItem[]>(
    () => [
      {
        key: "overview",
        title: t("Overview"),
        body: <OverviewTabContent organization={organisation ?? undefined} />
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
    [organisation, t]
  );

  const activeTab = tabItems.some(tab => tab.key === currentTab) ? currentTab : "overview";

  return (
    <LoadingContainer loading={!loaded || organizationLoading}>
      <ResponsiveTypography />
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <div className="contents [&>div:last-child]:!top-[2.5625rem] mobile:[&>div:last-child]:!top-[4.0625rem]">
        <Banner
          breadcrumbs={[
            {
              label: t("Organization"),
              link: `/organization/${organizationId}`,
              icon: <OrganizationIcon className="!text-theme-primary-900" />
            }
          ]}
          suffix={<span />}
          toolbar={{
            tabBar: {
              tabs: tabItems.map(tab => ({ value: tab.key, label: tab.title })),
              defaultValue: activeTab,
              onTabClick: navigateToTab
            }
          }}
        >
          <OrganizationHeader organization={organisation ?? undefined} />
        </Banner>
      </div>

      <div className="flex flex-1">{tabItems.find(tab => tab.key === activeTab)?.body}</div>
      <PageFooter />
    </LoadingContainer>
  );
};

export default OrganizationPage;
