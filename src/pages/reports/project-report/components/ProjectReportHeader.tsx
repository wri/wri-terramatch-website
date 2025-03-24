import { useT } from "@transifex/react";
import Link from "next/link";
import { Else, If, Then } from "react-if";

import Button from "@/components/elements/Button/Button";
import PageHeader from "@/components/extensive/PageElements/Header/PageHeader";
import InlineLoader from "@/components/generic/Loading/InlineLoader";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { useGetExportEntityHandler } from "@/hooks/entity/useGetExportEntityHandler";
import { useFrameworkTitle } from "@/hooks/useFrameworkTitle";

interface ProjectReportHeaderProps {
  title: string;
  report: any;
}

const ProjectReportHeader = ({ title, report }: ProjectReportHeaderProps) => {
  const t = useT();

  const { handleExport, loading: exportLoader } = useGetExportEntityHandler(
    "project-reports",
    report.uuid,
    report.reportTitle
  );
  const { handleEdit } = useGetEditEntityHandler({
    entityName: "project-reports",
    entityUUID: report?.uuid,
    entityStatus: report?.status,
    updateRequestStatus: report?.updateRequestStatus
  });

  const subtitles = [report?.projectName, useFrameworkTitle()];

  return (
    <PageHeader className="h-[203px]" title={title} subtitles={subtitles} hasBackButton={false}>
      <If condition={report?.status === "started"}>
        <Then>
          <Button as={Link} href={`/entity/project-reports/edit/${report?.uuid}`}>
            {t("Continue Report")}
          </Button>
        </Then>
        <Else>
          <div className="flex gap-4">
            <Button variant="secondary" onClick={handleExport}>
              {t("Export")}
              <InlineLoader loading={exportLoader} />
            </Button>
            <Button onClick={handleEdit}>{t("Edit")}</Button>
          </div>
        </Else>
      </If>
    </PageHeader>
  );
};

export default ProjectReportHeader;
