import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useCallback, useMemo, useRef, useState } from "react";

import PopupHeaderPolygon from "@/components/elements/Map-mapbox/components/PopupPolygon/PopupHeaderPolygon";
import type { PopupComponentProps } from "@/components/elements/Map-mapbox/Map.d";
import {
  findSitePolygonByMapFeatureUuid,
  formatAreaHectaresForPopup,
  formatTreesPlantedForPopup,
  normalizePolygonValidationStatus
} from "@/components/elements/Map-mapbox/sitePolygonPopupUtils";
import ValidationTag from "@/redesignComponents/actions/Tags/ValidationTag/ValidationTag";
import MapPopUp from "@/redesignComponents/geospatial/MapPopUp/MapPopUp";
import PointMarker from "@/redesignComponents/geospatial/PointMarker/PointMarker";

/**
 * TEMPORARY explorer-only popup. Intentionally isolated from PolygonPopupChampions so
 * site / dashboard maps keep Close / View details and their existing content.
 * Click outside (map background) closes via the shared popup coordinator.
 */
export function ExplorerPolygonPopup({ feature, popup, sitePolygonData }: PopupComponentProps) {
  const t = useT();
  const [open, setOpen] = useState(true);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const polygonUuid = (feature.properties?.uuid ?? "") as string;
  const sitePolygon = useMemo(
    () => findSitePolygonByMapFeatureUuid(sitePolygonData, polygonUuid),
    [polygonUuid, sitePolygonData]
  );

  const closeMapPopup = useCallback(() => {
    setOpen(false);
    popup?.remove();
  }, [popup]);

  const content = useMemo(() => {
    const siteName = sitePolygon?.siteName?.trim() || "—";
    const projectName = sitePolygon?.projectName?.trim() || sitePolygon?.projectShortName?.trim() || "—";
    const treesPlanted = formatTreesPlantedForPopup(sitePolygon?.numTrees);
    const areaHectares = formatAreaHectaresForPopup(sitePolygon?.calcArea);
    const validationStatus = normalizePolygonValidationStatus(sitePolygon?.validationStatus);

    return (
      <Flex padding="0.75rem" direction="column" gap={3} minWidth="20rem">
        <Flex alignItems="center" justifyContent="space-between" gap={4}>
          <Text color="neutral.700" textStyle="400" textWrap="nowrap">
            {t("Site")}
          </Text>
          <Text color="neutral.900" textStyle="400-bold" textAlign="right">
            {siteName}
          </Text>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between" gap={4}>
          <Text color="neutral.700" textStyle="400" textWrap="nowrap">
            {t("Project")}
          </Text>
          <Text color="neutral.900" textStyle="400-bold" textAlign="right">
            {projectName}
          </Text>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between" gap={4}>
          <Text color="neutral.700" textStyle="400" textWrap="nowrap">
            {t("Trees Planted")}
          </Text>
          <Text color="neutral.900" textStyle="400-bold">
            {treesPlanted}
          </Text>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between" gap={4}>
          <Text color="neutral.700" textStyle="400" textWrap="nowrap">
            {t("Area (ha)")}
          </Text>
          <Text color="neutral.900" textStyle="400-bold">
            {areaHectares}
          </Text>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between" gap={4}>
          <Text color="neutral.700" textStyle="400" textWrap="nowrap">
            {t("Validation")}
          </Text>
          <ValidationTag status={validationStatus} />
        </Flex>
      </Flex>
    );
  }, [sitePolygon, t]);

  return (
    <>
      <PointMarker variant="simple-pin" onClick={() => setOpen(true)} triggerRef={triggerRef} showFocusState={open} />
      <MapPopUp
        anchorRef={triggerRef}
        content={content}
        placement="right"
        open={open}
        onOpenChange={nextOpen => {
          if (!nextOpen) {
            closeMapPopup();
          } else {
            setOpen(nextOpen);
          }
        }}
        header={<PopupHeaderPolygon polygonName={sitePolygon?.name ?? undefined} />}
      />
    </>
  );
}

export default ExplorerPolygonPopup;
