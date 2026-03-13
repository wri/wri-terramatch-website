import { useT } from "@transifex/react";
import classNames from "classnames";
import Image from "next/image";
import { DetailedHTMLProps, FC, HTMLAttributes, useEffect, useState } from "react";

import Text from "@/components/elements/Text/Text";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { EditIcon, PhotoAddIcon, RejectedIcon } from "@/redesignComponents/foundations/Icons";

export interface BaseImageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
  borderRadius?: "rounded-md" | "rounded-full";
  defaultAlt?: string;
  classNamesHover?: string;
  isAdd?: boolean;
  onClickAdd?: () => void;
  hoverContent?: React.ReactNode;
}

const BaseImage: FC<BaseImageProps> = ({
  src,
  alt,
  size = 164,
  className,
  borderRadius = "rounded-md",
  defaultAlt = "Image",
  classNamesHover,
  isAdd = false,
  onClickAdd,
  hoverContent,
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
              "bg-theme-neutral-200 flex h-[calc(100%-4px)] w-[calc(100%-4px)] flex-col items-center justify-center gap-1",
              borderRadius
            )}
          >
            <PhotoAddIcon className="h-6 w-6" />
            <Button variant="borderless" size="small" onClick={onClickAdd}>
              {t("Add Image")}
            </Button>
          </div>
        ) : (
          <div
            className={classNames("bg-theme-neutral-300 flex h-full w-full items-center justify-center", borderRadius)}
          >
            <div className="flex flex-col items-center justify-center gap-1.5">
              <RejectedIcon className="text-theme-neutral-500 h-5 w-5" />
              <Text variant="text-12" className="text-theme-neutral-900 flex items-center gap-1">
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
              onError={() => setLoadError(true)}
            />
          </div>
          <div
            className={classNames(
              "bg-theme-primary-900/50 absolute inset-[3px] flex flex-col items-center justify-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100",
              borderRadius
            )}
          >
            <div className={classNamesHover} />
            <Text variant="text-16-bold" className="flex items-center gap-1 text-white">
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
