import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useEffect, useMemo } from "react";

import type { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { LoadingIcon, SeedlingsIcon } from "@/redesignComponents/foundations/Icons";

import { useNurseryTableSelection } from "../NurseriesSelection.provider";
import type { NurseryIndexProjectSection } from "../nurseryIndex.types";
import {
  buildSeedlingsGrownMetric,
  filterNurseryProjectSections,
  sumNurserySeedlingsGrown
} from "../nurseryIndex.utils";
import NurseryIndexTable from "./NurseryIndexTable";

const SEEDLINGS_GROWN_TOOLTIP =
  "This is the total number of seedlings grown from all approved nursery reports for this project.";

type NurseryProjectIndexBodyProps = {
  section: NurseryIndexProjectSection;
  project: ProjectFullDto;
  query?: string;
  statuses?: string[];
  updates?: string[];
  isFiltered?: boolean;
  onProjectOpened?: (projectId: string) => void;
};

const NurseryProjectIndexBody: FC<NurseryProjectIndexBodyProps> = ({
  section,
  project,
  query = "",
  statuses = [],
  updates = [],
  isFiltered = false,
  onProjectOpened
}) => {
  const t = useT();
  const nurseries = section.nurseries;
  const visibleNurseries = useMemo(
    () =>
      filterNurseryProjectSections([{ ...section, nurseries }], query, project.uuid, statuses, updates)[0]?.nurseries ??
      [],
    [nurseries, project.uuid, query, section, statuses, updates]
  );
  const { selectedRows } = useNurseryTableSelection(visibleNurseries);
  const seedlingsGrown = useMemo(() => buildSeedlingsGrownMetric(nurseries, project), [nurseries, project]);
  const filteredSeedlings = useMemo(() => sumNurserySeedlingsGrown(visibleNurseries), [visibleNurseries]);
  const selectedSeedlings = useMemo(() => sumNurserySeedlingsGrown(selectedRows), [selectedRows]);

  useEffect(() => {
    if (section.projectUuid == null) return;
    onProjectOpened?.(section.projectUuid);
  }, [onProjectOpened, section.projectUuid]);

  return (
    <Box className="overflow-hidden rounded bg-theme-neutral-100">
      <Flex p={4} bg="neutral.100" gap={5} flexDirection="column">
        <MetricCard
          className="w-fit min-w-[16rem]"
          goal={seedlingsGrown.goal}
          icon={<SeedlingsIcon />}
          progress={seedlingsGrown.progress}
          title={t("Seedlings Grown")}
          tooltipContent={t(SEEDLINGS_GROWN_TOOLTIP)}
          variant="progressBar"
          color="secondary.600"
          selection={selectedRows.length > 0 ? selectedSeedlings : undefined}
          filtered={isFiltered ? filteredSeedlings : undefined}
        />
        {section.nurseriesLoaded === false ? (
          <Flex minHeight="3rem" alignItems="center" gap={3}>
            <LoadingIcon boxSize={5} className="animate-spin" color="primary.700" />
            <Text textStyle="400" color="neutral.800">
              {t("Loading...")}
            </Text>
          </Flex>
        ) : (
          <NurseryIndexTable nurseries={visibleNurseries} />
        )}
      </Flex>
    </Box>
  );
};

export default NurseryProjectIndexBody;
