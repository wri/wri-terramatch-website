import { SortingState } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import Link from "next/link";
import { useState } from "react";

import Button from "@/components/elements/Button/Button";
import StatusPill from "@/components/elements/StatusPill/StatusPill";
import Pagination from "@/components/elements/Table/Pagination";
import Table from "@/components/elements/Table/Table";
import Text from "@/components/elements/Text/Text";
import { getActionCardStatusMapper } from "@/components/extensive/ActionTracker/cards/ApplicationsCard";
import { useGetV2MyApplications } from "@/generated/apiComponents";
import { ApplicationLiteRead } from "@/generated/apiSchemas";
import { tableSortingStateToQueryParamsSort } from "@/utils/dataTransformation";

const ApplicationsTable = () => {
  const t = useT();
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data: applications } = useGetV2MyApplications(
    {
      queryParams: {
        page,
        per_page: 5,
        sort: tableSortingStateToQueryParamsSort(sorting)
      }
    },
    {
      keepPreviousData: true
    }
  );

  return (
    <>
      <Table<ApplicationLiteRead>
        serverSideData
        onTableStateChange={state => setSorting(state.sorting)}
        data={
          applications?.data?.map(application => ({
            ...application,
            stage_name: application.current_submission?.stage?.name || "",
            form_submission_status: application.current_submission?.status || ""
          })) || []
        }
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
              <Button as={Link} href={`/applications/${props.getValue()}`}>
                {t("View")}
              </Button>
            ),
            meta: { align: "right" },
            enableSorting: false
          }
        ]}
      />
      <Pagination
        className="my-8 justify-center"
        //@ts-ignore
        getCanNextPage={() => page < applications?.meta?.last_page!}
        getCanPreviousPage={() => page > 1}
        //@ts-ignore
        getPageCount={() => applications?.meta?.last_page || 1}
        nextPage={() => setPage(page => page + 1)}
        pageIndex={page - 1}
        previousPage={() => setPage(page => page - 1)}
        setPageIndex={index => setPage(index + 1)}
      />
    </>
  );
};

export default ApplicationsTable;
