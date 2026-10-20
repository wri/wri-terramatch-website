import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useMemo } from "react";

import type { ProjectNurseriesMetaDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { InfiniteScrollSentinel } from "@/hooks/useInfiniteScrollSentinel";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { LoadingIcon, SeedlingsIcon } from "@/redesignComponents/foundations/Icons";

import { useNurseryTableSelection } from "../NurseriesSelection.provider";
import { sumNurserySeedlingsGrown } from "../nurseryIndex.utils";
import type { useNurseryProjectRows } from "../useNurseryProjectRows";
import NurseryIndexTable from "./NurseryIndexTable";

const SEEDLINGS_GROWN_TOOLTIP =
  "This is the total number of seedlings grown from all approved nursery reports for this project.";

type NurseryProjectRows = ReturnType<typeof useNurseryProjectRows>;

type NurseryProjectBodyProps = {
  meta: ProjectNurseriesMetaDto;
  nurseries: NurseryProjectRows;
  isFiltered: boolean;
  embeddedInProject?: boolean;
};

/** Seedlings metric and nursery table for one project. The data comes from the parent's rows hook. */
const NurseryProjectBody: FC<NurseryProjectBodyProps> = ({
  meta,
  nurseries,
  isFiltered,
  embeddedInProject = false
}) => {
  const t = useT();
  const { selectedRows } = useNurseryTableSelection(nurseries.rows);
  const selectedSeedlings = useMemo(() => sumNurserySeedlingsGrown(selectedRows), [selectedRows]);

  return (
    <Flex p={4} bg="neutral.100" gap={5} flexDirection="column">
      {!nurseries.goalLoaded ? (
        <Flex minHeight="3rem" alignItems="center" gap={3}>
          <LoadingIcon boxSize={5} className="animate-spin" color="primary.700" />
          <Text textStyle="400" color="neutral.800">
            {t("Loading seedlings goal...")}
          </Text>
        </Flex>
      ) : (
        <MetricCard
          className="w-fit min-w-[16rem]"
          goal={nurseries.goal}
          icon={<SeedlingsIcon />}
          progress={meta.seedlingsGrownTotal}
          title={t("Seedlings Grown")}
          tooltipContent={t(SEEDLINGS_GROWN_TOOLTIP)}
          variant="progressBar"
          color="secondary.600"
          selection={selectedRows.length > 0 ? selectedSeedlings : undefined}
          filtered={isFiltered ? meta.seedlingsGrownMatching : undefined}
        />
      )}
      {!nurseries.loaded ? (
        <Flex minHeight="3rem" alignItems="center" gap={3}>
          <LoadingIcon boxSize={5} className="animate-spin" color="primary.700" />
          <Text textStyle="400" color="neutral.800">
            {t("Loading...")}
          </Text>
        </Flex>
      ) : (
        <>
          <NurseryIndexTable nurseries={nurseries.rows} embeddedInProject={embeddedInProject} />
          <InfiniteScrollSentinel
            hasMore={nurseries.hasMore}
            loading={!nurseries.loaded}
            loadingMore={nurseries.loadingMore}
            label={t("Loading nurseries...")}
            resetKey={nurseries.rows.length}
            onLoadMore={nurseries.loadMore}
          />
        </>
      )}
    </Flex>
  );
};

export default NurseryProjectBody;
