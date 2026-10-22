import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, ReactNode, useCallback, useRef, useState } from "react";

import { ProjectMapEntryDto } from "@/generated/v3/researchService/researchServiceSchemas";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import QaStatusTag from "@/redesignComponents/actions/Tags/QaStatusTag/QaStatusTag";
import { AreaHectaresIcon, PolygonsIcon, TreeCircleIcon } from "@/redesignComponents/foundations/Icons";
import MapPopUp from "@/redesignComponents/geospatial/MapPopUp/MapPopUp";

import {
  formatAreaHectaresForPopup,
  formatTreesPlantedForPopup,
  POPUP_METRIC_UNAVAILABLE
} from "../sitePolygonPopupUtils";

export type ProjectMarkerPopupProps = {
  project: ProjectMapEntryDto;
  onClose: () => void;
  onViewProjectPolygons: (projectUuid: string) => void;
};

const MetricRow: FC<{ icon: ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <Flex alignItems="center" justifyContent="space-between" gap={8}>
    <Flex alignItems="center" gap={2}>
      {icon}
      <Text color="neutral.700" textStyle="400" textWrap="nowrap">
        {label}
      </Text>
    </Flex>
    <Text color="neutral.900" textStyle="400-bold" textWrap="nowrap">
      {value}
    </Text>
  </Flex>
);

const ProjectMarkerPopup: FC<ProjectMarkerPopupProps> = ({ project, onClose, onViewProjectPolygons }) => {
  const t = useT();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(true);
  const { uuid, name, sumNumTrees, sumCalcArea, polygonCount, latestQaCycle, latestQaStatus } = project;

  const closePopup = useCallback(() => {
    setOpen(false);
    onClose();
  }, [onClose]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) closePopup();
    },
    [closePopup]
  );

  const viewProjectPolygons = useCallback(() => {
    closePopup();
    onViewProjectPolygons(uuid);
  }, [closePopup, onViewProjectPolygons, uuid]);

  const title = name != null && name !== "" ? name : t("Unnamed Project");

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-hidden
        tabIndex={-1}
        className="pointer-events-none block h-10 w-10 opacity-0"
      />
      <MapPopUp
        anchorRef={triggerRef}
        open={open}
        onOpenChange={handleOpenChange}
        closeOnOutsideClick
        placement="right"
        header={
          <Text textStyle="400-bold" color="neutral.900">
            {title}
          </Text>
        }
        content={
          <Flex padding="0.75rem" direction="column" gap={4} minWidth="20rem">
            <MetricRow
              icon={<TreeCircleIcon boxSize={6} />}
              label={t("Trees planted")}
              value={formatTreesPlantedForPopup(sumNumTrees)}
            />
            <MetricRow
              icon={
                <Flex
                  h={6}
                  w={6}
                  alignItems="center"
                  justifyContent="center"
                  borderColor="secondary.500"
                  borderWidth="1px"
                  backgroundColor="secondary.300"
                  borderRadius="full"
                >
                  <AreaHectaresIcon boxSize={3.5} color="secondary.800" />
                </Flex>
              }
              label={t("Restoration area")}
              value={t("{area} ha", { area: formatAreaHectaresForPopup(sumCalcArea) })}
            />
            <MetricRow
              icon={
                <Flex h={6} w={6} alignItems="center" justifyContent="center">
                  <PolygonsIcon boxSize={4} color="neutral.800" />
                </Flex>
              }
              label={t("Polygons")}
              value={polygonCount.toLocaleString()}
            />
            <Flex alignItems="center" justifyContent="space-between" gap={8}>
              <Text color="neutral.700" textStyle="400" textWrap="nowrap">
                {latestQaCycle != null ? t("QA · Cycle {cycle}", { cycle: latestQaCycle }) : t("QA")}
              </Text>
              {latestQaStatus != null ? (
                <QaStatusTag status={latestQaStatus} size="small" />
              ) : (
                <Text color="neutral.900" textStyle="400-bold">
                  {POPUP_METRIC_UNAVAILABLE}
                </Text>
              )}
            </Flex>
          </Flex>
        }
        footer={
          <Button variant="primary" size="small" onClick={viewProjectPolygons}>
            {t("View Project Polygons")}
          </Button>
        }
      />
    </>
  );
};

export default ProjectMarkerPopup;
