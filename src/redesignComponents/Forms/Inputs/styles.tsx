type SliderInputStyleOptions = {
  isCenteredVariant: boolean;
  isSmallSize: boolean;
  isDiscrete: boolean;
};

const centeredSliderMarkerStyles = {
  "& .chakra-slider__markerGroup > .chakra-slider__marker:nth-child(2)": {
    "--translate-y": "-24% !important"
  },
  "& .chakra-slider__range": {
    "border-radius": "0rem"
  }
};

const discreteSliderMarkerStyles = {
  "& .chakra-select__control": {
    "margin-top": "0.5rem"
  }
};

const smallSliderInputStyles = {
  "& .chakra-slider__root": {
    height: "1.75rem",
    marginTop: "0rem",
    display: "flex",
    justifyContent: "center"
  },
  "& .ds-text-input-container .chakra-field__root .chakra-input": {
    height: "1.75rem",
    fontSize: "0.875rem",
    marginTop: "0.25rem"
  }
};

export const shouldWrapSliderInputStyles = ({
  isCenteredVariant,
  isSmallSize,
  isDiscrete
}: SliderInputStyleOptions): boolean => isCenteredVariant || isSmallSize || isDiscrete;

export const getSliderInputWrapperStyles = ({
  isCenteredVariant,
  isSmallSize,
  isDiscrete
}: SliderInputStyleOptions) => ({
  ...(isCenteredVariant ? centeredSliderMarkerStyles : {}),
  ...(isSmallSize ? smallSliderInputStyles : {}),
  ...(isDiscrete ? discreteSliderMarkerStyles : {})
});
