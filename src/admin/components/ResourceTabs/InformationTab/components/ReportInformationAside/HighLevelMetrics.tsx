import { Box, Card, Divider, Stack, SxProps, Theme, Typography } from "@mui/material";
import { ComponentType, FC } from "react";
import { FunctionField, Labeled, NumberField, useShowContext } from "react-admin";

import useCollectionsTotal from "@/components/extensive/TrackingCollapseGrid/hooks";
import { TrackingEntity, TrackingType } from "@/components/extensive/TrackingCollapseGrid/types";
import { ContextCondition } from "@/context/ContextCondition";
import { ALL_TF, Framework } from "@/context/framework.provider";
import { DemographicCollections } from "@/generated/v3/entityService/entityServiceConstants";

type TotalsType = "workdays" | "workdaysPaid" | "workdaysVolunteer" | "jobs" | "restorationPartners";
type DemographicResource = "projectReport" | "siteReport";
type CollectionValue = Record<DemographicResource, readonly string[] | undefined> & {
  demographicType: TrackingType;
};
const COLLECTIONS: Record<TotalsType, CollectionValue> = {
  workdays: {
    projectReport: DemographicCollections.WORKDAYS_PROJECT,
    siteReport: DemographicCollections.WORKDAYS_SITE,
    demographicType: "workdays"
  },
  workdaysPaid: {
    projectReport: DemographicCollections.WORKDAYS_PROJECT.filter(c => c.startsWith("paid-")),
    siteReport: DemographicCollections.WORKDAYS_SITE.filter(c => c.startsWith("paid-")),
    demographicType: "workdays"
  },
  workdaysVolunteer: {
    projectReport: DemographicCollections.WORKDAYS_PROJECT.filter(c => c.startsWith("volunteer-")),
    siteReport: DemographicCollections.WORKDAYS_SITE.filter(c => c.startsWith("volunteer-")),
    demographicType: "workdays"
  },
  jobs: {
    projectReport: ["all", "full-time", "part-time"],
    siteReport: undefined,
    demographicType: "jobs"
  },
  restorationPartners: {
    projectReport: DemographicCollections.RESTORATION_PARTNERS_PROJECT,
    siteReport: undefined,
    demographicType: "restorationPartners"
  }
};

type TotalShowProps = {
  totalsType: TotalsType;
};
type CollectionsProps = {
  demographicType: TrackingType;
  entity: TrackingEntity;
  collections: readonly string[];
};
// An HOC to make sure the wrapped component is only added to the component tree if there is a valid
// demographic entity and set of collections for this totalsType and shown resource. That allows
// DemographicsTotalField to assume that it's valid to run its connection hooks and display data.
const withTotalsShow = <T extends CollectionsProps>(WrappedComponent: ComponentType<T>) => {
  const displayName = WrappedComponent.displayName ?? WrappedComponent.name ?? "Component";
  const TotalsShow = (props: Omit<T, "demographicType" | "entity" | "collections"> & TotalShowProps) => {
    const { totalsType, ...rest } = props;
    const { resource } = useShowContext();
    const collections = COLLECTIONS[totalsType]?.[resource as DemographicResource];
    const entity: TrackingEntity = resource === "projectReport" ? "projectReports" : "siteReports";
    const demographicType = COLLECTIONS[totalsType]?.demographicType;

    return collections == null || entity == null ? null : (
      <WrappedComponent
        {...{ demographicType, entity, collections }}
        {...(rest as unknown as T & JSX.IntrinsicAttributes)}
      />
    );
  };

  TotalsShow.displayName = `withTotalsShow(${displayName})`;
  return TotalsShow;
};

type DemographicsTotalFieldProps = CollectionsProps & {
  label: string;
  sx: SxProps<Theme>;
};
const DemographicsTotalField: FC<Omit<DemographicsTotalFieldProps, keyof CollectionsProps> & TotalShowProps> =
  withTotalsShow<DemographicsTotalFieldProps>(({ label, entity, demographicType, collections, sx }) => {
    const {
      record: { uuid }
    } = useShowContext();
    const total =
      useCollectionsTotal({ entity, uuid, domain: "demographics", trackingType: demographicType, collections }) ?? 0;

    return (
      <Labeled {...{ label, sx }}>
        <FunctionField render={() => total} />
      </Labeled>
    );
  });

const HighLevelMetrics: FC = () => {
  const { record, resource } = useShowContext();

  const inlineLabelSx: SxProps<Theme> = {
    flexDirection: "row",
    justifyContent: "space-between"
  };

  const workdaysType = resource === "projectReport" ? "Project" : resource === "siteReport" ? "Site" : null;

  return (
    <Card>
      <Box paddingX={3.75} paddingY={2}>
        <Typography variant="h5">High Level Metrics</Typography>
      </Box>

      <Divider />

      <Box paddingX={3.75} paddingY={2}>
        <Stack gap={3}>
          <ContextCondition frameworksHide={ALL_TF}>
            {record.taskTotalWorkdays == null ? (
              <DemographicsTotalField
                label="Total Number of Workdays Created"
                sx={inlineLabelSx}
                totalsType="workdays"
              />
            ) : (
              <Labeled label="Total Number Of Workdays Created" sx={inlineLabelSx}>
                <NumberField source="taskTotalWorkdays" />
              </Labeled>
            )}
            <DemographicsTotalField
              label={`Total Number of Paid ${workdaysType} Workdays Created`}
              sx={inlineLabelSx}
              totalsType="workdaysPaid"
            />
            <DemographicsTotalField
              label={`Total Number of Volunteer ${workdaysType} Workdays Created`}
              sx={inlineLabelSx}
              totalsType="workdaysVolunteer"
            />
          </ContextCondition>
          <ContextCondition frameworksShow={ALL_TF}>
            <DemographicsTotalField label="Total Number of Jobs Created" sx={inlineLabelSx} totalsType="jobs" />
          </ContextCondition>
          <Labeled label="Total Number Of Trees Planted" sx={inlineLabelSx}>
            <NumberField
              source={record.treesPlantedCount ? "treesPlantedCount" : "totalTreesPlantedCount"}
              emptyText="0"
            />
          </Labeled>
          {resource === "siteReport" && (
            <Labeled label="Total Number of Trees Regenerating" sx={inlineLabelSx}>
              <NumberField source="totalTreesRegeneratingSpeciesCount" emptyText="0" />
            </Labeled>
          )}
          {resource === "projectReport" && (
            <Labeled label="Total Number of Trees Regenerating" sx={inlineLabelSx}>
              <NumberField source="treesRegeneratingSpeciesCount" emptyText="0" />
            </Labeled>
          )}
          <ContextCondition frameworksShow={[Framework.PPC]}>
            {(resource === "projectReport" || resource === "siteReport") && (
              <Labeled label="Total Number Of Seeds Planted" sx={inlineLabelSx}>
                <NumberField
                  source={record.seedsPlantedCount ? "seedsPlantedCount" : "totalSeedsPlantedCount"}
                  emptyText="0"
                />
              </Labeled>
            )}
          </ContextCondition>
          <ContextCondition frameworksShow={[Framework.PPC]}>
            {(resource === "projectReport" || resource === "siteReport") && (
              <Labeled label="Estimate Number of Trees Restored via ANR" sx={inlineLabelSx}>
                <NumberField
                  source={resource === "projectReport" ? "regeneratedTreesCount" : "numTreesRegenerating"}
                  emptyText="0"
                />
              </Labeled>
            )}
          </ContextCondition>
          <ContextCondition frameworksShow={ALL_TF}>
            {resource !== "siteReport" && (
              <Labeled label="Total Number Of Seedlings" sx={inlineLabelSx}>
                <NumberField source="seedlingsGrown" emptyText="0" />
              </Labeled>
            )}
          </ContextCondition>
          <ContextCondition frameworksShow={[Framework.PPC]}>
            <DemographicsTotalField
              label="Total Number of Restoration Partners (allowing double-counting)"
              sx={inlineLabelSx}
              totalsType="restorationPartners"
            />
          </ContextCondition>
        </Stack>
      </Box>
    </Card>
  );
};

export default HighLevelMetrics;
