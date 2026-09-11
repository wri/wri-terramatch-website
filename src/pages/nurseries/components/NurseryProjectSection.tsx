import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { loadFullNursery, loadFullProject, loadNurseryIndex } from "@/connections/Entity";
import type { NurseryLightDto, ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import ListSectionHeader from "@/redesignComponents/containers/Accordion/ListSectionHeader";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { FolderIcon, FolderOpenIcon, LoadingIcon, SeedlingsIcon } from "@/redesignComponents/foundations/Icons";
import TextBadge from "@/redesignComponents/status/Badge/TextBadge";
import Log from "@/utils/log";

import { useNurseryTableSelection } from "../NurseriesSelection.provider";
import type { NurseryIndexProjectSection, NurseryIndexRow } from "../nurseryIndex.types";
import { buildSeedlingsGrownMetric, sumNurserySeedlingsGrown, toNurseryIndexRows } from "../nurseryIndex.utils";
import { loadAllIndexPages, SECTION_NURSERIES_PAGE_SIZE } from "../useNurseriesIndexData";
import NurseryIndexTable from "./NurseryIndexTable";

type NurseryProjectSectionProps = {
  section: NurseryIndexProjectSection;
  isFiltered?: boolean;
  defaultOpen?: boolean;
};

const loadNurserySeedlingGoals = async (nurseries: NurseryLightDto[]) => {
  const results = await Promise.all(
    nurseries.map(nursery =>
      loadFullNursery({ id: nursery.uuid }).catch(error => {
        Log.error("Failed to load full nursery for seedlings goal", error);
        return null;
      })
    )
  );

  const goalsByUuid = new Map<string, number | null>();
  results.forEach(result => {
    if (result?.data == null) return;
    goalsByUuid.set(result.data.uuid, result.data.seedlingGrown);
  });

  return goalsByUuid;
};

const useNurserySectionDetails = (section: NurseryIndexProjectSection, open: boolean) => {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [nurseries, setNurseries] = useState<NurseryIndexRow[]>(section.nurseries);
  const [fullProject, setFullProject] = useState<ProjectFullDto | null>(null);
  const sectionRef = useRef(section);
  sectionRef.current = section;

  useEffect(() => {
    if (!loaded) {
      setNurseries(section.nurseries);
    }
  }, [loaded, section.nurseries]);

  useEffect(() => {
    setLoaded(false);
    setFullProject(null);
    setNurseries(sectionRef.current.nurseries);
  }, [section.id]);

  useEffect(() => {
    if (!open || loaded) return;

    let cancelled = false;
    const currentSection = sectionRef.current;

    const loadDetails = async () => {
      setLoading(true);

      try {
        const projectUuid = currentSection.projectUuid;
        if (projectUuid == null) {
          if (cancelled) return;
          setNurseries(currentSection.nurseries);
          setLoaded(true);
          return;
        }

        const [projectResult, loadedNurseries] = await Promise.all([
          loadFullProject({ id: projectUuid }).catch(error => {
            Log.error("Failed to load full project for nursery section metrics", error);
            return null;
          }),
          loadAllIndexPages<NurseryLightDto>(
            pageNumber =>
              loadNurseryIndex({
                pageNumber,
                pageSize: SECTION_NURSERIES_PAGE_SIZE,
                sortField: "name",
                sortDirection: "ASC",
                filter: { projectUuid }
              }),
            SECTION_NURSERIES_PAGE_SIZE
          )
        ]);

        const project = projectResult?.data ?? null;
        let rows = toNurseryIndexRows(loadedNurseries, project ?? undefined);
        const projectGoal = project?.nurserySeedlingsGoal;
        if (!cancelled && (projectGoal == null || projectGoal <= 0)) {
          const goalsByUuid = await loadNurserySeedlingGoals(loadedNurseries);
          rows = rows.map(row => ({
            ...row,
            seedlingGrown: goalsByUuid.get(row.uuid) ?? null
          }));
        }

        if (cancelled) return;

        setFullProject(project);
        setNurseries(rows);
        setLoaded(true);
      } catch (error) {
        Log.error("Failed to load nursery section details", error);
        if (!cancelled) {
          setNurseries(currentSection.nurseries);
          setLoaded(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadDetails();

    return () => {
      cancelled = true;
    };
  }, [loaded, open, section.id, section.projectUuid]);

  const seedlingsGrown = useMemo(
    () => buildSeedlingsGrownMetric(nurseries, fullProject ?? undefined),
    [fullProject, nurseries]
  );

  return { nurseries, seedlingsGrown, loading };
};

const NurseryProjectSection = ({ section, isFiltered = false, defaultOpen = false }: NurseryProjectSectionProps) => {
  const t = useT();
  const [open, setOpen] = useState(defaultOpen);
  const { nurseries, seedlingsGrown, loading } = useNurserySectionDetails(section, open);
  const { selectedRows } = useNurseryTableSelection(nurseries);
  const attentionCount = useMemo(
    () => nurseries.filter(nursery => nursery.status === "information-required").length,
    [nurseries]
  );
  const filteredSeedlings = useMemo(() => sumNurserySeedlingsGrown(nurseries), [nurseries]);
  const selectedSeedlings = useMemo(() => sumNurserySeedlingsGrown(selectedRows), [selectedRows]);

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
      <Flex p={4} bg="neutral.100" gap={5} flexDirection="column">
        {open && loading ? (
          <Flex minHeight="8rem" alignItems="center" justifyContent="center" gap={3}>
            <LoadingIcon boxSize={5} className="animate-spin" color="primary.700" />
            <Text textStyle="400" color="neutral.800">
              {t("Loading nurseries...")}
            </Text>
          </Flex>
        ) : null}
        {open && !loading ? (
          <>
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
            <NurseryIndexTable nurseries={nurseries} />
          </>
        ) : null}
      </Flex>
    </Accordion>
  );
};

export default NurseryProjectSection;
