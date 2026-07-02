import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import { CheckApprovedIcon } from "@/redesignComponents/foundations/Icons";

import type { PolygonStatusChangeComment } from "../../../utils/polygonStatusChangeComment";
import PolygonStatusChangeResultModal from "../PolygonStatusChangeResultModal";

export interface PolygonApprovedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  polygons: string[];
  comment?: PolygonStatusChangeComment | null;
}

const PolygonApproved: FC<PolygonApprovedProps> = ({ open, onOpenChange, polygons, comment }) => {
  const t = useT();

  return (
    <PolygonStatusChangeResultModal
      open={open}
      onOpenChange={onOpenChange}
      polygons={polygons}
      comment={comment}
      singleTitle={t("Polygon approved")}
      pluralTitle={t("Polygons approved")}
      renderSingleContent={polygonName => (
        <Flex justifyContent="center" alignItems="center" flexDirection="column" pt={2} px={4}>
          <CheckApprovedIcon boxSize={8} color={"success.500"} mb={2} />
          <Text textStyle="500-bold" color="neutral.900" textAlign="center">
            {polygonName}
          </Text>
          <Text textStyle="400" color="neutral.900">
            {t("has been approved.")}
          </Text>
        </Flex>
      )}
      renderPluralLeadContent={() => (
        <Text textStyle="400" color="neutral.900" display={"flex"} gap={0.5} mb={3} alignItems={"center"}>
          <CheckApprovedIcon boxSize={4} color={"success.500"} mr={2} />
          {t("The following Polygons")}
          <Text textStyle="400-bold" color="neutral.900" ml={0.5}>
            {t("have been approved:")}
          </Text>
        </Text>
      )}
    />
  );
};

export default PolygonApproved;
