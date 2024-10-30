import { useT } from "@transifex/react";
import { Else, If, Then } from "react-if";

import TextField from "@/components/elements/Field/TextField";
import Paper from "@/components/elements/Paper/Paper";
import Text from "@/components/elements/Text/Text";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import Loader from "@/components/generic/Loading/Loader";
import { COLLECTION_PROJECT_PAID_OTHER, PROJECT_WORKDAY_COLLECTIONS } from "@/constants/workdayCollections";
import useDemographicData from "@/hooks/useDemographicData";

interface ReportOverviewTabProps {
  report: any;
}

const PPCSocioeconomicTab = ({ report }: ReportOverviewTabProps) => {
  const t = useT();

  const { grids, title } = useDemographicData(
    "project-report",
    report.uuid,
    PROJECT_WORKDAY_COLLECTIONS,
    "Project Workdays"
  );

  if (grids.length == 0) {
    return (
      <Paper>
        <Loader />
      </Paper>
    );
  }

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <PageCard>
            <Text variant="text-bold-headline-800">{title}</Text>
            {grids.map(({ collection, grid }) => (
              <If key={collection} condition={collection === COLLECTION_PROJECT_PAID_OTHER}>
                <Then>
                  <TextField label={t("Other Activities Description")} value={report.paid_other_activity_description} />
                  {grid}
                </Then>
                <Else>
                  <Then key={collection}>{grid}</Then>
                </Else>
              </If>
            ))}
          </PageCard>
        </PageColumn>
      </PageRow>
    </PageBody>
  );
};

export default PPCSocioeconomicTab;
