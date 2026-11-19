import { type SystemStyleObject, Box } from "@chakra-ui/react";
import { Slider as WriSlider } from "@worldresources/wri-design-systems";
import type { ComponentProps } from "react";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

const centeredSliderMarkerStyles = {
  "& .chakra-slider__markerGroup > .chakra-slider__marker:nth-child(2)": {
    "--translate-y": "-24% !important"
  },
  "& .chakra-slider__range": {
    "border-radius": "0rem"
  }
};

const hiddenValuePreviewStyles = {
  "& .ds-slider-value-preview": {
    display: "none !important"
  }
};

interface SliderProps extends ComponentProps<typeof WriSlider> {
  css?: SystemStyleObject;
  className?: string;
  hideValuePreview?: boolean;
}

const Slider: FC<SliderProps> = ({ css, className, hideValuePreview = false, ...rest }) => {
  const isCenteredVariant = rest.isCentred === true;

  const styles = {
    "& > div": {
      padding: "0",
      height: "fit-content"
    },
    ...(isCenteredVariant ? centeredSliderMarkerStyles : {}),
    ...(hideValuePreview ? hiddenValuePreviewStyles : {}),
    ...css
  };
  return (
    <Box css={styles} className={twMerge("w-full", className)}>
      <WriSlider {...rest} />
    </Box>
  );
};

export default Slider;
