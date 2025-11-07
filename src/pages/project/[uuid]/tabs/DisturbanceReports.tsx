import { useT } from "@transifex/react";
import { useEffect, useRef } from "react";

import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import DisturbanceReportsTable from "@/components/extensive/Tables/DisturbanceReportsTable";
import { useCreateDisturbanceReport } from "@/connections/Entity";

interface DisturbanceReportsProps {
  projectUUID: string;
}

const DisturbanceReportsTab = ({ projectUUID }: DisturbanceReportsProps) => {
  const t = useT();
  const [, { isCreating, createFailure, refetch }] = useCreateDisturbanceReport({
    parentUuid: projectUUID
  });

  const prevIsCreatingRef = useRef(isCreating);

  useEffect(() => {
    if (prevIsCreatingRef.current && isCreating == false && createFailure == null) {
      refetch();
    }
    prevIsCreatingRef.current = isCreating;
  }, [isCreating, createFailure, refetch]);

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <PageCard
            // classNameSubTitle="block w-[80%]"
            title={t("Disturbance Reports")}
            subtitle={t(
              "Disturbance reports allow champions to flag a major obstacle your project is facing outside of the 6 month progress reports. When you submit a disturbance report, your project manager will be notified and will work with you to handle the disturbance within your project scope and budget."
            )}
            subtitleMore
            // TODO: hide add report button for now
            // headerChildren={
            //   <Button disabled={isCreating} onClick={() => create({ parentUuid: projectUUID })}>
            //     <Icon name={IconNames.PLUS} className="h-3 w-3" />
            //     <>{t("Add Report")}</>
            //   </Button>
            // }
          >
            <DisturbanceReportsTable projectUUID={projectUUID} alwaysShowPagination />
          </PageCard>
        </PageColumn>
      </PageRow>
      <br />
      <br />
    </PageBody>
  );
};

export default DisturbanceReportsTab;
