import { useT } from "@transifex/react";
import Link from "next/link";
import { useState } from "react";

import { ServerSideTable } from "@/components/elements/ServerSideTable/ServerSideTable";
import StatusPill from "@/components/elements/StatusPill/StatusPill";
import Text from "@/components/elements/Text/Text";
import { getActionCardStatusMapper } from "@/components/extensive/ActionTracker/ActionTrackerCard";
import { ActionTableCell } from "@/components/extensive/TableCells/ActionTableCell";
import { useGetV2MyApplications } from "@/generated/apiComponents";
import { ApplicationLiteRead } from "@/generated/apiSchemas";

const ApplicationsTable = () => {
  const t = useT();
  const [queryParams, setQueryParams] = useState<any>();

  const { data: applications, isLoading } = useGetV2MyApplications(
    {
      queryParams
    },
    {
      keepPreviousData: true
    }
  );

  return (
    <div>
      <ServerSideTable<ApplicationLiteRead>
        meta={applications?.meta}
        data={
          applications?.data?.map(application => ({
            ...application,
            stage_name: application.current_submission?.stage?.name || "",
            form_submission_status: application.current_submission?.status || ""
          })) || []
        }
        isLoading={isLoading}
        onQueryParamChange={setQueryParams}
        columns={[
          {
            accessorKey: "funding_programme_name",
            header: "Application"
          },
          {
            accessorKey: "stage_name",
            header: "Stage"
          },
          {
            accessorKey: "form_submission_status",
            cell: props => {
              const statusProps = getActionCardStatusMapper(t)[props.getValue() as any];
              if (!statusProps) return null;

              return (
                <StatusPill
                  // @ts-ignore
                  status={statusProps.status}
                  className="w-fit"
                >
                  <Text variant="text-bold-caption-100" className="whitespace-nowrap">
                    {statusProps.statusText}
                  </Text>
                </StatusPill>
              );
            },
            header: "Status"
          },
          {
            accessorKey: "uuid",
            header: "",
            cell: props => (
              <ActionTableCell
                primaryButtonProps={{ as: Link, href: `/applications/${props.getValue()}`, children: t("View") }}
              />
            ),
            meta: { align: "right" },
            enableSorting: false
          }
        ]}
      />
    </div>
  );
};

export default ApplicationsTable;
