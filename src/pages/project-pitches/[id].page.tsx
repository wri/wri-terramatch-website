import { useT } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";

import SecondaryTabs from "@/components/elements/Tabs/Secondary/SecondaryTabs";
import Text from "@/components/elements/Text/Text";
import BannerCard from "@/components/extensive/Banner/BannerCard";
import OverviewBanner from "@/components/extensive/Banner/Overview/OverviewBanner";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import { getCountriesOptions } from "@/constants/options/countries";
import { useGetV2OrganisationsUUID, useGetV2ProjectPitchesUUID } from "@/generated/apiComponents";
import { ProjectPitchRead, V2OrganisationRead } from "@/generated/apiSchemas";
import PitchEnvironmentalImpactTab from "@/pages/project-pitches/components/tabs/PitchEnvironmentalImpactTab";
import PitchOverviewTab from "@/pages/project-pitches/components/tabs/PitchOverviewTab";
import PitchSocialImpactTab from "@/pages/project-pitches/components/tabs/PitchSocialImpactTab";
import { formatOptionsList } from "@/utils/options";

const ProjectPitchPage = () => {
  const t = useT();
  const pitchId = useRouter().query.id as string;

  // Queries
  const { data: pitch } = useGetV2ProjectPitchesUUID<{ data: ProjectPitchRead }>({
    // @ts-ignore
    pathParams: {
      uuid: pitchId
    }
  });
  const { data: organization } = useGetV2OrganisationsUUID<{ data: V2OrganisationRead }>(
    {
      // @ts-ignore
      pathParams: {
        uuid: pitch?.data.organisation_id ?? ""
      }
    },
    { enabled: !!pitch?.data.organisation_id }
  );

  return (
    <div>
      {/* @ts-ignore */}
      <OverviewBanner
        bgImage={pitch?.data?.cover?.url || "/images/bg-hero-banner-2.webp"}
        pillText={t("Pitch")}
        iconName={IconNames.MAP_PIN}
        title={pitch?.data.project_name}
        subtitle={`${pitch?.data.project_county_district || ""}, ${formatOptionsList(
          getCountriesOptions(t),
          pitch?.data.project_country || []
        )}`}
      >
        <BannerCard
          title={organization?.data.name}
          subtitle={t("Organization Type: {type}", { type: organization?.data.type })}
          buttonProps={{
            children: t("View Profile"),
            color: "secondary",
            as: Link,
            href: `/organization/${organization?.data.uuid}`
          }}
          iconProps={{
            name: IconNames.TREE,
            width: 35,
            height: 50
          }}
        >
          <Text variant="text-body-900" className="line-clamp-3">
            {t("{yearsOfOperation} Years of operation", {
              yearsOfOperation: organization?.data.relevant_experience_years
            })}
          </Text>
        </BannerCard>
      </OverviewBanner>

      <SecondaryTabs
        containerClassName="max-w-xl"
        tabItems={[
          {
            title: t("Overview"),
            key: "overview",
            body: <PitchOverviewTab pitch={pitch?.data || {}} />
          },
          {
            title: t("Environmental Impact"),
            key: "environmental-impact",
            body: <PitchEnvironmentalImpactTab pitch={pitch?.data!} />
          },
          {
            title: t("Social Impact"),
            key: "social-impact",
            body: <PitchSocialImpactTab pitch={pitch?.data!} />
          }
        ]}
      />
      <PageFooter />
    </div>
  );
};

export default ProjectPitchPage;
