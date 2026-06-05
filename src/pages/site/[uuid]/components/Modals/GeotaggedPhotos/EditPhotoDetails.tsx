import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { TextInput } from "@worldresources/wri-design-systems";
import { FC } from "react";

import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import GalleryImage from "@/redesignComponents/content/Images/GalleryImage/GalleryImage";
import Switch from "@/redesignComponents/Forms/Actions/Switch/Switch";
import Textarea from "@/redesignComponents/Forms/Inputs/Textarea";

export interface EditPhotoDetailsProps {
  open: boolean;
  onClose: () => void;
}

const EditPhotoDetails: FC<EditPhotoDetailsProps> = ({ open, onClose }) => {
  const t = useT();
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="large"
      header={<b className="text-theme-neutral-800">{t("Edit Photo Details")}</b>}
      content={
        <Flex direction="column" gap={4} p={3}>
          <Flex gap={4} alignItems="flex-start" alignSelf="stretch">
            <GalleryImage alt="Image popup media" className="h-[11.8125rem] w-[14.375rem]" size={"full"} />
            <Flex direction="column" flex="1 0 0" gap={4}>
              <TextInput label="Image Name" name="imageName" required />
              <TextInput label="Photographer" placeholder="Name Surname" />
            </Flex>
          </Flex>
          <Box>
            <Textarea label="Description" />
            <Text textStyle="200" color="neutral.600" mt={-2}>
              {t("You have 200 characters remaining")}
            </Text>
          </Box>
          <Flex direction="column" gap={0.5}>
            <Flex alignItems="center" gap={1}>
              <Text textStyle="200" color="neutral.800" as="span">
                {t("Uploaded by:")}
              </Text>
              <Text textStyle="400" color="neutral.900" as="span">
                {t("Name Surname")}
              </Text>
            </Flex>
            <Flex alignItems="center" gap={2}>
              <Text textStyle="200" color="neutral.800" as="span">
                {t("Date:")}
              </Text>
              <Text textStyle="400" color="neutral.900" as="span">
                {t("dd/mm/yyyy")}
              </Text>
            </Flex>
            <Flex alignItems="center" gap={2}>
              <Text textStyle="200" color="neutral.800" as="span">
                {t("Coordinates:")}
              </Text>
              <Text textStyle="400" color="neutral.900" as="span">
                {t("XXXXXXXX")}
              </Text>
            </Flex>
            <Flex alignItems="center" gap={2}>
              <Text textStyle="200" color="neutral.800" as="span">
                {t("File size:")}
              </Text>
              <Text textStyle="400" color="neutral.900" as="span">
                {t("X MB")}
              </Text>
            </Flex>
          </Flex>
          <Switch name="makePublic" onChange={() => {}}>
            {t("Make public")}
          </Switch>
        </Flex>
      }
      footer={
        <ButtonGroup
          buttons={[
            {
              id: "cancel",
              variant: "borderless",
              children: t("Cancel"),
              onClick: onClose
            },
            {
              id: "delete",
              variant: "secondary",
              children: t("Delete"),
              typeVariant: "negative",
              classNameContainer: "w-[32%]",
              onClick: () => {}
            },
            {
              id: "save",
              variant: "primary",
              children: t("Save"),
              onClick: () => {}
            }
          ]}
        />
      }
    />
  );
};

export default EditPhotoDetails;
