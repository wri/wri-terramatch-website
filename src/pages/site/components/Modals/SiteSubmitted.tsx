import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback } from "react";

import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import { CheckApprovedIcon } from "@/redesignComponents/foundations/Icons";

import SiteNameList from "./SiteNameList";

export interface SiteSubmittedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siteNames: string[];
}

const SiteSubmitted: FC<SiteSubmittedProps> = ({ open, onOpenChange, siteNames }) => {
  const t = useT();
  const isSingleSite = siteNames.length === 1;

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
          {isSingleSite ? t("Site submitted") : t("Sites submitted")}
        </Text>
      }
      content={
        isSingleSite ? (
          <Flex justifyContent="center" alignItems="center" flexDirection="column" pt={2} px={4}>
            <CheckApprovedIcon boxSize={8} color="success.500" mb={2} />
            <Text textStyle="500-bold" color="neutral.900" textAlign="center">
              {siteNames[0]}
            </Text>
            <Text textStyle="400" color="neutral.900">
              {t("has been submitted.")}
            </Text>
          </Flex>
        ) : (
          <Box px={4}>
            <Text textStyle="400" color="neutral.900" display="flex" gap={0.5} mb={3} alignItems="center">
              <CheckApprovedIcon boxSize={5} color="success.500" mr={2} />
              {t("The following Sites")}
              <Text textStyle="400-bold" color="neutral.900" ml={0.5}>
                {t("have been submitted:")}
              </Text>
            </Text>
            <SiteNameList names={siteNames} />
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

export default SiteSubmitted;
