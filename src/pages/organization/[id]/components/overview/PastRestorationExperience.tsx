import { useT } from "@transifex/react";
import { When } from "react-if";

import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import Text from "@/components/elements/Text/Text";
import TextRow from "@/components/extensive/TextRow/TextRow";
import { getRestorationInterventionTypeOptions } from "@/constants/options/restorationInterventionTypes";
import { OrganisationFullDto } from "@/generated/v3/userService/userServiceSchemas";

type PastRestorationExperienceProps = {
  organization?: OrganisationFullDto;
};

const PastRestorationExperience = ({ organization }: PastRestorationExperienceProps) => {
  const t = useT();

  let projectBoundary: unknown;
  try {
    if (organization?.historicMonitoringGeojson != null && organization.historicMonitoringGeojson !== "null") {
      projectBoundary = JSON.parse(organization.historicMonitoringGeojson);
    } else {
      projectBoundary = undefined;
    }
  } catch (e) {
    projectBoundary = undefined;
  }

  return (
    <section className="my-10 rounded-lg bg-neutral-150 p-8">
      <Text variant="text-heading-300">{t("Environmental Impact")}</Text>
      <div className="mt-10 flex flex-col gap-4">
        <TextRow
          name={t("Years of relevant restoration experience:")}
          value={organization?.relevantExperienceYears ?? undefined}
          nameClassName="w-1/3"
        />
        <TextRow
          name={t("Total Hectares Restored:")}
          value={organization?.haRestoredTotal ?? undefined}
          nameClassName="w-1/3"
        />
        <TextRow
          name={t("Hectares Restored in the Last 3 Years:")}
          value={organization?.haRestored3Year ?? undefined}
          nameClassName="w-1/3"
        />
        <TextRow
          name={t("Total Trees Grown:")}
          value={organization?.treesGrownTotal ?? undefined}
          nameClassName="w-1/3"
        />
        <TextRow
          name={t("Total Trees Grown in the Last 3 Years:")}
          value={organization?.treesGrown3Year ?? undefined}
          nameClassName="w-1/3"
        />
        <TextRow
          name={t("Tree Maintenance and After Care:")}
          value={organization?.treeCareApproach ?? undefined}
          nameClassName="w-1/3"
        />
        <TextRow
          name={t("Average Tree Survival Rate:")}
          value={organization?.avgTreeSurvivalRate ?? undefined}
          nameClassName="w-1/3"
        />
        <TextRow
          name={t("What strategies have you used to maintain the trees that you have grown?:")}
          value={organization?.treeMaintenanceAftercareApproach ?? undefined}
          nameClassName="w-1/3"
        />
        <TextRow
          name={t(
            "In which areas of this country have you worked in the past, and what are their characteristics of these landscapes?:"
          )}
          value={organization?.restoredAreasDescription ?? undefined}
          nameClassName="w-1/3 "
          valueClassName="h-[260px] overflow-auto"
        />
        <TextRow
          name={t("How have you monitored and evaluated the progress of your past projects?:")}
          value={organization?.monitoringEvaluationExperience ?? undefined}
          nameClassName="w-1/3"
        />
        <TextRow
          name={t("Restoration Intervention Types Implemented:")}
          value={
            organization?.restorationTypesImplemented
              ?.map((item: string) => {
                const values = getRestorationInterventionTypeOptions(t);
                return values.find(v => v.value === item)?.title;
              })
              .filter(Boolean)
              .join(", ") ?? undefined
          }
          nameClassName="w-1/3"
        />
        <When
          condition={!!organization?.historicMonitoringGeojson && organization.historicMonitoringGeojson !== "null"}
        >
          <div>
            <Text variant="text-body-900" className="w-1/3">
              <>
                {t("Historic Monitoring Shapefile Upload:")}
                <br />
                <br />
              </>
            </Text>
            <MapContainer geojson={projectBoundary} />
          </div>
        </When>
      </div>
    </section>
  );
};

export default PastRestorationExperience;
