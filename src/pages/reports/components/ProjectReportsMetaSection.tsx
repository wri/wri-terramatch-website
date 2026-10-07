import sumBy from "lodash/sumBy";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

import { ProjectReportMetaDto } from "@/generated/v3/entityService/entityServiceSchemas";

import { AdditionalReportsEntitySection, ReportsIndexProjectSection } from "../reportIndex.types";
import { findProgressReportLocation } from "../reportIndex.utils";
import { useReportsIndexData } from "../useReportsIndexData";
import { useReportsIndexFilters } from "../useReportsIndexFilters";
import ProjectReportsSection from "./ProjectReportsSection";

const NO_ADDITIONAL_SECTIONS: AdditionalReportsEntitySection[] = [];

type ProjectReportsMetaSectionProps = {
  meta: ProjectReportMetaDto;
  query: string;
  expandForPeriodFilter: boolean;
  hasReportSubset: boolean;
  indexHref: string;
  restoreReportId?: string;
  onRowRestored: () => void;
};

/**
 * A project section in the "All Projects" view. It is rendered from the project's report meta while
 * collapsed, and only loads the project's reports once it has been opened.
 */
const ProjectReportsMetaSection: FC<ProjectReportsMetaSectionProps> = ({
  meta,
  query,
  expandForPeriodFilter,
  hasReportSubset,
  indexHref,
  restoreReportId,
  onRowRestored
}) => {
  const { uuid, organisationName } = meta;
  const { name } = meta.project;
  const [loadRequested, setLoadRequested] = useState(restoreReportId != null);
  const handleOpen = useCallback(() => setLoadRequested(true), []);

  const project = useMemo(
    () => ({ uuid, name, organisationName, organisationUuid: null }),
    [name, organisationName, uuid]
  );
  const { sections, loading } = useReportsIndexData(project, "project", uuid, loadRequested);
  const { filteredProgressSections } = useReportsIndexFilters({
    progressSections: sections,
    additionalSections: NO_ADDITIONAL_SECTIONS,
    query
  });

  const section = useMemo(
    (): ReportsIndexProjectSection =>
      filteredProgressSections[0] ?? { id: uuid, name, organisationName, organisationUuid: null, periods: [] },
    [filteredProgressSections, name, organisationName, uuid]
  );

  const restoreLocation = useMemo(
    () => (restoreReportId == null ? null : findProgressReportLocation(filteredProgressSections, restoreReportId)),
    [filteredProgressSections, restoreReportId]
  );
  useEffect(() => {
    // The report to restore isn't in this project's (filtered) reports, so there's nothing to restore.
    if (restoreReportId != null && loadRequested && !loading && restoreLocation == null) onRowRestored();
  }, [loadRequested, loading, onRowRestored, restoreLocation, restoreReportId]);

  const attentionCount = useMemo(
    () =>
      meta.project.reportsRequiringAttention +
      sumBy(Object.values(meta.sites), "reportsRequiringAttention") +
      sumBy(Object.values(meta.nurseries), "reportsRequiringAttention"),
    [meta.nurseries, meta.project, meta.sites]
  );

  return (
    <ProjectReportsSection
      section={section}
      unfilteredPeriods={sections[0]?.periods}
      attentionCount={attentionCount}
      loading={loadRequested && loading}
      onOpen={handleOpen}
      // Opening every project for a period filter would load every project's reports, so the
      // period filter only expands a project once it has been opened.
      expandForPeriodFilter={expandForPeriodFilter && loadRequested}
      metricsReady={!loading}
      hasReportSubset={hasReportSubset}
      indexHref={indexHref}
      restoreSectionId={restoreReportId == null ? undefined : uuid}
      restorePeriodId={restoreLocation?.periodId}
      restoreReportId={restoreReportId}
      onRowRestored={onRowRestored}
    />
  );
};

export default ProjectReportsMetaSection;
