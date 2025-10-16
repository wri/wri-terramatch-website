import { useT } from "@transifex/react";
import { useState } from "react";

import EmptyState from "@/components/elements/EmptyState/EmptyState";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import DisturbanceReportsTable from "@/components/extensive/Tables/DisturbanceReportsTable";

interface DisturbanceReportsProps {
  projectUUID: string;
}

const DisturbanceReportsTab = ({ projectUUID }: DisturbanceReportsProps) => {
  const t = useT();
  const [reportsCount, setReportsCount] = useState<number>();

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          {reportsCount === 0 ? (
            <EmptyState
              iconProps={{ name: IconNames.DOCUMENT_CIRCLE, className: "fill-success" }}
              title={t("No disturbance reports")}
              subtitle={t(
                "You will find all your disturbance reports here anytime you have a disturbance report for your project."
              )}
            />
          ) : (
            <PageCard
              // classNameSubTitle="block w-[80%]"
              title={t("Disturbance Reports")}
              subtitle={t(
                "Disturbance reports allow champions to flag a major obstacle your project is facing outside of the 6 month progress reports. When you submit a disturbance report, your project manager will be notified and will work with you to handle the disturbance within your project scope and budget."
              )}
              subtitleMore
              // TODO: This will be uncommented during the implementation of the create disturbance report in the PD view.
              // headerChildren={
              //   <Button>
              //     <Icon name={IconNames.PLUS} className="h-3 w-3" />
              //     <>{t("Add Report")}</>
              //   </Button>
              // }
            >
              <DisturbanceReportsTable
                projectUUID={projectUUID}
                onFetch={data => setReportsCount(data?.indexTotal)}
                alwaysShowPagination
              />
            </PageCard>
          )}
        </PageColumn>
      </PageRow>
      <br />
      <br />
    </PageBody>
  );
};

export default DisturbanceReportsTab;
