import { useT } from "@transifex/react";
import dynamic from "next/dynamic";
import { PropsWithChildren, useId } from "react";
import { useController, UseControllerProps } from "react-hook-form";

import InputWrapper, { InputWrapperProps } from "@/components/elements/Inputs/InputElements/InputWrapper";
import { OptionValue } from "@/types/common";

const Map = dynamic(() => import("@/components/elements/Map/Map"), { ssr: false });

export interface RHFMapProps extends UseControllerProps, InputWrapperProps {
  onChangeCapture?: () => void;
  captureInterventionTypes?: boolean;
}

/**
 * @param props PropsWithChildren<RHFSelectProps>
 * @returns React Hook Form Ready Select Component
 */
const RHFMap = ({
  captureInterventionTypes,
  onChangeCapture,
  ...inputWrapperProps
}: PropsWithChildren<RHFMapProps>) => {
  const t = useT();
  const mapId = useId();
  const {
    field: { value, onChange }
  } = useController(inputWrapperProps);

  const _onChange = (value: OptionValue[]) => {
    onChange(value);

    onChangeCapture?.();
  };

  return (
    <InputWrapper {...inputWrapperProps}>
      <Map
        //@ts-ignore
        id={mapId}
        height="350px"
        editMode={true}
        showLocation={false}
        geojson={value}
        onGeojsonChange={_onChange}
        comparisonGeoJson=""
        captureInterventionTypes={captureInterventionTypes}
        config={{
          minZoom: 2,
          zoom: 8,
          center: [51.505, -0.09],
          detectRetina: true
        }}
        t={t}
      />
    </InputWrapper>
  );
};

export default RHFMap;
