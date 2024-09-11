import { useT } from "@transifex/react";
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

import Icon, { IconNames } from "../Icon/Icon";
import PageBreadcrumbs from "../PageElements/Breadcrumbs/PageBreadcrumbs";
import { ModalProps } from "./Modal";
import { ModalBaseImageDetail } from "./ModalsBases";

export interface ModalIamgeDetailProps extends ModalProps {
  onClose?: () => void;
  data: any;
  entityData: any;
}

const ModalImageDetails: FC<ModalIamgeDetailProps> = ({
  iconProps,
  title,
  content,
  primaryButtonProps,
  secondaryButtonProps,
  children,
  onClose,
  data,
  entityData,
  ...rest
}) => {
  console.log("data", data);
  const [activeIndex, setActiveIndex] = useState(0);
  const t = useT();

  const { thumbnailImageUrl, label, isGeotagged, raw } = data;

  const tabs = ["Image", "Location"];

  const mapFunctions = useMap();
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
                  { title: label }
                ]
              : [{ title: entityData.name, path: "/#" }, { title: label }]
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
            variant={"default"}
            required={false}
            placeholder=" "
            id="imageName"
            value={raw.name}
            labelClassName="text-14-bold !normal-case"
          />
          <div>
            <Text variant="text-14-bold" className="mb-2">
              {t("Assign Cover Image")}
            </Text>
            <RadioGroup
              options={[
                { title: t("Yes"), value: true },
                { title: t("No"), value: false }
              ]}
              onChange={value => {
                console.log(value);
              }}
              contentClassName="flex gap-4 !space-y-0"
              radioClassName="!p-0 !border-0 text-14-light !gap-2"
              variantTextRadio="text-14-light"
              labelRadio="gap-2"
              value={raw.is_cover}
            />
          </div>
          <div>
            <Text variant="text-14-bold" className="mb-2">
              {t("Make Public")}
            </Text>
            <RadioGroup
              options={[
                { title: t("Yes"), value: true },
                { title: t("No"), value: false }
              ]}
              onChange={value => {
                console.log(value);
              }}
              contentClassName="flex gap-4 !space-y-0"
              radioClassName="!p-0 !border-0 text-14-light !gap-2"
              variantTextRadio="text-14-light"
              labelRadio="gap-2"
              value={raw.is_public}
            />
          </div>
          <Input
            name="Photographer"
            type="text"
            label={t("Photographer")}
            variant={"default"}
            required={false}
            placeholder=" "
            id="Photographer"
            value={raw.photographer || ""}
            labelClassName="text-14-bold !normal-case"
          />
          <TextArea
            name="Description"
            label={t("Description")}
            required={false}
            placeholder=" "
            id="Description"
            value={raw.description}
            labelClassName="text-14-bold !normal-case"
            className="resize-none"
          />
        </div>
        <div className="flex max-h-[62vh] flex-1 flex-col gap-4 overflow-auto">
          <Toggle
            items={tabs}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            textClassName="!w-1/2 flex justify-center py-1"
          />
          {activeIndex === 0 ? (
            <Image
              src={thumbnailImageUrl}
              alt={t("Image")}
              height={400}
              width={300}
              className="h-[202px] w-full rounded-xl lg:h-[220px]"
            />
          ) : (
            <MapContainer
              className="h-[240px] flex-1"
              hasControls={false}
              showPopups={false}
              showLegend={false}
              mapFunctions={mapFunctions}
              location={data.raw?.location}
            />
          )}
          <div className="grid grid-cols-2">
            <Text variant="text-12" className="border-b border-grey-350 py-1 text-darkCustom-60">
              {t("Uploaded By")}
            </Text>
            <Text variant="text-12" className="border-b border-grey-350 py-1 text-darkCustom">
              {raw?.created_by?.first_name ? `${raw.created_by.first_name} ${raw.created_by.last_name}` : t("Unknown")}
            </Text>
            <Text variant="text-12" className="border-b border-grey-350 py-1 text-darkCustom-60">
              {t("Date Captured")}
            </Text>
            <Text variant="text-12" className="border-b border-grey-350 py-1 text-darkCustom">
              {new Date(raw.created_date).toLocaleDateString()}
            </Text>
            <Text variant="text-12" className="border-b border-grey-350 py-1 text-darkCustom-60">
              {t("Filename")}
            </Text>
            <Text variant="text-12" className="border-b border-grey-350 py-1 text-darkCustom">
              {raw.file_name}
            </Text>
            <Text variant="text-12" className="border-b border-grey-350 py-1 text-darkCustom-60">
              {t("File Type")}
            </Text>
            <Text variant="text-12" className="border-b border-grey-350 py-1 text-darkCustom">
              {raw.mime_type.split("/")[1].toUpperCase()}
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
              {isGeotagged ? `(${raw.location.lat.toFixed(4)}, ${raw.location.lng.toFixed(4)})` : "-"}
            </Text>
          </div>
        </div>
      </div>
      <div className="mt-5 flex w-full justify-end gap-3">
        <Button className="w-1/6 rounded-full border-0 hover:border" variant="semi-red">
          {t("Delete")}
        </Button>
        <Button className="w-1/6 rounded-full" variant="secondary" onClick={onClose}>
          {t("Cancel")}
        </Button>
        <Button className="w-1/6 rounded-full">{t("Save")}</Button>
      </div>
    </ModalBaseImageDetail>
  );
};

export default ModalImageDetails;
