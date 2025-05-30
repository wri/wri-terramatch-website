import { useT } from "@transifex/react";
import { LngLat } from "mapbox-gl";
import Image from "next/image";
import React, { FC, useState } from "react";

import Button from "@/components/elements/Button/Button";
import Input from "@/components/elements/Inputs/Input/Input";
import RadioGroup from "@/components/elements/Inputs/RadioGroup/RadioGroup";
import TextArea from "@/components/elements/Inputs/textArea/TextArea";
import { useMap } from "@/components/elements/Map-mapbox/hooks/useMap";
import MapContainer from "@/components/elements/Map-mapbox/Map";
import Text from "@/components/elements/Text/Text";
import Toggle from "@/components/elements/Toggle/Toggle";
import Modal from "@/components/extensive/Modal/Modal";
import { useModalContext } from "@/context/modal.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { usePatchV2MediaProjectProjectMediaUuid, usePatchV2MediaUuid } from "@/generated/apiComponents";
import { MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useOnMount } from "@/hooks/useOnMount";
import Log from "@/utils/log";

import Icon, { IconNames } from "../Icon/Icon";
import PageBreadcrumbs from "../PageElements/Breadcrumbs/PageBreadcrumbs";
import { ModalProps } from "./Modal";
import { ModalId } from "./ModalConst";
import { ModalBaseImageDetail } from "./ModalsBases";

export interface ModalImageDetailProps extends ModalProps {
  onClose?: () => void;
  reloadGalleryImages?: () => void;
  handleDelete?: (uuid: string) => void;
  data: MediaDto;
  entityData: any;
  updateValuesInForm?: (updatedItem: any) => void;
}

const ModalImageDetails: FC<ModalImageDetailProps> = ({
  iconProps,
  title,
  content,
  primaryButtonProps,
  secondaryButtonProps,
  children,
  onClose,
  reloadGalleryImages,
  handleDelete: onDeleteConfirm,
  data,
  entityData,
  updateValuesInForm,
  ...rest
}) => {
  const t = useT();
  const { openNotification } = useNotificationContext();
  const { openModal, closeModal } = useModalContext();
  const [activeIndex, setActiveIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: data.name,
    is_cover: data.isCover,
    is_public: data.isPublic,
    photographer: data.photographer ?? "",
    description: data.description
  });
  const [initialFormData, setInitialFormData] = useState({ ...formData });
  const [descriptionCharCount, setDescriptionCharCount] = useState(data.description?.length ?? 0);
  const maxDescriptionLength = 500;
  const mapFunctions = useMap();
  const { mutate: updateMedia, isLoading: isUpdating } = usePatchV2MediaUuid();
  const { mutateAsync: updateIsCoverAsync, isLoading: isUpdatingCover } = usePatchV2MediaProjectProjectMediaUuid();

  useOnMount(() => {
    setInitialFormData({ ...formData });
  });

  const handleInputChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (value: string) => {
    setFormData(prev => ({ ...prev, description: value }));
    setDescriptionCharCount(value.length);
  };

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(initialFormData);
  };

  const handleSave = async () => {
    if (!hasChanges()) {
      openNotification("warning", t("No changes"), t("No changes were made to the image details"));
      return;
    }

    const updatePromises = [];

    if (
      formData.name !== initialFormData.name ||
      formData.description !== initialFormData.description ||
      formData.photographer !== initialFormData.photographer ||
      formData.is_public !== initialFormData.is_public
    ) {
      const mediaUpdate = updateMedia({
        pathParams: { uuid: data.uuid },
        body: {
          name: formData.name,
          // @ts-expect-error until we can have v3 media update endpoint
          description: formData.description,
          photographer: formData.photographer,
          is_public: formData.is_public
        }
      });

      updatePromises.push(mediaUpdate);
    }

    if (formData.is_cover !== initialFormData.is_cover && formData.is_cover) {
      const result = updateIsCoverAsync({
        pathParams: { project: entityData.uuid, mediaUuid: data.uuid }
      });
      updatePromises.push(result);
    }

    try {
      await Promise.all(updatePromises);
      openNotification("success", t("Success!"), t("Image updated successfully"));
      reloadGalleryImages?.();

      const updatedData = {
        name: formData.name,
        title: formData.name,
        description: formData.description,
        photographer: formData.photographer,
        is_public: formData.is_public,
        is_cover: formData.is_cover,
        uuid: data.uuid
      };
      updateValuesInForm?.(updatedData);

      onClose?.();
    } catch (error) {
      openNotification("error", t("Error"), t("Failed to update image details"));
      Log.error("Failed to update image details:", error);
    }
  };

  const { thumbUrl, lat, lng, name, fileName, mimeType } = data;
  const isGeotagged = lat != null && lng != null;
  const tabs = [
    { key: "Image", render: "Image" },
    { key: "Location", render: "Location" }
  ];
  const handleDelete = () => {
    onClose?.();
    openModal(
      ModalId.DELETE_IMAGE,
      <Modal
        title={t("Delete Image")}
        content={t(
          "Are you sure you want to delete this image? This action cannot be undone, and the image will be permanently removed."
        )}
        iconProps={{
          height: 60,
          width: 60,
          className: "fill-error",
          name: IconNames.TRASH_CIRCLE
        }}
        primaryButtonProps={{
          children: t("Confirm Delete"),
          onClick: () => {
            closeModal(ModalId.DELETE_IMAGE);
            onDeleteConfirm?.(data.uuid);
          }
        }}
        secondaryButtonProps={{
          children: t("Cancel"),
          onClick: () => closeModal(ModalId.DELETE_IMAGE)
        }}
      />
    );
  };

  return (
    <ModalBaseImageDetail {...rest}>
      <button onClick={onClose} className="absolute top-8 right-8 ml-2 rounded p-1 hover:bg-grey-800">
        <Icon name={IconNames.CLEAR} width={16} height={16} className="text-darkCustom-100" />
      </button>
      <div className="w-full">
        <Text variant="text-24-bold">{title}</Text>
        <PageBreadcrumbs
          links={
            entityData.project
              ? [
                  { title: entityData.project.name, path: "/#" },
                  { title: entityData.name, path: "/#" },
                  { title: name }
                ]
              : [{ title: entityData.name, path: "/#" }, { title: name }]
          }
          className="bg-white pt-0"
          textVariant="text-12"
        />
      </div>
      <div className="flex w-full gap-12">
        <div className="grid max-h-[62vh] flex-1 gap-4 overflow-auto pr-2">
          <Input
            name="imageName"
            type="text"
            label={t("Image Name")}
            variant="default"
            required={false}
            placeholder=" "
            id="imageName"
            value={formData.name}
            onChange={e => handleInputChange("name", e.target.value)}
            labelClassName="text-14-bold !normal-case"
          />
          {entityData.project || entityData.model !== "project" ? (
            <></>
          ) : (
            <div>
              <Text variant="text-14-bold" className="mb-2">
                {t("Assign Cover Image")}
              </Text>
              <RadioGroup
                options={[
                  { title: t("Yes"), value: true },
                  { title: t("No"), value: false }
                ]}
                onChange={value => handleInputChange("is_cover", Boolean(value))}
                contentClassName="flex gap-4 !space-y-0"
                radioClassName="!p-0 !border-0 text-14-light !gap-2"
                variantTextRadio="text-14-light"
                labelRadio="gap-2"
                value={formData.is_cover}
              />
            </div>
          )}
          <div>
            <Text variant="text-14-bold" className="mb-2">
              {t("Make Public")}
            </Text>
            <RadioGroup
              options={[
                { title: t("Yes"), value: true },
                { title: t("No"), value: false }
              ]}
              onChange={value => handleInputChange("is_public", Boolean(value))}
              contentClassName="flex gap-4 !space-y-0"
              radioClassName="!p-0 !border-0 text-14-light !gap-2"
              variantTextRadio="text-14-light"
              labelRadio="gap-2"
              value={formData.is_public}
            />
          </div>
          <Input
            name="photographer"
            type="text"
            label={t("Photographer")}
            variant="default"
            required={false}
            placeholder=" "
            id="photographer"
            value={formData.photographer}
            onChange={e => handleInputChange("photographer", e.target.value)}
            labelClassName="text-14-bold !normal-case"
          />
          <TextArea
            name="description"
            label={t("Description")}
            required={false}
            placeholder=" "
            id="description"
            value={formData.description ?? ""}
            onChange={e => handleDescriptionChange(e.target.value)}
            labelClassName="text-14-bold !normal-case"
            className="resize-none"
          />
          <div className="text-12 text-right text-darkCustom-60">
            {`${descriptionCharCount}/${maxDescriptionLength} ${t("characters remaining")}`}
          </div>
        </div>
        <div className="flex max-h-[62vh] flex-1 flex-col gap-4 overflow-auto">
          <Toggle
            items={tabs}
            onChangeActiveIndex={setActiveIndex}
            textClassName="!w-1/2 flex justify-center py-1"
            disabledIndexes={isGeotagged ? [] : [1]}
          />
          {activeIndex === 0 ? (
            thumbUrl && (
              <Image
                src={thumbUrl}
                alt={t("Image")}
                height={400}
                width={300}
                className="h-[202px] w-full rounded-xl lg:h-[220px]"
              />
            )
          ) : (
            <MapContainer
              className="h-[240px] flex-1"
              hasControls={false}
              showPopups={false}
              showLegend={false}
              mapFunctions={mapFunctions}
              location={new LngLat(lng ?? 0, lat ?? 0)}
            />
          )}
          <div className="grid grid-cols-2">
            <Text variant="text-12" className="border-b border-grey-350 py-1 text-darkCustom-60">
              {t("Uploaded By")}
            </Text>
            <Text variant="text-12" className="border-b border-grey-350 py-1 text-darkCustom">
              {data?.createdByUserName ?? t("Unknown")}
            </Text>
            <Text variant="text-12" className="border-b border-grey-350 py-1 text-darkCustom-60">
              {t("Date Captured")}
            </Text>
            <Text variant="text-12" className="border-b border-grey-350 py-1 text-darkCustom">
              {new Date(data.createdAt).toLocaleDateString()}
            </Text>
            <Text variant="text-12" className="border-b border-grey-350 py-1 text-darkCustom-60">
              {t("Filename")}
            </Text>
            <Text variant="text-12" className="border-b border-grey-350 py-1 text-darkCustom">
              {fileName}
            </Text>
            <Text variant="text-12" className="border-b border-grey-350 py-1 text-darkCustom-60">
              {t("File Type")}
            </Text>
            <Text variant="text-12" className="border-b border-grey-350 py-1 text-darkCustom">
              {mimeType?.split("/")[1].toUpperCase()}
            </Text>
            <Text variant="text-12" className="border-b border-grey-350 py-1 text-darkCustom-60">
              {t("Geotagged")}
            </Text>
            <Text variant="text-12" className="border-b border-grey-350 py-1 text-darkCustom">
              {isGeotagged ? t("Yes") : t("No")}
            </Text>
            <Text variant="text-12" className="border-b border-grey-350 py-1 text-darkCustom-60">
              {t("Coordinates")}
            </Text>
            <Text variant="text-12" className="border-b border-grey-350 py-1 text-darkCustom">
              {isGeotagged ? `(${lat?.toFixed(4)}, ${lng?.toFixed(4)})` : "-"}
            </Text>
          </div>
        </div>
      </div>
      <div className="mt-5 flex w-full justify-end gap-3">
        <Button className="w-1/6 rounded-full border-0 hover:border" variant="semi-red" onClick={handleDelete}>
          {t("Delete")}
        </Button>
        <Button className="w-1/6 rounded-full" variant="secondary" onClick={onClose}>
          {t("Cancel")}
        </Button>
        <Button
          className="w-1/6 rounded-full"
          onClick={handleSave}
          disabled={isUpdating || isUpdatingCover || !hasChanges()}
        >
          {isUpdating || isUpdatingCover ? t("Saving...") : t("Save")}
        </Button>
      </div>
    </ModalBaseImageDetail>
  );
};

export default ModalImageDetails;
