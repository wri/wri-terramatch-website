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
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useGetV2TasksUUIDReports } from "@/generated/apiComponents";
import { useDate } from "@/hooks/useDate";

interface SiteReportsTabProps {
  taskUuid: string;
}

const SiteReportsTab = ({ taskUuid }: SiteReportsTabProps) => {
  const t = useT();
  const { format } = useDate();

  const { data: taskUUIDReports, isLoading } = useGetV2TasksUUIDReports(
    {
      pathParams: { uuid: taskUuid }
    },
    {
      enabled: !!taskUuid
    }
  );

  const filteredReports = taskUUIDReports?.data?.filter(item => item.type === "site-report") || [];

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <LoadingContainer wrapInPaper loading={isLoading}>
            <If condition={filteredReports.length === 0}>
              <Then>
                <EmptyState
                  iconProps={{ name: IconNames.DOCUMENT_CIRCLE, className: "fill-success" }}
                  title={t("No Site Reports")}
                  subtitle={t(
                    "This section is where your site reports will appear. When you or your team submit a report, it will appear here. You'll be able to track the progress of the review process, stay informed, and manage your reports all in one place."
                  )}
                />
              </Then>
              <Else>
                <PageCard
                  title={t("Site Reports")}
                  subtitle={t(
                    "This is a list of all the site reports you have completed for this project. You can monitor their review process and approval status in this section."
                  )}
                >
                  <Table
                    data={filteredReports}
                    columns={[
                      { header: t("Due Date"), accessorKey: "due_at", cell: (props: any) => format(props.getValue()) },
                      {
                        header: t("Date Submitted"),
                        accessorKey: "update_at",
                        cell: (props: any) => format(props.getValue())
                      },
                      {
                        accessorKey: "parent_name",
                        header: t("Site Name")
                      },
                      {
                        header: t("Report Title"),
                        accessorKey: "report_title"
                      },
                      {
                        accessorKey: "status",
                        header: t("Status"),
                        cell: (props: any) => {
                          let value = props.getValue() as string;
                          const statusProps = getActionCardStatusMapper(t)[value] as any;
                          if (!statusProps) return null;

                          return <StatusTableCell statusProps={statusProps} />;
                        }
                      },
                      {
                        accessorKey: "update_request_status",
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
                                href={`/entity/site-reports/edit/${props.getValue()}`}
                                className="float-right"
                              >
                                {t("Continue")}
                              </Button>
                            </Then>
                            <Else>
                              <Button
                                as={Link}
                                href={`/reports/site-report/${props.getValue()}`}
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
              </Else>
            </If>
          </LoadingContainer>
        </PageColumn>
      </PageRow>
    </PageBody>
  );
};

export default SiteReportsTab;
