import { useT } from "@transifex/react";
import { Fragment, useMemo } from "react";

import TextField from "@/components/elements/Field/TextField";
import Text from "@/components/elements/Text/Text";
import DemographicsDisplay from "@/components/extensive/DemographicsCollapseGrid/DemographicsDisplay";
import useCollectionsTotal from "@/components/extensive/DemographicsCollapseGrid/hooks";
import { DemographicType } from "@/components/extensive/DemographicsCollapseGrid/types";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import Loader from "@/components/generic/Loading/Loader";
import { DemographicCollections } from "@/generated/v3/entityService/entityServiceConstants";

interface ReportOverviewTabProps {
  report: any;
}

type CollectionType = "workdays" | "restorationPartners";

interface DemographicsCardProps {
  report: any;
  type: CollectionType;
}

type DemographicalTypeConfig = {
  demographicType: DemographicType;
  collections: readonly string[];
  titlePrefix: string;
  otherCollection?: string;
  otherTitle?: string;
  otherDescriptionProp?: string;
};

const useGetDemographicTypeConfig = (type: CollectionType): DemographicalTypeConfig => {
  const t = useT();

  const DEMOGRAPHICAL_TYPE_CONFIGS: { [k in CollectionType]: DemographicalTypeConfig } = useMemo(
    () => ({
      workdays: {
        demographicType: "workdays",
        collections: DemographicCollections.WORKDAYS_PROJECT_PPC,
        titlePrefix: t("Project Workdays"),
        otherCollection: DemographicCollections.WORKDAYS_PROJECT_OTHER,
        otherTitle: t("Other Activities Description"),
        otherDescriptionProp: "paid_other_activity_description"
      },
      restorationPartners: {
        demographicType: "restorationPartners",
        collections: DemographicCollections.RESTORATION_PARTNERS_PROJECT,
        titlePrefix: t("Project Restoration Partners"),
        otherCollection: DemographicCollections.RESTORATION_PARTNERS_PROJECT_OTHER,
        otherTitle: t("Other Restoration Partners Description"),
        otherDescriptionProp: "other_restoration_partners_description"
      }
    }),
    [t]
  );

  return DEMOGRAPHICAL_TYPE_CONFIGS[type];
};

const DemographicsCard = ({ report, type }: DemographicsCardProps) => {
  const { demographicType, collections, titlePrefix, otherCollection, otherTitle, otherDescriptionProp } =
    useGetDemographicTypeConfig(type);

  const demographicsTotal = useCollectionsTotal({
    entity: "projectReports",
    uuid: report.uuid,
    demographicType,
    collections
  });
  if (demographicsTotal == null) {
    return (
      <PageCard>
        <Loader />
      </PageCard>
    );
  }

  return (
    <PageCard>
      <Text variant="text-bold-headline-800">{`${titlePrefix} - ${demographicsTotal}`}</Text>
      {collections.map(collection => (
        <Fragment key={collection}>
          {otherDescriptionProp != null && collection === otherCollection ? (
            <TextField label={otherTitle!} value={report[otherDescriptionProp]} />
          ) : null}
          <DemographicsDisplay
            entity="projectReports"
            uuid={report.uuid}
            type={demographicType}
            collection={collection}
          />
        </Fragment>
      ))}
    </PageCard>
  );
};

const PPCSocioeconomicTab = ({ report }: ReportOverviewTabProps) => (
  <PageBody>
    <PageRow>
      <PageColumn>
        <DemographicsCard report={report} type="workdays" />
        <DemographicsCard report={report} type="restorationPartners" />
      </PageColumn>
    </PageRow>
  </PageBody>
);

export default PPCSocioeconomicTab;
