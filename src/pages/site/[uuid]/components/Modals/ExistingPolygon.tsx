import { Box, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback } from "react";

import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";

export interface ExistingPolygonProps {
  open: boolean;
  siteName: string;
  onOpenChange: (open: boolean) => void;
  onView: () => void;
}

const ExistingPolygon: FC<ExistingPolygonProps> = ({ open, siteName, onOpenChange, onView }) => {
  const t = useT();

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleView = useCallback(() => {
    onView();
    onOpenChange(false);
  }, [onOpenChange, onView]);

  const displaySiteName = siteName.trim().length > 0 ? siteName : t("this site");

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="medium"
      header={
        <Text textStyle="400-bold" color="neutral.800">
          {t("Existing polygon")}
        </Text>
      }
      content={
        <Box px={4}>
          <Text textStyle="400" color="neutral.900">
            {t("This polygon already exists in {siteName}. The uploaded file won't be imported.", {
              siteName: (
                <Text as="span" textStyle="400-bold" color="neutral.900">
                  {displaySiteName}
                </Text>
              )
            })}
          </Text>
          <Text textStyle="400" color="neutral.900" mt={3}>
            {t("You'll be taken to the edit panel to review or update its information.")}
          </Text>
        </Box>
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
              id: "view",
              variant: "primary",
              children: t("View"),
              onClick: handleView
            }
          ]}
        />
      }
    />
  );
};

export default ExistingPolygon;
