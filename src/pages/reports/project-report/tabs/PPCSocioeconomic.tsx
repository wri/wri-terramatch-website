import { useT } from "@transifex/react";
import { Else, If, Then } from "react-if";

import TextField from "@/components/elements/Field/TextField";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import WorkdaysTable from "@/components/extensive/Tables/WorkdaysTable";
import {
  COLLECTION_PROJECT_PAID_OTHER,
  getReadableWorkdayCollectionName,
  PROJECT_WORKDAY_COLLECTIONS
} from "@/constants/workdayCollections";

interface ReportOverviewTabProps {
  report: any;
  dueAt?: string;
}

const PPCSocioeconomicTab = ({ report }: ReportOverviewTabProps) => {
  const t = useT();

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          {PROJECT_WORKDAY_COLLECTIONS.map(collection => (
            <If key={collection} condition={collection === COLLECTION_PROJECT_PAID_OTHER}>
              <Then>
                <PageCard title={getReadableWorkdayCollectionName(collection, t)} gap={4} key={collection}>
                  <TextField label={t("Description")} value={report.paid_other_activity_description} />
                  <WorkdaysTable modelName="project-report" modelUUID={report.uuid} collection={collection} />
                </PageCard>
              </Then>
              <Else>
                <Then key={collection}>
                  <PageCard title={getReadableWorkdayCollectionName(collection, t)} gap={4} key={collection}>
                    <WorkdaysTable modelName="project-report" modelUUID={report.uuid} collection={collection} />
                  </PageCard>
                </Then>
              </Else>
            </If>
          ))}
        </PageColumn>
      </PageRow>
    </PageBody>
  );
};

export default PPCSocioeconomicTab;
