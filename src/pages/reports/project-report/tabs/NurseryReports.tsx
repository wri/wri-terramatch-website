import { useT } from "@transifex/react";
import Link from "next/link";
import { Else, If, Then } from "react-if";

import Button from "@/components/elements/Button/Button";
import EmptyState from "@/components/elements/EmptyState/EmptyState";
import Table from "@/components/elements/Table/Table";
import { getActionCardStatusMapper } from "@/components/extensive/ActionTracker/ActionTrackerCard";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import { StatusTableCell } from "@/components/extensive/TableCells/StatusTableCell";
import LoadingPage from "@/components/generic/Loading/LoadingPage";
import { useLightNurseryReportList } from "@/connections/Entity";
import { useTask } from "@/connections/Task";
import { getEntityDetailPageLink } from "@/helpers/entity";
import { useDate } from "@/hooks/useDate";

interface NurseryReportsTabProps {
  taskUuid: string;
}

const NurseryReportsTab = ({ taskUuid }: NurseryReportsTabProps) => {
  const t = useT();
  const { format } = useDate();
  const [loaded, { nurseryReportUuids }] = useTask({ id: taskUuid });
  const [, { data: nurseryReports }] = useLightNurseryReportList({ ids: nurseryReportUuids ?? [] });

  if (!loaded || nurseryReports == null) return <LoadingPage />;

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          {nurseryReports.length === 0 ? (
            <EmptyState
              iconProps={{ name: IconNames.DOCUMENT_CIRCLE, className: "fill-success" }}
              title={t("No Nursery Reports")}
              subtitle={t(
                "This section is where your nursery reports will appear. When you or your team submit a report, it will appear here. You'll be able to track the progress of the review process, stay informed, and manage your reports all in one place."
              )}
            />
          ) : (
            <PageCard
              title={t("Nursery Reports")}
              subtitle={t(
                "This is a list of all the nursery reports you have completed for this project. You can monitor their review process and approval status in this section."
              )}
            >
              <Table
                data={nurseryReports}
                columns={[
                  { header: t("Due Date"), accessorKey: "dueAt", cell: (props: any) => format(props.getValue()) },
                  {
                    header: t("Date Submitted"),
                    accessorKey: "updatedAt",
                    cell: (props: any) => format(props.getValue())
                  },
                  {
                    accessorKey: "nurseryName",
                    header: t("Nursery Name")
                  },
                  {
                    header: t("Report Title"),
                    accessorKey: "reportTitle"
                  },
                  {
                    accessorKey: "status",
                    header: t("Status"),
                    cell: (props: any) => {
                      let value = props.getValue() as string;
                      const statusProps = getActionCardStatusMapper(t)[value] as any;

                      return <StatusTableCell statusProps={statusProps} />;
                    }
                  },
                  {
                    accessorKey: "updateRequestStatus",
                    header: t("Change Request"),
                    cell: props => {
                      let value = props.getValue() as string;
                      const statusProps = getActionCardStatusMapper(t)[value] as any;

                      if (value === "no-update") {
                        return t("N/A");
                      } else {
                        return <StatusTableCell statusProps={statusProps} />;
                      }
                    }
                  },
                  {
                    header: "",
                    enableSorting: false,
                    accessorKey: "uuid",
                    cell: props => (
                      <If condition={props.row.original?.status === "started"}>
                        <Then>
                          <Button
                            as={Link}
                            href={`/entity/nursery-reports/edit/${props.getValue()}`}
                            className="float-right"
                          >
                            {t("Continue")}
                          </Button>
                        </Then>
                        <Else>
                          <Button
                            as={Link}
                            href={getEntityDetailPageLink("nursery-reports", props.getValue() as string)}
                            className="float-right"
                          >
                            {t("View Report")}
                          </Button>
                        </Else>
                      </If>
                    )
                  }
                ]}
                initialTableState={{ pagination: { pageSize: 5 } }}
              />
            </PageCard>
          )}
        </PageColumn>
      </PageRow>
    </PageBody>
  );
};

export default NurseryReportsTab;
