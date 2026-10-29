import { useT } from "@transifex/react";
import { FC, memo, useCallback, useMemo, useState } from "react";

import type { ProjectNurseriesMetaDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useIndexAccordionOpen } from "@/hooks/useIndexAccordionOpen";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import ListSectionHeader from "@/redesignComponents/containers/Accordion/ListSectionHeader";
import TextBadge from "@/redesignComponents/status/Badge/TextBadge";

import { nurseryRequiresAttention } from "../nurseryIndex.utils";
import { type NurseryProjectFilters, useNurseryProjectRows } from "../useNurseryProjectRows";
import NurseryProjectBody from "./NurseryProjectBody";

type NurseryProjectSectionProps = {
  meta: ProjectNurseriesMetaDto;
  filters: NurseryProjectFilters;
  isFiltered?: boolean;
  defaultOpen?: boolean;
  openResetKey?: string;
};

/**
 * One project in the nurseries index. Its nurseries load the first time the section opens, the same way the
 * reports index loads each project's reports.
 */
const NurseryProjectSection: FC<NurseryProjectSectionProps> = ({
  meta,
  filters,
  isFiltered = false,
  defaultOpen = false,
  openResetKey
}) => {
  const t = useT();
  const [open, setOpen] = useIndexAccordionOpen({ defaultOpen, resetKey: openResetKey });
  const [loadRequested, setLoadRequested] = useState(defaultOpen);
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) setLoadRequested(true);
      setOpen(nextOpen);
    },
    [setOpen]
  );

  const nurseries = useNurseryProjectRows(meta, filters, loadRequested);
  const attentionCount = useMemo(
    () => nurseries.rows.filter(nursery => nurseryRequiresAttention(nursery)).length,
    [nurseries.rows]
  );

  return (
    <Accordion
      variant="tertiary"
      open={open}
      onOpenChange={handleOpenChange}
      className="overflow-hidden rounded bg-theme-neutral-100"
      classNameHeader="!mb-0"
      header={
        <ListSectionHeader
          level="top-level"
          title={meta.name ?? t("Project")}
          titleHref={`/project/${meta.uuid}`}
          caption={meta.organisationName ?? ""}
          open={open}
          statusLabels={
            <>
              {attentionCount > 0 ? (
                <TextBadge variant="primary">{t("{count} Require Attention", { count: attentionCount })}</TextBadge>
              ) : null}
            </>
          }
        />
      }
    >
      {open ? <NurseryProjectBody meta={meta} nurseries={nurseries} isFiltered={isFiltered} /> : null}
    </Accordion>
  );
};

export default memo(NurseryProjectSection);
