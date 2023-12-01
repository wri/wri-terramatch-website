import classNames from "classnames";
import { ChangeEvent, useState } from "react";
import { When } from "react-if";

import Checkbox from "@/components/elements/Inputs/Checkbox/Checkbox";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { UploadedFile } from "@/types/common";

interface FileCardContentProps {
  title: string;
  subtitle?: string;
  errorMessage?: string;
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
        className={classNames(
          thumbnailContainerClassName,
          "flex h-15 w-15 items-center justify-center rounded-lg bg-cover bg-no-repeat"
        )}
        style={hasPreview ? { backgroundImage: `url(${file?.url})` } : {}}
      >
        <Icon
          name={IconNames.DOCUMENT}
          className={classNames(thumbnailClassName, !!hasPreview && "hidden")}
          width={24}
          height={32}
        />
      </div>
      <div className="flex-1">
        <Text variant="text-bold-subtitle-400" className="mb-1 line-clamp-1" title={title}>
          {title}
        </Text>
        <When condition={errorMessage || subtitle}>
          <Text
            variant="text-light-body-300"
            containHtml
            className={classNames("line-clamp-1", errorMessage && "text-error first-letter:capitalize")}
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
