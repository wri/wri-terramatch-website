import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { showToast, TextInput } from "@worldresources/wri-design-systems";
import { FC, useCallback, useRef, useState } from "react";

import { deleteMedia, updateMedia } from "@/connections/Media";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useFileSize } from "@/hooks/useFileSize";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import GalleryImage from "@/redesignComponents/content/Images/GalleryImage/GalleryImage";
import Switch from "@/redesignComponents/Forms/Actions/Switch/Switch";
import Textarea from "@/redesignComponents/Forms/Inputs/Textarea";
import Log from "@/utils/log";

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
  const [isUpdating, setIsUpdating] = useState(false);
  const initialValues = useRef({
    description: data.description ?? "",
    photographer: data.photographer ?? "",
    isPublic: data.isPublic,
    isCover: data.isCover
  });
  const { setShouldRefetchMediaData } = useMapAreaContext();

  const hasChanges = useCallback(() => {
    const initial = initialValues.current;
    return (
      description !== initial.description ||
      photographer !== initial.photographer ||
      isPublic !== initial.isPublic ||
      isCover !== initial.isCover
    );
  }, [description, photographer, isPublic, isCover]);

  const handleSave = useCallback(async () => {
    if (!hasChanges()) {
      showToast({
        label: t("No changes"),
        type: "warning",
        placement: "bottom",
        duration: 5000,
        maxWidth: "auto"
      });
    }

    const initial = initialValues.current;
    const updatePromises: Promise<unknown>[] = [];

    if (
      description !== initial.description ||
      photographer !== initial.photographer ||
      isPublic !== initial.isPublic ||
      (isCover !== initial.isCover && !isCover)
    ) {
      updatePromises.push(
        updateMedia(
          {
            name: data.name,
            title: data.name,
            photographer,
            description: description || undefined,
            isPublic,
            isCover,
            profileImageScale: data.profileImageScale,
            profileImagePosition: data.profileImagePosition
          },
          { id: data.uuid }
        )
      );
    }

    if (isCover !== initial.isCover && isCover) {
      updatePromises.push(
        updateMedia(
          {
            isCover: true,
            profileImageScale: data.profileImageScale,
            profileImagePosition: data.profileImagePosition
          },
          { id: data.uuid }
        )
      );
    }

    setIsUpdating(true);
    try {
      await Promise.all(updatePromises);
      showToast({
        label: t("Image updated successfully"),
        type: "success",
        placement: "bottom",
        duration: 5000,
        maxWidth: "auto"
      });
      setShouldRefetchMediaData(true);
      onClose();
    } catch (error) {
      showToast({
        label: t("Failed to update image details"),
        type: "error",
        placement: "bottom",
        duration: 5000,
        maxWidth: "auto"
      });
      Log.error("Failed to update image details:", error);
    } finally {
      setIsUpdating(false);
    }
  }, [
    data.name,
    data.profileImagePosition,
    data.profileImageScale,
    data.uuid,
    description,
    hasChanges,
    isCover,
    isPublic,
    onClose,
    photographer,
    setShouldRefetchMediaData,
    t
  ]);

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
              typeVariant: "negative",
              classNameContainer: "w-[32%]",
              className: "!w-full",
              onClick: () => {
                deleteMedia(data.uuid);
                showToast({
                  label: t("Image deleted successfully"),
                  type: "success",
                  placement: "bottom",
                  duration: 5000,
                  maxWidth: "auto"
                });
                setShouldRefetchMediaData(true);
                onClose();
              }
            },
            {
              id: "save",
              variant: "primary",
              children: isUpdating ? t("Saving...") : t("Save"),
              loading: isUpdating,
              disabled: isUpdating || !hasChanges(),
              onClick: handleSave
            }
          ]}
        />
      }
    />
  );
};

export default EditPhotoDetails;
