import { useT } from "@transifex/react";
import { useRouter } from "next/router";

import SecondaryTabs from "@/components/elements/Tabs/Secondary/SecondaryTabs";
import HeroBanner from "@/components/extensive/Banner/Hero/HeroBanner";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useGetV2OrganisationsUUID } from "@/generated/apiComponents";
import { V2OrganisationRead } from "@/generated/apiSchemas";

import FinancialTabContent from "./components/financial/FinancialTabContent";
import OrganizationHeader from "./components/OrganizationHeader";
import OverviewTabContent from "./components/overview/OverviewTabContent";
import PitchesTabContent from "./components/pitches/PitchesTabContent";
import ProjectsTabContent from "./components/projects/ProjectsTabContent";
import TeamTabContent from "./components/team/TeamTabContent";

const OrganizationPage = () => {
  const { query } = useRouter();
  const organizationId = query.id as string;

  const t = useT();
  const { data: organizationData, isLoading: organizationLoading } = useGetV2OrganisationsUUID<{
    data: V2OrganisationRead;
  }>({
    pathParams: {
      uuid: organizationId
    }
  });

  return (
    <LoadingContainer loading={organizationLoading}>
      <HeroBanner
        bgImage={organizationData?.data.cover?.url ?? "/images/bg-hero-banner-2.webp"}
        className="h-[200px]"
      />
      <OrganizationHeader organization={organizationData?.data} />
      <SecondaryTabs
        containerClassName="max-w-4xl"
        tabItems={[
          {
            key: "overview",
            title: t("Overview"),
            body: <OverviewTabContent organization={organizationData?.data} />
          },
          {
            key: "financial_information",
            title: t("Financial Information"),
            body: <FinancialTabContent organization={organizationData?.data} />
          },
          // Todo: to add these sections back when asked!
          // {
          //   key: "mel_capacity",
          //   title: t("MEL Capacity"),
          //   body: <MelCapacityTabContent organization={organizationData?.data} />
          // },
          // {
          //   key: "social_impact",
          //   title: t("Social Impact and Integration"),
          //   body: <SocialImpactTabContent organization={organizationData?.data} />
          // },
          {
            key: "pitches",
            title: t("Pitches"),
            body: <PitchesTabContent />
          },
          {
            key: "projects",
            title: t("Projects"),
            body: <ProjectsTabContent />
          },
          {
            key: "team",
            title: t("Meet the Team"),
            body: <TeamTabContent />
          }
        ]}
      />
    </LoadingContainer>
  );
};

export default OrganizationPage;
