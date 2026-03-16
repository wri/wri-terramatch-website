import { useT } from "@transifex/react";
import classNames from "classnames";
import Image from "next/image";
import { DetailedHTMLProps, FC, HTMLAttributes, useEffect, useState } from "react";

import Text from "@/components/elements/Text/Text";
import MenuCustom from "@/redesignComponents/actions/Buttons/Menu/MenuCustom";
import { EditIcon, PhotoAddIcon, RejectedIcon } from "@/redesignComponents/foundations/Icons";
export interface BaseImageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  src?: string;
  alt?: string;
  scale?: number;
  size?: number;
  className?: string;
  borderRadius?: "rounded-md" | "rounded-full";
  defaultAlt?: string;
  classNamesHover?: string;
  isAdd?: boolean;
  hoverContent?: React.ReactNode;
  onClickEdit?: () => void;
  menuItems?: {
    label: string;
    value: string;
    startIcon?: React.ReactNode;
    onClick?: () => void;
  }[];
  menuLabel?: string;
}

const BaseImage: FC<BaseImageProps> = ({
  src,
  alt,
  scale,
  size = 164,
  className,
  borderRadius = "rounded-md",
  defaultAlt = "Image",
  classNamesHover,
  isAdd = false,
  hoverContent,
  onClickEdit,
  menuItems,
  menuLabel,
  ...rest
}) => {
  const t = useT();
  const [loadError, setLoadError] = useState(false);
  useEffect(() => {
    setLoadError(false);
  }, [src]);

  const showNotAvailable = src == null || loadError;

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
      style={{ width: size, height: size }}
    >
      {showNotAvailable || isAdd ? (
        isAdd ? (
          <div
            className={classNames(
              "flex h-[calc(100%-4px)] w-[calc(100%-4px)] flex-col items-center justify-center gap-1 bg-theme-neutral-200",
              borderRadius
            )}
          >
            <PhotoAddIcon className="h-6 w-6" />
            <MenuCustom
              label={menuLabel ?? "Add Image"}
              items={[
                ...(menuItems?.map(item => ({
                  label: item.label,
                  value: item.value,
                  startIcon: item.startIcon,
                  onClick: item.onClick
                })) ?? [])
              ]}
            />
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            onClick={onClickEdit}
            className={classNames("flex h-full w-full items-center justify-center bg-theme-neutral-300", borderRadius)}
          >
            <div className="flex flex-col items-center justify-center gap-1.5">
              <RejectedIcon className="h-5 w-5 text-theme-neutral-500" />
              <Text variant="text-12" className="flex items-center gap-1 text-theme-neutral-900">
                {t("Image unavailable")}
              </Text>
            </div>
          </div>
        )
      ) : (
        <>
          <div className={classNames("relative h-[calc(100%-4px)] w-[calc(100%-4px)] overflow-hidden", borderRadius)}>
            <Image
              src={src!}
              alt={alt ?? defaultAlt}
              fill
              className="object-cover"
              sizes={`${size}px`}
              style={scale != null ? { transform: `scale(${scale})` } : undefined}
              onError={() => setLoadError(true)}
            />
          </div>
          <div
            className={classNames(
              "absolute inset-[3px] flex flex-col items-center justify-center gap-1 bg-theme-primary-900/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100",
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
        </>
      )}
    </div>
  );
};

export default BaseImage;
