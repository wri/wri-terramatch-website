import { Box, Grid, Input, Typography } from "@mui/material";
import { useT } from "@transifex/react";
import { useEffect, useId, useState } from "react";
import { FieldError, FieldValues, UseFormReturn } from "react-hook-form";

import { Option } from "@/types/common";

import InputWrapper, { InputWrapperProps } from "../InputElements/InputWrapper";

export interface StrategyAreaInputProps extends InputWrapperProps {
  inputId?: string;
  containerClassName?: string;
  label?: string;
  description?: string;
  placeholder?: string;
  className?: string;
  options: Option[];
  optionsFilter?: string | string[];
  defaultValue?: string;
  required?: boolean;
  value?: string;
  error?: FieldError;
  onChange: (value: string) => void;
  feedbackRequired?: boolean;
  formHook: UseFormReturn<FieldValues, any>;
  collection?: string;
}

export const StrategyAreaInput = (props: StrategyAreaInputProps) => {
  const id = useId();
  const t = useT();
  const { value } = props;
  const options = props.optionsFilter
    ? props.options.filter(option => props.optionsFilter?.includes(option.meta))
    : props.options;

  const [strategyAreas, setStrategyAreas] = useState<{ strategy: string; percentage: number | null }[]>([]);
  useEffect(() => {
    if (options) {
      const initialStrategyAreas = options?.map(option => ({
        strategy: option.title,
        percentage: null
      }));
      setStrategyAreas(initialStrategyAreas as { strategy: string; percentage: number | null }[]);
    }
  }, [props.options, options]);

  const titleActionsMap = {
    ["pro-pit-restoration-strategy-distribution" as string]: {
      firstColumnTitle: t("RESTORATION STRATEGY"),
      secondColumnTitle: t("% OF PROJECT AREA")
    },
    ["pro-pit-land-use-type-distribution" as string]: {
      firstColumnTitle: t("LAND USE TYPE"),
      secondColumnTitle: t("% OF PROJECT AREA")
    },
    ["pro-pit-land-tenure-distribution" as string]: {
      firstColumnTitle: t("LAND TENURE"),
      secondColumnTitle: t("% OF PROJECT AREA")
    }
  };

  useEffect(() => {
    if (value) {
      const parsedValue = typeof value === "string" ? JSON.parse(value) : value;
      if (!Array.isArray(parsedValue)) {
        return;
      }

      const updatedStrategyAreas = parsedValue?.map((item: { [key: string]: number }) => {
        const strategy = Object.keys(item)[0];
        const percentage = item[strategy];
        return {
          strategy,
          percentage: typeof percentage === "number" ? percentage : null
        };
      });

      setStrategyAreas(updatedStrategyAreas);
    }
  }, [value]);

  const handlePercentageChange = (value: number, index: number) => {
    const updated = [...strategyAreas];
    updated[index].percentage = value;
    setStrategyAreas(updated);

    const formatted = updated.map(item => ({ [item.strategy]: item.percentage }));
    props.onChange(JSON.stringify(formatted));
    props.formHook.trigger();
  };

  return (
    <InputWrapper
      label={props.label}
      required={props.required}
      containerClassName={props.containerClassName}
      description={props.description}
      inputId={id}
      error={props.error}
      feedbackRequired={props.feedbackRequired}
    >
      <Box display="flex" flexDirection="column" mt={4} border="1px solid #e0e0e0" borderRadius="12px">
        <Grid
          container
          sx={{
            backgroundColor: "#f9f9f9",
            borderBottom: "1px solid #e0e0e0",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px"
          }}
        >
          <Grid
            item
            xs={6}
            sx={{ borderRight: "1px solid #e0e0e0", padding: "12px", textAlign: "center", borderTopLeftRadius: "12px" }}
          >
            <Typography fontWeight="bold">{titleActionsMap[props.collection!]?.firstColumnTitle}</Typography>
          </Grid>
          <Grid item xs={5} sx={{ padding: "12px", textAlign: "center" }}>
            <Typography fontWeight="bold">{titleActionsMap[props.collection!]?.secondColumnTitle}</Typography>
          </Grid>
          <Grid item xs={1} />
        </Grid>

        {strategyAreas.map((field, index) => (
          <Grid
            container
            key={index}
            sx={{
              borderBottom: index < strategyAreas.length - 1 ? "1px solid #e0e0e0" : "none",
              alignItems: "center"
            }}
          >
            <Grid item xs={6} sx={{ borderRight: "1px solid #e0e0e0", p: 2 }}>
              <Typography>{field.strategy}</Typography>
            </Grid>
            <Grid item xs={5} sx={{ p: 2 }}>
              <Input
                name={`strategy_areas.${index}.percentage`}
                type="number"
                inputProps={{
                  min: 0,
                  max: 100,
                  style: { textAlign: "center" }
                }}
                fullWidth
                onKeyDown={e => {
                  if (e.key === "," || e.key === ".") {
                    e.preventDefault();
                  }
                }}
                onChange={e => {
                  const rawValue = e.target.value;

                  if (rawValue === "") {
                    const updated = [...strategyAreas];
                    updated[index].percentage = null;
                    setStrategyAreas(updated);
                    return;
                  }

                  const parsed = parseInt(rawValue, 10);
                  if (!isNaN(parsed)) {
                    handlePercentageChange(parsed, index);
                  }
                }}
                value={field.percentage === null || field.percentage === undefined ? "" : field.percentage}
              />
            </Grid>
          </Grid>
        ))}
      </Box>
    </InputWrapper>
  );
};
