import classNames from "classnames";
import { When } from "react-if";

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
}

export const FileCardContent = (props: FileCardContentProps) => {
  const hasPreview = props.file?.url && props.file.mime_type?.includes("image");

  return (
    <>
      <div
        className={classNames(
          props.thumbnailContainerClassName,
          "flex h-15 w-15 items-center justify-center rounded-lg bg-cover bg-no-repeat"
        )}
        style={hasPreview ? { backgroundImage: `url(${props.file?.url})` } : {}}
      >
        <Icon
          name={IconNames.DOCUMENT}
          className={classNames(props.thumbnailClassName, !!hasPreview && "hidden")}
          width={24}
          height={32}
        />
      </div>
      <div className="flex-1">
        <Text variant="text-bold-subtitle-400" className="mb-1 line-clamp-1" title={props.title}>
          {props.title}
        </Text>
        <When condition={props.errorMessage || props.subtitle}>
          <Text
            variant="text-light-body-300"
            containHtml
            className={classNames("line-clamp-1", props.errorMessage && "text-error first-letter:capitalize")}
            title={props.errorMessage || props.subtitle}
          >
            {props.errorMessage || props.subtitle}
          </Text>
        </When>
      </div>
    </>
  );
};
