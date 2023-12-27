import { useT } from "@transifex/react";
import dynamic from "next/dynamic";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import TextRow from "@/components/extensive/TextRow/TextRow";
import { getRestorationInterventionTypeOptions } from "@/constants/options/restorationInterventionTypes";
import { V2OrganisationRead } from "@/generated/apiSchemas";

type PastRestorationExperienceProps = {
  organization?: V2OrganisationRead;
};

const Map = dynamic(() => import("@/components/elements/Map-mapbox/Map"), { ssr: false });

const PastRestorationExperience = ({ organization }: PastRestorationExperienceProps) => {
  const t = useT();

  let projectBoundary: any;
  try {
    // @ts-expect-error
    projectBoundary = JSON.parse(organization?.historic_monitoring_geojson);
  } catch (e) {
    projectBoundary = undefined;
  }

  return (
    <section className="my-10 rounded-lg bg-neutral-150  p-8">
      <Text variant="text-heading-300">{t("Environmental Impact")}</Text>
      <div className="mt-10 flex flex-col gap-3">
        <TextRow
          name={t("Years of relevant restoration experience:")}
          value={organization?.relevant_experience_years}
          nameClassName="w-1/3"
        />
        <TextRow name={t("Total Hectares Restored:")} value={organization?.ha_restored_total} nameClassName="w-1/3" />
        <TextRow
          name={t("Hectares Restored in the Last 3 Years:")}
          value={organization?.ha_restored_3year}
          nameClassName="w-1/3"
        />
        <TextRow name={t("Total Trees Grown:")} value={organization?.trees_grown_total} nameClassName="w-1/3" />
        <TextRow
          name={t("Total Trees Grown in the Last 3 Years:")}
          value={organization?.trees_grown_3year}
          nameClassName="w-1/3"
        />
        <TextRow
          name={t("Tree Maintenance and After Care:")}
          value={organization?.tree_care_approach}
          nameClassName="w-1/3"
        />
        <TextRow
          name={t("Average Tree Survival Rate:")}
          value={organization?.avg_tree_survival_rate}
          nameClassName="w-1/3"
        />
        <TextRow
          name={t("What strategies have you used to maintain the trees that you have grown?:")}
          value={organization?.tree_maintenance_aftercare_approach}
          nameClassName="w-1/3"
        />
        <TextRow
          name={t(
            "In which areas of this country have you worked in the past, and what are their characteristics of these landscapes?:"
          )}
          value={organization?.restored_areas_description}
          nameClassName="w-1/3"
        />
        <TextRow
          name={t("How have you monitored and evaluated the progress of your past projects?:")}
          value={organization?.monitoring_evaluation_experience}
          nameClassName="w-1/3"
        />
        <TextRow
          name={t("Restoration Intervention Types Implemented:")}
          // @ts-expect-error
          value={organization?.restoration_types_implemented
            ?.map((item: string) => {
              const values = getRestorationInterventionTypeOptions(t);
              return values.find(v => v.value === item)?.title;
            })
            .filter(Boolean)
            .join(", ")}
          nameClassName="w-1/3"
        />
        <When
          // @ts-expect-error
          condition={!!organization?.historic_monitoring_geojson}
        >
          <div>
            <Text variant="text-body-500" className="w-1/3">
              {t("Historic Monitoring Shapefile Upload:")}
            </Text>
            <Map geojson={projectBoundary} />
          </div>
        </When>
      </div>
    </section>
  );
};

export default PastRestorationExperience;
