import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import NextImage from "next/image";
import { CSSProperties, FC, HTMLAttributes, useEffect, useState } from "react";

import { type SizeValue, resolveRemSizeValue } from "@/lib/sizing";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import MenuCustom from "@/redesignComponents/actions/Buttons/Menu/MenuCustom";
import { EditIcon, PhotoAddIcon, RejectedIcon, VideoIcon } from "@/redesignComponents/foundations/Icons";

export type MediaType = "video" | "image";
export interface BaseImageProps extends HTMLAttributes<HTMLDivElement> {
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
    <Flex
      className={classNames(
        "bg-theme-primary-900/50 absolute inset-[0.1875rem] flex flex-col items-center justify-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100",
        borderRadius
      )}
      role="button"
      tabIndex={0}
      onClick={onClickEdit}
    >
      <Box className={classNamesHover} />
      <Text textStyle="400-bold" color="neutral.100" className="flex items-center gap-1" onClick={onClickEdit}>
        {hoverContent != null ? (
          hoverContent
        ) : (
          <>
            <EditIcon className="h-4 w-4" />
            {t("Edit")}
          </>
        )}
      </Text>
    </Flex>
  );

  const videoComponent = (
    <Flex
      className={classNames(
        "bg-theme-neutral-900/50 absolute inset-[0.1875rem] flex flex-col items-center justify-center gap-1 duration-200 group-hover:opacity-0",
        borderRadius
      )}
    >
      {isVideo && <VideoIcon className={classNames("text-theme-neutral-100 h-9 w-9", classNamesVideoIcon)} />}
    </Flex>
  );
  return (
    <Flex
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
          <Flex
            className={classNames(
              "bg-theme-neutral-200 flex h-[calc(100%-0.25rem)] w-[calc(100%-0.25rem)] flex-col items-center justify-center gap-1",
              borderRadius
            )}
          >
            <PhotoAddIcon className="h-6 w-6" />
            {onClickAdd != null && (
              <Button onClick={onClickAdd} variant="borderless" size="small">
                {t("Add Image")}
              </Button>
            )}
            {menuItems != null && <MenuCustom label={menuLabel ?? t("Add Image")} items={menuItems} />}
          </Flex>
        ) : (
          <Flex
            className={classNames(
              "bg-theme-neutral-300 relative flex h-full w-full items-center justify-center",
              borderRadius
            )}
          >
            <Flex flexDirection="column" alignItems="center" justifyContent="center" gap={1.5}>
              <RejectedIcon className="text-theme-neutral-500 h-5 w-5" />
              {hideNotAvailableText === false && (
                <Text textStyle="200" color="neutral.900" className="flex items-center gap-1">
                  {t("Image unavailable")}
                </Text>
              )}
            </Flex>
            {onClickEdit != null && hoverContentComponent}
          </Flex>
        )
      ) : isVideo ? (
        <>
          <Box
            className={classNames(
              "relative h-[calc(100%-0.25rem)] w-[calc(100%-0.25rem)] overflow-hidden",
              borderRadius
            )}
          >
            <video src={src ?? ""} className="h-full w-full object-cover" muted onError={() => setLoadError(true)} />
          </Box>

          {isVideo && videoComponent}
          {onClickEdit != null && hoverContentComponent}
        </>
      ) : (
        <>
          <Box
            className={classNames(
              "relative h-[calc(100%-0.25rem)] w-[calc(100%-0.25rem)] overflow-hidden",
              borderRadius
            )}
          >
            <NextImage
              src={src}
              alt={alt ?? t(defaultAlt)}
              width={656}
              height={656}
              unoptimized
              className="h-full w-full object-cover"
              style={style}
              onError={() => setLoadError(true)}
            />
          </Box>
          {onClickEdit != null && hoverContentComponent}
        </>
      )}
    </Flex>
  );
};

export default BaseImage;
