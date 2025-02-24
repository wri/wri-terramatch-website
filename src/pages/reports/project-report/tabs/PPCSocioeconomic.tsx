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
import { PROJECT_JOBS_COLLECTIONS } from "@/constants/jobsCollections";
import {
  COLLECTION_PROJECT_DIRECT_OTHER,
  PROJECT_RESTORATION_PARTNER_COLLECTIONS
} from "@/constants/restorationPartnerCollections";
import { COLLECTION_PROJECT_PAID_OTHER, PROJECT_WORKDAY_COLLECTIONS } from "@/constants/workdayCollections";

interface ReportOverviewTabProps {
  report: any;
}

interface DemographicsCardProps {
  report: any;
  demographicType: DemographicType;
}

type DemographicalTypeConfig = {
  collections: string[];
  titlePrefix: string;
  otherCollection?: string;
  otherTitle?: string;
  otherDescriptionProp?: string;
};

const DEMOGRAPHICAL_TYPE_CONFIGS: { [k in DemographicType]: DemographicalTypeConfig } = {
  workdays: {
    collections: PROJECT_WORKDAY_COLLECTIONS,
    titlePrefix: "Project Workdays",
    otherCollection: COLLECTION_PROJECT_PAID_OTHER,
    otherTitle: "Other Activities Description",
    otherDescriptionProp: "paid_other_activity_description"
  },
  restorationPartners: {
    collections: PROJECT_RESTORATION_PARTNER_COLLECTIONS,
    titlePrefix: "Project Restoration Partners",
    otherCollection: COLLECTION_PROJECT_DIRECT_OTHER,
    otherTitle: "Other Restoration Partners Description",
    otherDescriptionProp: "other_restoration_partners_description"
  },
  jobs: {
    collections: PROJECT_JOBS_COLLECTIONS,
    titlePrefix: "Project Jobs"
  }
};

const DemographicsCard = ({ report, demographicType }: DemographicsCardProps) => {
  const t = useT();
  const { collections, titlePrefix, otherCollection, otherTitle, otherDescriptionProp } =
    DEMOGRAPHICAL_TYPE_CONFIGS[demographicType];

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
        <DemographicsCard report={report} demographicType="workdays" />
        <DemographicsCard report={report} demographicType="restorationPartners" />
      </PageColumn>
    </PageRow>
  </PageBody>
);

export default PPCSocioeconomicTab;
