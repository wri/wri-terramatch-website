import { useT } from "@transifex/react";
import Image from "next/image";
import React, { FC, useState } from "react";

import Button from "@/components/elements/Button/Button";
import Input from "@/components/elements/Inputs/Input/Input";
import RadioGroup from "@/components/elements/Inputs/RadioGroup/RadioGroup";
import TextArea from "@/components/elements/Inputs/textArea/TextArea";
import Text from "@/components/elements/Text/Text";
import Toggle from "@/components/elements/Toggle/Toggle";

import Icon, { IconNames } from "../Icon/Icon";
import PageBreadcrumbs from "../PageElements/Breadcrumbs/PageBreadcrumbs";
import { ModalProps } from "./Modal";
import { ModalBaseImageDetail } from "./ModalsBases";

export interface ModalIamgeDetailProps extends ModalProps {
  onClose?: () => void;
  data: any;
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
  ...rest
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const tabs = ["Image", "Location"];
  const t = useT();
  return (
    <ModalBaseImageDetail {...rest}>
      <button onClick={onClose} className="absolute top-8 right-8 ml-2 rounded p-1 hover:bg-grey-800">
        <Icon name={IconNames.CLEAR} width={16} height={16} className="text-darkCustom-100" />
      </button>
      <div className="w-full">
        <Text variant="text-24-bold">{title}</Text>
        <PageBreadcrumbs
          links={[
            { title: t("Faja Lobi Project"), path: "/#" },
            { title: t("Iseme Site"), path: "/#" },
            { title: "Apex Nursery" }
          ]}
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
            labelClassName="text-14-bold !normal-case"
          />
          <TextArea
            name="Description"
            label={t("Description")}
            required={false}
            placeholder=" "
            id="Description"
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
              src="/images/hands-planting.webp"
              alt="Hands planting"
              height="400"
              width="300"
              className="h-[202px] w-full rounded-xl lg:h-[220px]"
            />
          ) : (
            <Image
              src="/images/map-img.png"
              alt="map"
              height="400"
              width="300"
              className="h-[202px] w-full rounded-xl lg:h-[220px]"
            />
          )}
          <div className="grid grid-cols-2">
            <Text variant="text-12" className="border-b border-grey-350 py-1 text-darkCustom-60">
              {t("Uploaded By")}
            </Text>
            <Text variant="text-12" className="border-b border-grey-350 py-1 text-darkCustom">
              {t("George Washington")}
            </Text>
            <Text variant="text-12" className="border-b border-grey-350 py-1 text-darkCustom-60">
              {t("Date Captured")}
            </Text>
            <Text variant="text-12" className="border-b border-grey-350 py-1 text-darkCustom">
              {t("01/02/2024")}
            </Text>
            <Text variant="text-12" className="border-b border-grey-350 py-1 text-darkCustom-60">
              {t("Filename")}
            </Text>
            <Text variant="text-12" className="border-b border-grey-350 py-1 text-darkCustom">
              {t("apex_nursery.png")}
            </Text>
            <Text variant="text-12" className="border-b border-grey-350 py-1 text-darkCustom-60">
              {t("File Type")}
            </Text>
            <Text variant="text-12" className="border-b border-grey-350 py-1 text-darkCustom">
              {t("PNG")}
            </Text>
            <Text variant="text-12" className="border-b border-grey-350 py-1 text-darkCustom-60">
              {t("Geotagged")}
            </Text>
            <Text variant="text-12" className="border-b border-grey-350 py-1 text-darkCustom">
              {t("Yes")}
            </Text>
            <Text variant="text-12" className="border-b border-grey-350 py-1 text-darkCustom-60">
              {t("Coordinates")}
            </Text>
            <Text variant="text-12" className="border-b border-grey-350 py-1 text-darkCustom">
              {t("(31.2156, -29.9553)")}
            </Text>
          </div>
        </div>
      </div>
      <div className="mt-5 flex w-full justify-end gap-3">
        <Button className="w-1/6 rounded-full border-0 hover:border" variant="semi-red">
          {t("Delete")}
        </Button>
        <Button className="w-1/6 rounded-full" variant="secondary">
          {t("Cancel")}
        </Button>
        <Button className="w-1/6 rounded-full">{t("Continue")}</Button>
      </div>
    </ModalBaseImageDetail>
  );
};

export default ModalImageDetails;
