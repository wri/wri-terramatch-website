import { useT } from "@transifex/react";
import classNames from "classnames";
import Image from "next/image";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import Text from "@/components/elements/Text/Text";
import { Edit, PhotoAdd } from "@/redesignComponents/foundations/Icons";

export interface BaseImageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
  isAvailable?: boolean;
  borderRadius?: "rounded-md" | "rounded-full";
  defaultAlt?: string;
  classNamesHover?: string;
}

const BaseImage: FC<BaseImageProps> = ({
  src,
  alt,
  size = 164,
  className,
  isAvailable = true,
  borderRadius = "rounded-md",
  defaultAlt = "Image",
  classNamesHover,
  ...rest
}) => {
  const t = useT();
  const showNotAvailable = !isAvailable || src == null;

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
      {showNotAvailable ? (
        <div
          className={classNames(
            "flex h-[calc(100%-4px)] w-[calc(100%-4px)] flex-col items-center justify-center gap-2 bg-theme-neutral-200",
            borderRadius
          )}
        >
          <PhotoAdd className="h-6 w-6" />
          <Text variant="text-16-bold" className="text-theme-neutral-900">
            {t("Upload Image")}
          </Text>
        </div>
      ) : (
        <>
          <div className={classNames("relative h-[calc(100%-4px)] w-[calc(100%-4px)] overflow-hidden", borderRadius)}>
            <Image src={src!} alt={alt || defaultAlt} fill className="object-cover" sizes={`${size}px`} />
          </div>
          <div
            className={classNames(
              "absolute inset-[3px] flex flex-col items-center justify-center gap-1 bg-theme-primary-900/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100",
              borderRadius
            )}
          >
            <div className={classNamesHover} />
            <Text variant="text-16-bold" className="flex items-center gap-1 text-white">
              <Edit className="h-4 w-4" />
              {t("Edit")}
            </Text>
          </div>
        </>
      )}
    </div>
  );
};

export default BaseImage;
