import { useT } from "@transifex/react";

import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import WorkdaysTable from "@/components/extensive/Tables/WorkdaysTable";
import { getReadableWorkdayCollectionName, PROJECT_WORKDAY_COLLECTIONS } from "@/constants/workdayCollections";

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
            <PageCard title={getReadableWorkdayCollectionName(collection, t)} gap={4} key={collection}>
              <WorkdaysTable modelName="project-report" modelUUID={report.uuid} collection={collection} />
            </PageCard>
          ))}
        </PageColumn>
      </PageRow>
    </PageBody>
  );
};

export default PPCSocioeconomicTab;
