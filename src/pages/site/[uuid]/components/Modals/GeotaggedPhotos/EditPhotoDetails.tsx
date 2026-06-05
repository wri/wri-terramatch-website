import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { TextInput } from "@worldresources/wri-design-systems";
import { FC, useState } from "react";

import { deleteMedia } from "@/connections/Media";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useFileSize } from "@/hooks/useFileSize";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import GalleryImage from "@/redesignComponents/content/Images/GalleryImage/GalleryImage";
import Switch from "@/redesignComponents/Forms/Actions/Switch/Switch";
import Textarea from "@/redesignComponents/Forms/Inputs/Textarea";

export interface EditPhotoDetailsProps {
  data: MediaDto;
  open: boolean;
  onClose: () => void;
}

const EditPhotoDetails: FC<EditPhotoDetailsProps> = ({ data, open, onClose }) => {
  const t = useT();
  const { format: formatFileSize } = useFileSize();
  const [description, setDescription] = useState(data.description ?? "");
  const [photographer, setPhotographer] = useState(data.photographer ?? "");
  const [isPublic, setIsPublic] = useState(data.isPublic);
  const [isCover, setIsCover] = useState(data.isCover);
  const { openNotification } = useNotificationContext();
  const { setShouldRefetchMediaData } = useMapAreaContext();
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="large"
      header={<b className="text-theme-neutral-800">{t("Edit Photo Details")}</b>}
      content={
        <Flex direction="column" gap={4} p={3}>
          <Flex gap={4} alignItems="flex-start" alignSelf="stretch">
            <GalleryImage
              src={data.thumbUrl ?? undefined}
              alt="Image popup media"
              className="h-[11.8125rem] w-[14.375rem]"
              size={"full"}
            />
            <Flex direction="column" flex="1 0 0" gap={4}>
              <TextInput label="Image Name" name="imageName" required value={data.name} />
              <TextInput
                label="Photographer"
                placeholder="Name Surname"
                value={photographer ?? ""}
                onChange={e => setPhotographer(e.target.value)}
              />
            </Flex>
          </Flex>
          <Box>
            <Textarea label="Description" value={description ?? ""} onChange={e => setDescription(e.target.value)} />
            <Text textStyle="200" color="neutral.600">
              {t("You have 200 characters remaining")}
            </Text>
          </Box>
          <Flex direction="column" gap={0.5}>
            <Flex alignItems="center" gap={1}>
              <Text textStyle="200" color="neutral.800" as="span">
                {t("Uploaded by:")}
              </Text>
              <Text textStyle="400" color="neutral.900" as="span">
                {data.createdByUserName}
              </Text>
            </Flex>
            <Flex alignItems="center" gap={2}>
              <Text textStyle="200" color="neutral.800" as="span">
                {t("Date:")}
              </Text>
              <Text textStyle="400" color="neutral.900" as="span">
                {new Date(data.createdAt).toLocaleDateString()}
              </Text>
            </Flex>
            <Flex alignItems="center" gap={2}>
              <Text textStyle="200" color="neutral.800" as="span">
                {t("Coordinates:")}
              </Text>
              <Text textStyle="400" color="neutral.900" as="span">
                {data.lat && data.lng ? `${data.lat.toFixed(4)}, ${data.lng?.toFixed(4)}` : "-"}
              </Text>
            </Flex>
            <Flex alignItems="center" gap={2}>
              <Text textStyle="200" color="neutral.800" as="span">
                {t("File size:")}
              </Text>
              <Text textStyle="400" color="neutral.900" as="span">
                {data.size ? formatFileSize(data.size) : "-"}
              </Text>
            </Flex>
          </Flex>
          <Switch name="makePublic" onChange={() => setIsPublic(!isPublic)} checked={isPublic}>
            {t("Make public")}
          </Switch>
          <Switch name="makeCover" onChange={() => setIsCover(!isCover)} checked={isCover}>
            {t("Make cover")}
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
              className: "!border w-[32%] !border-theme-error-300 !bg-theme-error-100 !text-theme-error-900",
              onClick: () => {
                deleteMedia(data.uuid);
                openNotification("success", t("Success!"), t("Image deleted successfully"));
                setShouldRefetchMediaData(true);
                onClose();
              }
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
