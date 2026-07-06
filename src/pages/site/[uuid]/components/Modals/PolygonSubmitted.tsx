import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import { CheckApprovedIcon } from "@/redesignComponents/foundations/Icons";

import type { PolygonStatusChangeComment } from "../../utils/polygonStatusChangeComment";
import PolygonStatusChangeResultModal from "./PolygonStatusChangeResultModal";

export interface PolygonSubmittedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  polygons: string[];
  submittedComment?: PolygonStatusChangeComment | null;
}

const PolygonSubmitted: FC<PolygonSubmittedProps> = ({ open, onOpenChange, polygons, submittedComment }) => {
  const t = useT();

  return (
    <PolygonStatusChangeResultModal
      open={open}
      onOpenChange={onOpenChange}
      polygons={polygons}
      comment={submittedComment}
      singleTitle={t("Polygon submitted")}
      pluralTitle={t("Polygons submitted")}
      renderSingleContent={polygonName => (
        <Flex justifyContent="center" alignItems="center" flexDirection="column" pt={2} px={4}>
          <CheckApprovedIcon boxSize={8} color={"success.500"} mb={2} />
          <Text textStyle="500-bold" color="neutral.900" textAlign="center">
            {polygonName}
          </Text>
          <Text textStyle="400" color="neutral.900">
            {t("has been submitted.")}
          </Text>
        </Flex>
      )}
      renderPluralLeadContent={() => (
        <Text textStyle="400" color="neutral.900" display={"flex"} gap={0.5} mb={3} alignItems={"center"}>
          <CheckApprovedIcon boxSize={4} color={"success.500"} mr={2} />
          {t("The following Polygons")}
          <Text textStyle="400-bold" color="neutral.900" ml={0.5}>
            {t("have been submitted:")}
          </Text>
        </Text>
      )}
    />
  );
};

export default PolygonSubmitted;
