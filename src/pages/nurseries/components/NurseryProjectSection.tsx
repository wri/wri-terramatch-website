import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useEffect, useMemo, useState } from "react";

import { loadFullProject } from "@/connections/Entity";
import type { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import ListSectionHeader from "@/redesignComponents/containers/Accordion/ListSectionHeader";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { FolderIcon, FolderOpenIcon, LoadingIcon, SeedlingsIcon } from "@/redesignComponents/foundations/Icons";
import TextBadge from "@/redesignComponents/status/Badge/TextBadge";
import Log from "@/utils/log";

import { useNurseryTableSelection } from "../NurseriesSelection.provider";
import type { NurseryIndexProjectSection } from "../nurseryIndex.types";
import {
  buildSeedlingsGrownMetric,
  filterNurseryProjectSections,
  sumNurserySeedlingsGrown
} from "../nurseryIndex.utils";
import NurseryIndexTable from "./NurseryIndexTable";

type NurseryProjectSectionProps = {
  section: NurseryIndexProjectSection;
  query?: string;
  statuses?: string[];
  updates?: string[];
  isFiltered?: boolean;
  defaultOpen?: boolean;
  openResetKey?: string;
};

const NurseryProjectSection = ({
  section,
  query = "",
  statuses = [],
  updates = [],
  isFiltered = false,
  defaultOpen = false,
  openResetKey
}: NurseryProjectSectionProps) => {
  const t = useT();
  const [open, setOpen] = useState(defaultOpen);
  const [fullProject, setFullProject] = useState<ProjectFullDto | null>(null);
  const [goalReady, setGoalReady] = useState(section.projectUuid == null);
  const nurseries = section.nurseries;
  const visibleNurseries = useMemo(
    () =>
      filterNurseryProjectSections([{ ...section, nurseries }], query, undefined, statuses, updates)[0]?.nurseries ??
      [],
    [nurseries, query, section, statuses, updates]
  );
  const { selectedRows } = useNurseryTableSelection(visibleNurseries);
  const attentionCount = useMemo(
    () => nurseries.filter(nursery => nursery.status === "information-required").length,
    [nurseries]
  );
  const seedlingsGrown = useMemo(
    () => buildSeedlingsGrownMetric(nurseries, fullProject ?? undefined),
    [fullProject, nurseries]
  );
  const filteredSeedlings = useMemo(() => sumNurserySeedlingsGrown(visibleNurseries), [visibleNurseries]);
  const selectedSeedlings = useMemo(() => sumNurserySeedlingsGrown(selectedRows), [selectedRows]);

  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen, openResetKey]);

  useEffect(() => {
    if (!open || fullProject != null) return;
    if (section.projectUuid == null) {
      setGoalReady(true);
      return;
    }

    let cancelled = false;
    setGoalReady(false);

    const loadGoal = async () => {
      try {
        const result = await loadFullProject({ id: section.projectUuid as string });
        const project = result.data ?? null;
        if (!cancelled && project != null && project.lightResource === false) {
          setFullProject(project);
        }
      } catch (error) {
        Log.error("Failed to load full project for nursery section metrics", error);
      } finally {
        if (!cancelled) setGoalReady(true);
      }
    };

    void loadGoal();

    return () => {
      cancelled = true;
    };
  }, [fullProject, open, section.projectUuid]);

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
              <FolderOpenIcon minWidth={5} width={5} height="auto" color="primary.600" mt={2} mb='auto' />
            ) : (
              <FolderIcon minWidth={5} width={5} height="auto" color="primary.600" mt={2} mb='auto' />
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
      <Flex p={4} bg="neutral.100" gap={5} flexDirection="column">
        {open && !goalReady ? (
          <Flex minHeight="3rem" alignItems="center" gap={3}>
            <LoadingIcon boxSize={5} className="animate-spin" color="primary.700" />
            <Text textStyle="400" color="neutral.800">
              {t("Loading seedlings goal...")}
            </Text>
          </Flex>
        ) : null}
        {open && goalReady ? (
          <MetricCard
            className="w-fit min-w-[16rem]"
            goal={seedlingsGrown.goal}
            icon={<SeedlingsIcon />}
            progress={seedlingsGrown.progress}
            title={t("Seedlings Grown")}
            tooltipContent={t("Number of seedlings grown for this project")}
            variant="progressBar"
            color="secondary.600"
            selection={selectedRows.length > 0 ? selectedSeedlings : undefined}
            filtered={isFiltered ? filteredSeedlings : undefined}
          />
        ) : null}
        {open ? <NurseryIndexTable nurseries={visibleNurseries} /> : null}
      </Flex>
    </Accordion>
  );
};

export default NurseryProjectSection;
