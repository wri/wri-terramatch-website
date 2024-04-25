import classNames from "classnames";
import { ChangeEvent, useState } from "react";
import { When } from "react-if";
import { twMerge as tw } from "tailwind-merge";

import Checkbox from "@/components/elements/Inputs/Checkbox/Checkbox";
import Text from "@/components/elements/Text/Text";
import Icon from "@/components/extensive/Icon/Icon";
import { UploadedFile } from "@/types/common";

import { FileCardContentVariant, VARIANT_FILE_CARD_DEFAULT } from "./FileInputVariants";

interface FileCardContentProps {
  title: string;
  subtitle?: string;
  errorMessage?: string;
  variant?: FileCardContentVariant;
  file?: UploadedFile;
  thumbnailClassName?: string;
  thumbnailContainerClassName?: string;
  showPrivateCheckbox?: boolean;
  onPrivateChange?: (checked: boolean) => void;
}

export const FileCardContent = ({
  title,
  subtitle,
  errorMessage,
  file,
  variant = VARIANT_FILE_CARD_DEFAULT,
  thumbnailClassName,
  thumbnailContainerClassName,
  showPrivateCheckbox,
  onPrivateChange
}: FileCardContentProps) => {
  const [isPublic, setIsPublic] = useState<boolean>(!!file?.is_public);

  const hasPreview = file?.url && file.mime_type?.includes("image");

  const handlePrivateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsPublic(!event.target.checked);
    onPrivateChange?.(event.target.checked);
  };

  return (
    <>
      <div
        className={tw(thumbnailContainerClassName, variant.iconContainer)}
        style={hasPreview ? { backgroundImage: `url(${file?.url})` } : {}}
      >
        <Icon
          name={variant.iconName}
          className={tw(thumbnailClassName, !!hasPreview && variant.iconHasPreview, variant.iconClassName)}
        />
      </div>
      <div className="flex-1">
        <Text variant={variant.titleVariant} className={variant.titleClassName} title={title}>
          {title}
        </Text>
        <When condition={errorMessage || subtitle}>
          <Text
            variant={variant.subTitletitleVariant}
            containHtml
            className={classNames(errorMessage && "text-error first-letter:capitalize", variant.subTitleClassName)}
            title={errorMessage || subtitle}
          >
            {errorMessage || subtitle}
          </Text>
        </When>

        <When condition={showPrivateCheckbox}>
          <div className="mt-1 flex items-center gap-2">
            <Checkbox name="" inputClassName="h-4 w-4" onChange={handlePrivateChange} checked={!isPublic} />

            <Text variant="text-light-body-300">Check this box to mark the file as private</Text>
          </div>
        </When>
      </div>
    </>
  );
};
