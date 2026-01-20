import { CellContext, ColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { useMemo } from "react";

import ReadMoreText from "@/components/elements/ReadMoreText/ReadMoreText";
import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_SECONDARY } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import { useApplicationHistory } from "@/connections/Application";
import { ApplicationHistoryEntryDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useDate } from "@/hooks/useDate";

interface ApplicationTimelineProps {
  applicationUuid?: string;
}

const UPDATE_TEXT = {
  started: "Draft",
  "requires-more-information": "More info requested",
  "awaiting-approval": "Submitted",
  approved: "Approved",
  rejected: "Not Selected"
};

const getApplicationUpdateText = (t: typeof useT, row?: CellContext<ApplicationHistoryEntryDto, unknown>["row"]) => {
  const status = row?.original?.status;
  const value = status == null ? null : UPDATE_TEXT[status];

  if (row?.original.eventType === "updated" && value == null) {
    // An update without any fields from the backend, a catch all, just return "updated"
    return t("Updated");
  }

  return t(value);
};

const ApplicationTimeline = ({ applicationUuid }: ApplicationTimelineProps) => {
  const { format } = useDate();
  const t = useT();
  const [, { data: history }] = useApplicationHistory({ id: applicationUuid, enabled: applicationUuid != null });

  const columns = useMemo(
    (): ColumnDef<ApplicationHistoryEntryDto>[] => [
      {
        accessorKey: "date",
        header: t("Date"),
        enableSorting: false,
        cell: props => (
          <Text variant="text-light-body-300" className="whitespace-nowrap">
            {format(props.getValue() as string, "do MMMM yyyy")}
          </Text>
        )
      },
      {
        accessorKey: "status",
        header: t("Update"),
        enableSorting: false,
        cell: props => {
          const value = props.getValue();
          const text = getApplicationUpdateText(t, props.row) ?? value;
          return (
            <Text variant="text-bold-subtitle-400" className="whitespace-nowrap">
              {text}
            </Text>
          );
        }
      },
      {
        accessorKey: "stageName",
        header: t("Stage"),
        enableSorting: false
      },
      {
        accessorKey: "comment",
        header: t("Comments"),
        enableSorting: false,
        cell: props => <ReadMoreText variant="text-light-body-300">{props.getValue() as string}</ReadMoreText>
      }
    ],
    [format, t]
  );

  return (
    <section>
      <Text variant="text-bold-headline-1000">{t("Application Timeline")}</Text>

      <div className="mt-8 rounded-lg border border-neutral-100 bg-white p-8 shadow">
        {history == null ? null : (
          <Table<ApplicationHistoryEntryDto>
            columns={columns}
            data={history.entries}
            variant={VARIANT_TABLE_SECONDARY}
          />
        )}
      </div>
    </section>
  );
};

export default ApplicationTimeline;
