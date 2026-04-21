import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

import MapContainer from "@/components/elements/Map-mapbox/Map";

type FormMapSizeVariant = "input" | "summary";
type FormMapContainerProps = ComponentProps<typeof MapContainer> & {
  sizeVariant?: FormMapSizeVariant;
};

const FORM_MAP_SIZE_CLASS: Record<FormMapSizeVariant, string> = {
  input: "h-[500px] wide:h-[700px] w-full min-w-0",
  summary: "h-[240px] w-full min-w-0"
};

const FormMapContainer = ({ sizeVariant = "input", className, ...props }: FormMapContainerProps) => {
  return (
    <MapContainer
      {...props}
      formMap={true}
      disableRequestAnimationFrameResize={true}
      className={twMerge(FORM_MAP_SIZE_CLASS[sizeVariant], className)}
    />
  );
};

export default FormMapContainer;
