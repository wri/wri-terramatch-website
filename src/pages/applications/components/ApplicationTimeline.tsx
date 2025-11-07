import { CellContext } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { findLast, sortBy } from "lodash";
import { useMemo } from "react";

import ReadMoreText from "@/components/elements/ReadMoreText/ReadMoreText";
import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_SECONDARY } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import { ApplicationRead, AuditRead } from "@/generated/apiSchemas";
import { useDate } from "@/hooks/useDate";

interface ApplicationTimelineProps {
  application?: ApplicationRead;
}

interface AuditWithStageName extends AuditRead {
  stageName?: string;
}

const getApplicationUpdateText = (t: typeof useT, row?: CellContext<AuditWithStageName, unknown>["row"]) => {
  const values = {
    started: t("Draft"),
    "requires-more-information": t("More info requested"),
    "submitted-requires-more-information": t("More info requested"),
    "stage-change": t("Approved to moved to stage {newStage}", { newStage: row?.original.stageName }),
    "awaiting-approval": t("Submitted"),
    approved: t("Approved"),
    rejected: t("Not Selected")
  };

  const value = values[row?.original?.new_values?.status as keyof typeof values];

  if (row?.original.event === "updated" && !value) {
    // An update without any fields from the backend, a catch all, just return "updated"
    return t("Updated");
  }

  return value;
};

const ApplicationTimeline = ({ application }: ApplicationTimelineProps) => {
  const { format } = useDate();
  const t = useT();

  const filteredAudits = useMemo<AuditWithStageName[]>(() => {
    const audits = (application?.form_submissions ?? [])
      .map(submission =>
        (submission.audits ?? []).map(
          (audit): AuditWithStageName => ({
            ...audit,
            stageName: submission.stage?.name
          })
        )
      )
      .flat()
      .sort((a, b) => new Date(a.created_at as string).getTime() - new Date(b.created_at as string).getTime());

    const isDraft = application?.form_submissions?.some(
      submission => submission.status === "draft" || submission.status === "started"
    );
    if (isDraft) {
      const started = audits.find(a => a.new_values?.status === "started");
      const lastUpdated = findLast(audits, a => a.event === "updated" && a.new_values?.status == null);
      return [started, lastUpdated].filter((a): a is AuditWithStageName => a !== undefined);
    }

    const auditsWithStatus = audits.filter(a => a.new_values?.status != null);
    const result: AuditWithStageName[] = [];
    const usedUpdateIds = new Set<number>();

    for (let i = 0; i < auditsWithStatus.length; i++) {
      const currentStatusAudit = auditsWithStatus[i];
      result.push(currentStatusAudit);

      const nextStatusAudit = auditsWithStatus[i + 1];

      const updatedInBetween = findLast(
        audits,
        a =>
          a.event === "updated" &&
          !a.new_values?.status &&
          !usedUpdateIds.has(a.id ?? 0) &&
          new Date(a.created_at as string) > new Date(currentStatusAudit.created_at as string) &&
          (!nextStatusAudit || new Date(a.created_at as string) < new Date(nextStatusAudit.created_at as string))
      );

      if (updatedInBetween != null) {
        result.push(updatedInBetween);
        usedUpdateIds.add(updatedInBetween.id ?? 0);
      }
    }

    return sortBy(result, item => new Date(item.created_at ?? 0)).reverse();
  }, [application?.form_submissions]);

  return (
    <section>
      <Text variant="text-bold-headline-1000">{t("Application Timeline")}</Text>

      <div className="mt-8 rounded-lg border border-neutral-100 bg-white p-8 shadow">
        <Table<AuditWithStageName>
          columns={[
            {
              accessorKey: "created_at",
              header: t("Date"),
              enableSorting: false,
              cell: props => (
                <Text variant="text-light-body-300" className="whitespace-nowrap">
                  {format(props.getValue() as string, "do MMMM yyyy")}
                </Text>
              )
            },
            {
              accessorKey: "new_values.status",
              header: t("Update"),
              enableSorting: false,
              cell: props => {
                const value = props.getValue();
                const text = getApplicationUpdateText(t, props.row) || value;
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
              accessorKey: "new_values.feedback",
              header: t("Comments"),
              enableSorting: false,
              cell: props => <ReadMoreText variant="text-light-body-300">{props.getValue() as string}</ReadMoreText>
            }
          ]}
          data={filteredAudits}
          variant={VARIANT_TABLE_SECONDARY}
        />
      </div>
    </section>
  );
};

export default ApplicationTimeline;
