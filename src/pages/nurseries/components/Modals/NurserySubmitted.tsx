import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback } from "react";

import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import { CheckApprovedIcon } from "@/redesignComponents/foundations/Icons";

import NurseryNameList from "./NurseryNameList";

export interface NurserySubmittedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nurseryNames: string[];
}

const NurserySubmitted: FC<NurserySubmittedProps> = ({ open, onOpenChange, nurseryNames }) => {
  const t = useT();
  const isSingleNursery = nurseryNames.length === 1;

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="medium"
      header={
        <Text textStyle="400-bold" color="neutral.800">
          {isSingleNursery ? t("Nursery submitted") : t("Nurseries submitted")}
        </Text>
      }
      content={
        isSingleNursery ? (
          <Flex justifyContent="center" alignItems="center" flexDirection="column" pt={2} px={4}>
            <CheckApprovedIcon boxSize={8} color="success.500" mb={2} />
            <Text textStyle="500-bold" color="neutral.900" textAlign="center">
              {nurseryNames[0]}
            </Text>
            <Text textStyle="400" color="neutral.900">
              {t("has been submitted.")}
            </Text>
          </Flex>
        ) : (
          <Box px={4}>
            <Text textStyle="400" color="neutral.900" display="flex" gap={0.5} mb={3} alignItems="center">
              <CheckApprovedIcon boxSize={5} color="success.500" mr={2} />
              {t("The following Nurseries")}
              <Text textStyle="400-bold" color="neutral.900" ml={0.5}>
                {t("have been submitted:")}
              </Text>
            </Text>
            <NurseryNameList names={nurseryNames} />
          </Box>
        )
      }
      footer={
        <ButtonGroup
          buttons={[
            {
              id: "close",
              className: "!w-fit",
              variant: "secondary",
              children: t("Close"),
              autoFocus: true,
              onClick: handleClose
            }
          ]}
        />
      }
    />
  );
};

export default NurserySubmitted;
