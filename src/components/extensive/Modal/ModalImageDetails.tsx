import { useT } from "@transifex/react";
import classNames from "classnames";
import React, { FC, useState } from "react";

import Input from "@/components/elements/Inputs/Input/Input";
import Text from "@/components/elements/Text/Text";

import Icon, { IconNames } from "../Icon/Icon";
import PageBreadcrumbs from "../PageElements/Breadcrumbs/PageBreadcrumbs";
import { ModalProps } from "./Modal";
import { ModalBaseImageDetail } from "./ModalsBases";

export interface ModalIamgeDetailProps extends ModalProps {
  onClose?: () => void;
}

const ModalImageDetails: FC<ModalIamgeDetailProps> = ({
  iconProps,
  title,
  content,
  primaryButtonProps,
  secondaryButtonProps,
  children,
  onClose,
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

      <div className="flex w-full gap-14">
        <div className="flex-1">
          <Text variant="text-14-bold" className="text-darkCustom">
            {t("Image Name")}
          </Text>
          <Input placeholder="Image Name" className="w-full" name="Image Name" type="text" />
        </div>
        <div className="flex-1">
          <div className="flex rounded-lg bg-neutral-40 p-1 ">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveIndex(index)} // Actualizar el estado al hacer clic en el botón
                className={classNames(
                  "hover:stroke-blue-950 hover:text-blue-950 group inline-flex h-full w-max min-w-[32px] items-center justify-center gap-1 whitespace-nowrap px-3 align-middle transition-all duration-300 ease-in-out",
                  activeIndex === index && "text-14-bold rounded-md bg-white text-darkCustom drop-shadow",
                  activeIndex !== index && "text-14-light rounded-lg bg-transparent text-darkCustom-60"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ModalBaseImageDetail>
  );
};

export default ModalImageDetails;
