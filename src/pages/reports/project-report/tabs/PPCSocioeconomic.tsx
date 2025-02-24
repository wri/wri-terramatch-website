import { useT } from "@transifex/react";
import { Fragment } from "react";

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

type CollectionType = "workdays" | "restorationPartners" | "jobsPaid" | "jobsVolunteer";

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

const DEMOGRAPHICAL_TYPE_CONFIGS: { [k in CollectionType]: DemographicalTypeConfig } = {
  workdays: {
    demographicType: "workdays",
    collections: DemographicCollections.WORKDAYS_PROJECT_PPC,
    titlePrefix: "Project Workdays",
    otherCollection: DemographicCollections.WORKDAYS_PROJECT_OTHER,
    otherTitle: "Other Activities Description",
    otherDescriptionProp: "paid_other_activity_description"
  },
  restorationPartners: {
    demographicType: "restorationPartners",
    collections: DemographicCollections.RESTORATION_PARTNERS_PROJECT,
    titlePrefix: "Project Restoration Partners",
    otherCollection: DemographicCollections.RESTORATION_PARTNERS_PROJECT_OTHER,
    otherTitle: "Other Restoration Partners Description",
    otherDescriptionProp: "other_restoration_partners_description"
  },
  jobsPaid: {
    demographicType: "jobs",
    collections: DemographicCollections.JOBS_PAID_PROJECT,
    titlePrefix: "Project Jobs"
  },
  jobsVolunteer: {
    demographicType: "jobs",
    collections: DemographicCollections.JOBS_VOLUNTEER_PROJECT,
    titlePrefix: "Project Jobs"
  }
};

const DemographicsCard = ({ report, type }: DemographicsCardProps) => {
  const t = useT();
  const { demographicType, collections, titlePrefix, otherCollection, otherTitle, otherDescriptionProp } =
    DEMOGRAPHICAL_TYPE_CONFIGS[type];

  const demographicsTotal = useCollectionsTotal("project-reports", report.uuid, demographicType, collections);
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
            <TextField label={t(otherTitle)} value={report[otherDescriptionProp]} />
          ) : null}
          <DemographicsDisplay
            entity="project-reports"
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
