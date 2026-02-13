import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import SecondaryTabs from "@/components/elements/Tabs/Secondary/SecondaryTabs";
import HeroBanner from "@/components/extensive/Banner/Hero/HeroBanner";
import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useOrganisation } from "@/connections/Organisation";
import { MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { AppStore } from "@/store/store";

import FinancialTabContent from "./components/financial/FinancialTabContent";
import OrganizationHeader from "./components/OrganizationHeader";
import OverviewTabContent from "./components/overview/OverviewTabContent";
import ProjectsTabContent from "./components/projects/ProjectsTabContent";
import TeamTabContent from "./components/team/TeamTabContent";

const OrganizationPage = () => {
  const { query } = useRouter();
  const organizationId = query.id as string;

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
  const coverMedia = useSelector<AppStore, MediaDto[]>(state => {
    if (organisation?.uuid == null || state.api.media == null) return [];

    return Object.values(state.api.media)
      .filter(
        resource =>
          resource.attributes.entityUuid === organisation.uuid &&
          resource.attributes.entityType === "organisations" &&
          resource.attributes.collectionName === "cover"
      )
      .map(resource => resource.attributes)
      .filter((attrs): attrs is MediaDto => Boolean(attrs));
  });

  const coverUrl = useMemo(() => coverMedia[0]?.url ?? null, [coverMedia]);

  return (
    <LoadingContainer loading={!loaded || organizationLoading}>
      <HeroBanner bgImage={coverUrl ?? "/images/bg-hero-banner-2.webp"} className="h-[200px]" />
      <OrganizationHeader organization={organisation ?? undefined} />
      <SecondaryTabs
        containerClassName="max-w-[82vw] px-10 xl:px-0 w-full"
        tabItems={[
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
      <PageFooter />
    </LoadingContainer>
  );
};

export default OrganizationPage;
