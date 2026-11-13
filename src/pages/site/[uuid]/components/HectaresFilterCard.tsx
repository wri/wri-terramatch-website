import { useT } from "@transifex/react";
import { clamp } from "lodash";
import { FC, useCallback, useMemo } from "react";

import FilterCard from "@/redesignComponents/containers/FilterPanel/FilterPanelElements/FilterCards";
import Slider from "@/redesignComponents/Forms/Controls/Slider";

import { CalcAreaBounds, CalcAreaRange, formatHectares } from "./polygonFilter.constants";

const SLIDER_STEPS = 200;

const logScale = ({ min, max }: CalcAreaBounds) => {
  const low = Math.log1p(min);
  const span = Math.log1p(max) - low;
  return {
    toPosition: (hectares: number) =>
      clamp(Math.round(((Math.log1p(hectares) - low) / span) * SLIDER_STEPS), 0, SLIDER_STEPS),
    toHectares: (position: number) => Math.expm1(low + (position / SLIDER_STEPS) * span)
  };
};

type HectaresFilterCardProps = {
  bounds: CalcAreaBounds;
  value: CalcAreaRange;
  disabled?: boolean;
  onChange: (value: CalcAreaRange) => void;
};

const HectaresFilterCard: FC<HectaresFilterCardProps> = ({
  bounds,
  value: { calcAreaMin, calcAreaMax },
  disabled,
  onChange
}) => {
  const t = useT();
  const { toPosition, toHectares } = useMemo(() => logScale(bounds), [bounds]);

  const positions = useMemo(
    () => [
      calcAreaMin == null ? 0 : toPosition(calcAreaMin),
      calcAreaMax == null ? SLIDER_STEPS : toPosition(calcAreaMax)
    ],
    [calcAreaMin, calcAreaMax, toPosition]
  );

  // A thumb resting on the end of the track means "no bound", so polygons without a calculated area stay included.
  const handleValueChange = useCallback(
    ({ value: [start, end] }: { value: number[] }) =>
      onChange({
        calcAreaMin: start === 0 ? null : toHectares(start),
        calcAreaMax: end === SLIDER_STEPS ? null : toHectares(end)
      }),
    [onChange, toHectares]
  );

  const getAriaValueText = useCallback(
    ({ value }: { value: number }) => t("{value} ha", { value: formatHectares(toHectares(value)) }),
    [t, toHectares]
  );

  const projectRange = { min: formatHectares(bounds.min), max: formatHectares(bounds.max) };
  const caption =
    calcAreaMin == null && calcAreaMax == null
      ? t("Project range {min}–{max} ha", projectRange)
      : t("{selectedMin}–{selectedMax} ha selected · project range {min}–{max} ha", {
          ...projectRange,
          selectedMin: formatHectares(calcAreaMin ?? bounds.min),
          selectedMax: formatHectares(calcAreaMax ?? bounds.max)
        });

  return (
    <FilterCard label={t("Hectares")} caption={caption}>
      <Slider
        min={0}
        max={SLIDER_STEPS}
        step={1}
        value={positions}
        disabled={disabled}
        hideValuePreview
        // eslint-disable-next-line jsx-a11y/aria-proptypes -- Chakra's range slider takes one label per thumb.
        aria-label={[t("Minimum hectares"), t("Maximum hectares")]}
        getAriaValueText={getAriaValueText}
        onValueChange={handleValueChange}
      />
    </FilterCard>
  );
};

export default HectaresFilterCard;
