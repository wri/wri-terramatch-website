import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useEffect, useState } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { WarningIcon } from "@/redesignComponents/foundations/Icons";

type PolygonAnomalyStepperProps = {
  /** Ordered, deduped flagged-polygon uuids from `useProjectAnomalies`. */
  anomalyUuids: string[];
  /** Step to a polygon: zoom/focus it on the map and highlight its table row. */
  onStepToPolygon: (polygonUuid: string) => void;
};

/**
 * The design deck's "step through anomalies" control (`‹ ⚠ i of N ›`). Purely a local index +
 * callback — focusing/zooming and table highlight are the caller's responsibility (see
 * `ProjectPolygonsWorkspace`'s `focusPolygonUuid` / `setPolygonTableHoveredUuid` wiring).
 */
const PolygonAnomalyStepper: FC<PolygonAnomalyStepperProps> = ({ anomalyUuids, onStepToPolygon }) => {
  const t = useT();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= anomalyUuids.length) {
      setIndex(0);
    }
  }, [anomalyUuids.length, index]);

  if (anomalyUuids.length === 0) {
    return null;
  }

  const step = (delta: number): void => {
    const nextIndex = (index + delta + anomalyUuids.length) % anomalyUuids.length;
    setIndex(nextIndex);
    onStepToPolygon(anomalyUuids[nextIndex]);
  };

  return (
    <Flex className="items-center gap-2 rounded border border-theme-neutral-300 px-2 py-1">
      <Button
        variant="borderless"
        size="small"
        aria-label={t("Previous anomaly")}
        onClick={() => step(-1)}
        className="!min-w-0 !px-1"
      >
        ‹
      </Button>
      <WarningIcon className="!text-theme-error-600" />
      <Text textStyle="300" whiteSpace="nowrap">
        {t("{index} of {total}", { index: index + 1, total: anomalyUuids.length })}
      </Text>
      <Button
        variant="borderless"
        size="small"
        aria-label={t("Next anomaly")}
        onClick={() => step(1)}
        className="!min-w-0 !px-1"
      >
        ›
      </Button>
    </Flex>
  );
};

export default PolygonAnomalyStepper;
