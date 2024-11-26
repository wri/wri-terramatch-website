import { useT } from "@transifex/react";
import { Else, If, Then } from "react-if";

import TextField from "@/components/elements/Field/TextField";
import Text from "@/components/elements/Text/Text";
import { DemographicalType } from "@/components/extensive/DemographicsCollapseGrid/types";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import Loader from "@/components/generic/Loading/Loader";
import {
  COLLECTION_PROJECT_DIRECT_OTHER,
  PROJECT_RESTORATION_PARTNER_COLLECTIONS
} from "@/constants/restorationPartnerCollections";
import { COLLECTION_PROJECT_PAID_OTHER, PROJECT_WORKDAY_COLLECTIONS } from "@/constants/workdayCollections";
import useDemographicData from "@/hooks/useDemographicData";

interface ReportOverviewTabProps {
  report: any;
}

interface DemographicsCardProps {
  report: any;
  demographicalType: DemographicalType;
}

type DemographicalTypeConfig = {
  collections: string[];
  titlePrefix: string;
  otherCollection: string;
  otherTitle: string;
  otherDescriptionProp: string;
};

const DEMOGRAPHICAL_TYPE_CONFIGS: { [k in DemographicalType]: DemographicalTypeConfig } = {
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
  }
};

const DemographicsCard = ({ report, demographicalType }: DemographicsCardProps) => {
  const t = useT();
  const { collections, titlePrefix, otherCollection, otherTitle, otherDescriptionProp } =
    DEMOGRAPHICAL_TYPE_CONFIGS[demographicalType];
  const { grids, title } = useDemographicData(
    "project-report",
    demographicalType,
    report.uuid,
    collections,
    titlePrefix
  );

  if (grids.length === 0) {
    return (
      <PageCard>
        <Loader />
      </PageCard>
    );
  }

  return (
    <PageCard>
      <Text variant="text-bold-headline-800">{title}</Text>
      {grids.map(({ collection, grid }) => (
        <If key={collection} condition={collection === otherCollection}>
          <Then>
            <TextField label={t(otherTitle)} value={report[otherDescriptionProp]} />
            {grid}
          </Then>
          <Else>
            <Then key={collection}>{grid}</Then>
          </Else>
        </If>
      ))}
    </PageCard>
  );
};

const PPCSocioeconomicTab = ({ report }: ReportOverviewTabProps) => (
  <PageBody>
    <PageRow>
      <PageColumn>
        <DemographicsCard report={report} demographicalType="workdays" />
        <DemographicsCard report={report} demographicalType="restorationPartners" />
      </PageColumn>
    </PageRow>
  </PageBody>
);

export default PPCSocioeconomicTab;
