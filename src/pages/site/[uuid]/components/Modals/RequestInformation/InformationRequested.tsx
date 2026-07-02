import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import { CheckApprovedIcon } from "@/redesignComponents/foundations/Icons";

import type { PolygonStatusChangeComment } from "../../../utils/polygonStatusChangeComment";
import PolygonStatusChangeResultModal from "../PolygonStatusChangeResultModal";

export interface InformationRequestedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  polygons: string[];
  comment?: PolygonStatusChangeComment | null;
}

const InformationRequested: FC<InformationRequestedProps> = ({ open, onOpenChange, polygons, comment }) => {
  const t = useT();

  return (
    <PolygonStatusChangeResultModal
      open={open}
      onOpenChange={onOpenChange}
      polygons={polygons}
      comment={comment}
      singleTitle={t("Information requested")}
      pluralTitle={t("Information requested")}
      renderSingleContent={polygonName => (
        <Flex justifyContent="center" alignItems="center" flexDirection="column" pt={2} px={4}>
          <CheckApprovedIcon boxSize={8} color={"success.500"} mb={2} />
          <Text textStyle="400" color="neutral.900" textAlign="center">
            {t("Additional information has been requested for")}
          </Text>
          <Text textStyle="500-bold" color="neutral.900" textAlign="center">
            {polygonName}
          </Text>
        </Flex>
      )}
      renderPluralLeadContent={() => (
        <Text textStyle="400" color="neutral.900" display={"flex"} gap={0.5} mb={3} alignItems={"center"}>
          <CheckApprovedIcon boxSize={4} color={"success.500"} mr={2} />
          <Text as="span" textStyle="400-bold" color="neutral.900" mr={0.5}>
            {t("Additional information")}
          </Text>
          {t("has been requested for the following polygons:")}
        </Text>
      )}
    />
  );
};

export default InformationRequested;
