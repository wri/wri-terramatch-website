import { useT } from "@transifex/react";
import { useEffect, useMemo, useState } from "react";

import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import ListSectionHeader from "@/redesignComponents/containers/Accordion/ListSectionHeader";
import { FolderIcon, FolderOpenIcon, SeedlingsIcon } from "@/redesignComponents/foundations/Icons";
import TextBadge from "@/redesignComponents/status/Badge/TextBadge";

import type { NurseryIndexProjectSection } from "../nurseryIndex.types";
import NurseryIndexTable from "./NurseryIndexTable";
import  MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { Flex } from "@chakra-ui/react";


type NurseryProjectSectionProps = {
  section: NurseryIndexProjectSection;
  defaultOpen?: boolean;
};

const NurseryProjectSection = ({ section, defaultOpen = false }: NurseryProjectSectionProps) => {
  const t = useT();
  const [open, setOpen] = useState(defaultOpen);
  const attentionCount = useMemo(
    () => section.nurseries.filter(nursery => nursery.status === "information-required").length,
    [section.nurseries]
  );

  useEffect(() => {
    if (defaultOpen) setOpen(true);
  }, [defaultOpen]);

  return (
    <Accordion
      variant="tertiary"
      open={open}
      onOpenChange={setOpen}
      className="overflow-hidden rounded bg-theme-neutral-100"
      classNameHeader="!mb-0"
      header={
        <ListSectionHeader
          level="top-level"
          title={section.projectName}
          titleHref={section.projectUuid == null ? undefined : `/project/${section.projectUuid}`}
          caption={section.organisationName ?? ""}
          icon={
            open ? (
              <FolderOpenIcon minWidth={5} width={5} height="auto" color="primary.600" />
            ) : (
              <FolderIcon minWidth={5} width={5} height="auto" color="neutral.400" />
            )
          }
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
      <Flex p={4} bg='neutral.100' gap={5} flexDirection="column">
        <MetricCard
            className="w-[16rem]"
            goal={1000}
            icon={<SeedlingsIcon />}
            progress={750}
            title="Seedlings Grown"
            tooltipContent="Number of seedlings grown for this project"
            variant="progressBar"
            color="secondary.600"
            selection={10000}
            filtered={2500}
          />
        {open ? <NurseryIndexTable nurseries={section.nurseries} /> : null}
      </Flex>
    </Accordion>
  );
};

export default NurseryProjectSection;
