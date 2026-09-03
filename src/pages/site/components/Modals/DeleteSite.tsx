import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback } from "react";

import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";

import type { SiteIndexSite } from "../siteIndexMockData";
import SiteNameList from "./SiteNameList";

export interface DeleteSiteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sites: SiteIndexSite[];
  onDelete?: () => void | Promise<void>;
}

const DeleteSite: FC<DeleteSiteProps> = ({ open, onOpenChange, sites, onDelete }) => {
  const t = useT();
  const isSingleSite = sites.length === 1;

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleDelete = useCallback(() => {
    if (onDelete == null) {
      onOpenChange(false);
      return;
    }
    void onDelete();
    onOpenChange(false);
  }, [onDelete, onOpenChange]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="medium"
      header={
        <Text textStyle="400-bold" color="neutral.800">
          {isSingleSite ? t("Delete site?") : t("Delete sites?")}
        </Text>
      }
      content={
        isSingleSite ? (
          <Flex justifyContent="center" alignItems="center" flexDirection="column" pt={2} width="100%">
            <Text textStyle="500-bold" color="neutral.900" textAlign="center">
              {sites[0].name}
            </Text>
            <Text textStyle="400" color="neutral.900" textAlign="center">
              {t("will be permanently removed.")}
            </Text>
            <Text textStyle="400-bold" color="neutral.900" textAlign="center">
              {t("You can’t undo this.")}
            </Text>
          </Flex>
        ) : (
          <Box px={4}>
            <Text textStyle="400" color="neutral.900" mb={3}>
              <span>
                {t("The following sites will be permanently removed. {action}", {
                  action: (
                    <Text textStyle="400-bold" color="neutral.900" as="span">
                      {t("You can’t undo this.")}
                    </Text>
                  )
                })}
              </span>
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
              id: "delete",
              children: t("Delete"),
              variant: "negative",
              classNameContainer: "!w-[50%]",
              className: "!w-[50%]",
              onClick: () => void handleDelete()
            }
          ]}
        />
      }
    />
  );
};

export default DeleteSite;
