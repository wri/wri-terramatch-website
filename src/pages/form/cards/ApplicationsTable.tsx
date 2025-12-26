import { useT } from "@transifex/react";
import { isEmpty, last } from "lodash";
import Link from "next/link";
import { FC, useMemo } from "react";

import Button from "@/components/elements/Button/Button";
import StatusPill from "@/components/elements/StatusPill/StatusPill";
import Table from "@/components/elements/Table/Table";
import Text from "@/components/elements/Text/Text";
import { getActionCardStatusMapper } from "@/components/extensive/ActionTracker/ActionTrackerCard";
import { applicationsConnection } from "@/connections/Application";
import { useAllPages } from "@/hooks/useConnection";
import { useDate } from "@/hooks/useDate";
import { Status } from "@/types/common";
import { isNotNull } from "@/utils/array";

export type DraftApplicationsTableProps = {
  fundingProgrammeUuid?: string;
};

const ApplicationsTable: FC<DraftApplicationsTableProps> = ({ fundingProgrammeUuid }) => {
  const t = useT();
  const { format } = useDate();

  const [applicationsLoaded, applicationsData] = useAllPages(applicationsConnection, {
    filter: { fundingProgrammeUuid },
    enabled: fundingProgrammeUuid != null
  });

  const applications = useMemo(() => {
    if (!applicationsLoaded || isEmpty(applicationsData)) return [];

    return applicationsData
      .map(application => {
        const currentSubmission = last(application.submissions);
        if (currentSubmission?.status == null) return undefined;

        return {
          status: currentSubmission.status,
          uuid: application.uuid,
          submissionUuid: currentSubmission.uuid,
          updatedAt: currentSubmission.updatedAt,
          updatedBy: currentSubmission.updatedByName
        };
      })
      .filter(isNotNull);
  }, [applicationsData, applicationsLoaded]);

  return (
    <div>
      <Text variant="text-bold-subtitle-400" className="mt-8 text-center uppercase">
        {t("Active Applications")}
      </Text>
      {!isEmpty(applications) && (
        <Table
          data={applications!}
          columns={[
            {
              accessorKey: "status",
              header: "Status",
              cell: props => {
                const statusProps = getActionCardStatusMapper(t)[props.getValue() as string];
                if (!statusProps) return null;

                return (
                  <StatusPill status={statusProps.status! as unknown as Status} className="w-fit">
                    <Text variant="text-bold-caption-100" className="whitespace-nowrap">
                      {statusProps.statusText}
                    </Text>
                  </StatusPill>
                );
              }
            },
            { accessorKey: "updatedAt", header: "Last Updated", cell: props => format(props.getValue() as string) },
            { accessorKey: "updatedBy", header: "Updated By", enableSorting: false },
            {
              accessorKey: "uuid",
              header: "",
              cell: props => {
                const { status, submissionUuid, uuid } = props.row.original ?? {};

                const buttons = [
                  <Button key="view" as={Link} href={`/applications/${uuid}`}>
                    {t("Details")}
                  </Button>
                ];

                if (status === "started" && submissionUuid != null) {
                  buttons.unshift(
                    <Button key="continue" as={Link} href={`/form/submission/${submissionUuid}`}>
                      {t("Continue")}
                    </Button>
                  );
                }

                return <div className="flex justify-end gap-4">{buttons}</div>;
              },
              enableSorting: false
            }
          ]}
        />
      )}
    </div>
  );
};

export default ApplicationsTable;
