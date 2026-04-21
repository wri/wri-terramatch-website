import { Box } from "@chakra-ui/react";
import { SliderInput as WriSliderInput } from "@worldresources/wri-design-systems";
import type { ComponentProps } from "react";
import { FC } from "react";

import { getSliderInputWrapperStyles, shouldWrapSliderInputStyles } from "./styles";

const SliderInput: FC<ComponentProps<typeof WriSliderInput>> = props => {
  const isCenteredVariant = props.sliderItem?.isCentred === true;
  const isSmallSize = props.size === "small";
  const isDiscrete = Array.isArray(props.sliderItem?.marks) && props.sliderItem.marks.length > 0;

  if (!shouldWrapSliderInputStyles({ isCenteredVariant, isSmallSize, isDiscrete })) {
    return <WriSliderInput {...props} />;
  }

  return (
    <Box css={getSliderInputWrapperStyles({ isCenteredVariant, isSmallSize, isDiscrete })}>
      <WriSliderInput {...props} />
    </Box>
  );
};

export default SliderInput;
