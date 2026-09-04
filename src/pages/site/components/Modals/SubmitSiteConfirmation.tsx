import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useState } from "react";

import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";

import type { SiteIndexSite } from "../siteIndexMockData";
import SiteNameList from "./SiteNameList";

export interface SubmitSiteConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sites: SiteIndexSite[];
  onSubmit?: () => void | Promise<void>;
}

const SubmitSiteConfirmation: FC<SubmitSiteConfirmationProps> = ({ open, onOpenChange, sites, onSubmit }) => {
  const t = useT();
  const [isSaving, setIsSaving] = useState(false);
  const isSingleSite = sites.length === 1;

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleSubmit = useCallback(async () => {
    if (onSubmit == null) {
      onOpenChange(false);
      return;
    }

    try {
      setIsSaving(true);
      await onSubmit();
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  }, [onSubmit, onOpenChange]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="medium"
      header={
        <Text textStyle="400-bold" color="neutral.800">
          {isSingleSite ? t("Submit site?") : t("Submit sites?")}
        </Text>
      }
      content={
        isSingleSite ? (
          <Flex justifyContent="center" alignItems="center" flexDirection="column" pt={2} width="100%">
            <Text textStyle="400" color="neutral.900" textAlign="center">
              {t("Are you sure you want to submit")}
            </Text>
            <Text textStyle="500-bold" color="neutral.900" textAlign="center">
              {t("{siteName}?", { siteName: sites[0].name })}
            </Text>
          </Flex>
        ) : (
          <Box px={4}>
            <Text textStyle="400" color="neutral.900" mb={3}>
              {t("Are you sure you want to submit the following Sites:")}
            </Text>
            <SiteNameList names={sites.map(site => site.name)} />
          </Box>
        )
      }
      footer={
        <ButtonGroup
          buttons={[
            {
              id: "cancel",
              variant: "secondary",
              children: t("Cancel"),
              onClick: handleClose
            },
            {
              id: "submit",
              children: t("Submit"),
              disabled: isSaving || sites.length === 0,
              onClick: () => void handleSubmit()
            }
          ]}
        />
      }
    />
  );
};

export default SubmitSiteConfirmation;
