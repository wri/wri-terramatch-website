import { Box, Card, Divider, Stack, SxProps, Theme, Typography } from "@mui/material";
import { ComponentType, FC } from "react";
import { FunctionField, Labeled, NumberField, useShowContext } from "react-admin";
import { When } from "react-if";

import useCollectionsTotal from "@/components/extensive/DemographicsCollapseGrid/hooks";
import { DemographicEntity, DemographicType } from "@/components/extensive/DemographicsCollapseGrid/types";
import { ContextCondition } from "@/context/ContextCondition";
import { ALL_TF, Framework } from "@/context/framework.provider";
import { DemographicCollections } from "@/generated/v3/entityService/entityServiceConstants";

type TotalsType = "workdays" | "workdaysPaid" | "workdaysVolunteer" | "jobs" | "restorationPartners";
type DemographicResource = "projectReport" | "siteReport";
type CollectionValue = Record<DemographicResource, readonly string[] | undefined> & {
  demographicType: DemographicType;
};
const COLLECTIONS: Record<TotalsType, CollectionValue> = {
  workdays: {
    projectReport: DemographicCollections.WORKDAYS_PROJECT_PPC,
    siteReport: DemographicCollections.WORKDAYS_SITE,
    demographicType: "workdays"
  },
  workdaysPaid: {
    projectReport: DemographicCollections.WORKDAYS_PROJECT_PPC.filter(c => c.startsWith("paid-")),
    siteReport: DemographicCollections.WORKDAYS_SITE.filter(c => c.startsWith("paid-")),
    demographicType: "workdays"
  },
  workdaysVolunteer: {
    projectReport: DemographicCollections.WORKDAYS_PROJECT_PPC.filter(c => c.startsWith("volunteer-")),
    siteReport: DemographicCollections.WORKDAYS_SITE.filter(c => c.startsWith("volunteer-")),
    demographicType: "workdays"
  },
  jobs: {
    projectReport: DemographicCollections.JOBS_PROJECT,
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
  demographicType: DemographicType;
  entity: DemographicEntity;
  collections: readonly string[];
};
// An HOC to make sure the wrapped component is only added to the component tree if there is a valid
// demographic entity and set of collections for this totalsType and shown resource. That allows
// DemographicsTotalField to assume that it's valid to run its connection hooks and display data.
function withTotalsShow<T extends CollectionsProps>(WrappedComponent: ComponentType<T>) {
  const displayName = WrappedComponent.displayName ?? WrappedComponent.name ?? "Component";
  const TotalsShow = (props: Omit<T, "demographicType" | "entity" | "collections"> & TotalShowProps) => {
    const { totalsType, ...rest } = props;
    const { resource } = useShowContext();
    const collections = COLLECTIONS[totalsType]?.[resource as DemographicResource];
    const entity = (resource === "projectReport" ? "project-reports" : "site-reports") as DemographicEntity;
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
}

type DemographicsTotalFieldProps = CollectionsProps & {
  label: string;
  sx: SxProps<Theme>;
};
const DemographicsTotalField: FC<Omit<DemographicsTotalFieldProps, keyof CollectionsProps> & TotalShowProps> =
  withTotalsShow<DemographicsTotalFieldProps>(({ label, entity, demographicType, collections, sx }) => {
    const {
      record: { uuid }
    } = useShowContext();
    const total = useCollectionsTotal({ entity, uuid, demographicType, collections }) ?? 0;

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
            <DemographicsTotalField label="Total Number of Workdays Created" sx={inlineLabelSx} totalsType="workdays" />
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
              source={record.trees_planted_count ? "trees_planted_count" : "total_trees_planted_count"}
              emptyText="0"
            />
          </Labeled>
          <ContextCondition frameworksShow={[Framework.PPC]}>
            <When condition={resource === "projectReport" || resource === "siteReport"}>
              <Labeled label="Total Number Of Seeds Planted" sx={inlineLabelSx}>
                <NumberField
                  source={record.seeds_planted_count ? "seeds_planted_count" : "total_seeds_planted_count"}
                  emptyText="0"
                />
              </Labeled>
            </When>
          </ContextCondition>
          <ContextCondition frameworksShow={ALL_TF}>
            <When condition={resource !== "siteReport"}>
              <Labeled label="Total Number Of Seedlings" sx={inlineLabelSx}>
                <NumberField source="seedlings_grown" emptyText="0" />
              </Labeled>
            </When>
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
