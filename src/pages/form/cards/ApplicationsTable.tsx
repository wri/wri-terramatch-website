import { useT } from "@transifex/react";
import { isEmpty } from "lodash";
import Link from "next/link";
import { FC, useMemo } from "react";

import Button from "@/components/elements/Button/Button";
import StatusPill from "@/components/elements/StatusPill/StatusPill";
import Table from "@/components/elements/Table/Table";
import Text from "@/components/elements/Text/Text";
import { getActionCardStatusMapper } from "@/components/extensive/ActionTracker/ActionTrackerCard";
import { useGetV2MyApplications } from "@/generated/apiComponents";
import { ApplicationLiteRead } from "@/generated/apiSchemas";
import { useDate } from "@/hooks/useDate";

export type DraftApplicationsTableProps = {
  fundingProgrammeUuid?: string;
};

const ApplicationsTable: FC<DraftApplicationsTableProps> = ({ fundingProgrammeUuid }) => {
  const t = useT();
  const { format } = useDate();

  const { data: applicationsData } = useGetV2MyApplications<{
    data: ApplicationLiteRead[];
  }>(
    {
      queryParams: { "filter[funding_programme_uuid]": fundingProgrammeUuid }
    },
    {
      enabled: fundingProgrammeUuid != null
    }
  );

  const applications = useMemo(() => {
    if (isEmpty(applicationsData?.data)) return [];

    return applicationsData
      ?.data!.filter(application => application.current_submission?.status != null)
      .map(application => {
        const applicationStatus = application.current_submission?.status;

        return {
          status: applicationStatus,
          uuid: application.uuid,
          submissionUuid: application.current_submission?.uuid,
          updatedAt: application.current_submission?.updated_at,
          updatedBy: application.current_submission?.updated_by_name
        };
      });
  }, [applicationsData?.data]);

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
                  <StatusPill status={statusProps.status!} className="w-fit">
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
