import { useT } from "@transifex/react";
import classNames from "classnames";
import Image from "next/image";
import { CSSProperties, DetailedHTMLProps, FC, HTMLAttributes, useEffect, useState } from "react";

import Text from "@/components/elements/Text/Text";
import { type SizeValue, resolveRemSizeValue } from "@/lib/sizing";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import MenuCustom from "@/redesignComponents/actions/Buttons/Menu/MenuCustom";
import { EditIcon, PhotoAddIcon, RejectedIcon, VideoIcon } from "@/redesignComponents/foundations/Icons";

export type MediaType = "video" | "image";
export interface BaseImageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: SizeValue;
  className?: string;
  borderRadius?: "rounded-md" | "rounded-full";
  defaultAlt?: string;
  classNamesHover?: string;
  isAdd?: boolean;
  hoverContent?: React.ReactNode;
  onClickEdit?: () => void;
  onClickAdd?: () => void;
  menuItems?: {
    label: string;
    value: string;
    startIcon?: React.ReactNode;
    onClick?: () => void;
  }[];
  menuLabel?: string;
  style?: CSSProperties;
  type?: MediaType;
  classNamesVideoIcon?: string;
  hideNotAvailableText?: boolean;
}

const BaseImage: FC<BaseImageProps> = ({
  src,
  alt,
  size = 41,
  className,
  borderRadius = "rounded-md",
  defaultAlt = "Image",
  classNamesHover,
  isAdd = false,
  hoverContent,
  onClickEdit,
  onClickAdd,
  menuItems,
  menuLabel,
  style,
  type = "image",
  classNamesVideoIcon,
  hideNotAvailableText = false,
  ...rest
}) => {
  const t = useT();
  const [loadError, setLoadError] = useState(false);
  useEffect(() => {
    setLoadError(false);
  }, [src]);

  const isVideo = type === "video";
  const showNotAvailable = src == null || loadError;

  const hoverContentComponent = (
    <div
      className={classNames(
        "bg-theme-primary-900/50 absolute inset-[0.1875rem] flex flex-col items-center justify-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100",
        borderRadius
      )}
      role="button"
      tabIndex={0}
      onClick={onClickEdit}
    >
      <div className={classNamesHover} />
      <Text variant="text-16-bold" className="flex items-center gap-1 text-white" onClick={onClickEdit}>
        {hoverContent ? (
          hoverContent
        ) : (
          <>
            <EditIcon className="h-4 w-4" />
            {t("Edit")}
          </>
        )}
      </Text>
    </div>
  );

  const videoComponent = (
    <div
      className={classNames(
        "absolute inset-[0.1875rem] flex flex-col items-center justify-center gap-1 bg-[#3D3B3B80] duration-200 group-hover:opacity-0",
        isVideo && "bg-[#3D3B3B80]",
        borderRadius
      )}
    >
      {isVideo && <VideoIcon className={classNames("text-theme-neutral-100 h-9 w-9", classNamesVideoIcon)} />}
    </div>
  );
  return (
    <div
      {...rest}
      className={classNames(
        "group relative flex items-center justify-center",
        borderRadius,
        {
          "cursor-pointer group-hover:border-white": !showNotAvailable
        },
        className
      )}
      style={{ width: resolveRemSizeValue(size), height: resolveRemSizeValue(size) }}
    >
      {showNotAvailable || isAdd ? (
        isAdd ? (
          <div
            className={classNames(
              "bg-theme-neutral-200 flex h-[calc(100%-0.25rem)] w-[calc(100%-0.25rem)] flex-col items-center justify-center gap-1",
              borderRadius
            )}
          >
            <PhotoAddIcon className="h-6 w-6" />
            {onClickAdd && (
              <Button onClick={onClickAdd} variant="borderless" size="small">
                {t("Add Image")}
              </Button>
            )}
            {menuItems && <MenuCustom label={menuLabel ?? t("Add Image")} items={menuItems} />}
          </div>
        ) : (
          <div
            className={classNames(
              "bg-theme-neutral-300 relative flex h-full w-full items-center justify-center",
              borderRadius
            )}
          >
            <div className="flex flex-col items-center justify-center gap-1.5">
              <RejectedIcon className="text-theme-neutral-500 h-5 w-5" />
              {!hideNotAvailableText && (
                <Text variant="text-12" className="text-theme-neutral-900 flex items-center gap-1">
                  {t("Image unavailable")}
                </Text>
              )}
            </div>
            {onClickEdit && hoverContentComponent}
          </div>
        )
      ) : isVideo ? (
        <>
          <div
            className={classNames(
              "relative h-[calc(100%-0.25rem)] w-[calc(100%-0.25rem)] overflow-hidden",
              borderRadius
            )}
          >
            <video src={src!} className="h-full w-full object-cover" muted onError={() => setLoadError(true)} />
          </div>

          {isVideo && videoComponent}
          {onClickEdit && hoverContentComponent}
        </>
      ) : (
        <>
          <div
            className={classNames(
              "relative h-[calc(100%-0.25rem)] w-[calc(100%-0.25rem)] overflow-hidden",
              borderRadius
            )}
          >
            <Image
              src={src!}
              alt={alt ?? defaultAlt}
              fill
              className="object-cover"
              sizes={resolveRemSizeValue(size)}
              style={style}
              onError={() => setLoadError(true)}
            />
          </div>
          {onClickEdit && hoverContentComponent}
        </>
      )}
    </div>
  );
};

export default BaseImage;
