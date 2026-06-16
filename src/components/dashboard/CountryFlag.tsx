import classNames from "classnames";
import { useEffect, useState } from "react";

import { resolveRectangularFlagSrc } from "@/components/dashboard/countryFlag.utils";

export type CountryFlagSize = "xs" | "sm" | "md" | "lg";

const SIZE_CLASSES: Record<CountryFlagSize, string> = {
  xs: "h-3 w-[18px]",
  sm: "h-4 w-6",
  md: "h-6 w-9",
  lg: "h-8 w-12"
};

interface CountryFlagProps {
  src: string;
  alt?: string;
  size?: CountryFlagSize;
  className?: string;
}

const CountryFlag = ({ src, alt = "flag", size = "sm", className }: CountryFlagProps) => {
  const [resolvedSrc, setResolvedSrc] = useState(src);

  useEffect(() => {
    let isActive = true;

    void resolveRectangularFlagSrc(src).then(nextSrc => {
      if (isActive) {
        setResolvedSrc(nextSrc);
      }
    });

    return () => {
      isActive = false;
    };
  }, [src]);

  return (
    <span className={classNames("inline-flex shrink-0 items-center justify-center overflow-visible", className)}>
      <img
        src={resolvedSrc}
        alt={alt}
        className={classNames("block object-contain object-center", SIZE_CLASSES[size])}
      />
    </span>
  );
};

export default CountryFlag;
