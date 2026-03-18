import { Box } from "@chakra-ui/react";
import { Slider as WriSlider } from "@worldresources/wri-design-systems";
import type { ComponentProps } from "react";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

interface SliderProps extends ComponentProps<typeof WriSlider> {
  css?: any;
  className?: string;
}

const Slider: FC<SliderProps> = ({ css, className, ...rest }) => {
  const styles = {
    "& > div": {
      padding: "0",
      height: "fit-content"
    },
    ...css
  };
  return (
    <Box css={styles} className={twMerge("w-full", className)}>
      <WriSlider {...rest} />
    </Box>
  );
};

export default Slider;
