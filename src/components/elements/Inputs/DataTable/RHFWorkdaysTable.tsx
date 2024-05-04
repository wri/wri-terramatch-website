import { PropsWithChildren, useCallback, useMemo } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import { Demographic } from "@/components/extensive/WorkdayCollapseGrid/types";
import WorkdayCollapseGrid from "@/components/extensive/WorkdayCollapseGrid/WorkdayCollapseGrid";
import { GRID_VARIANT_GREEN } from "@/components/extensive/WorkdayCollapseGrid/WorkdayVariant";
import { Entity } from "@/types/common";

import { DataTableProps } from "./DataTable";

export interface RHFWorkdaysTableProps
  extends Omit<DataTableProps<any>, "value" | "onChange" | "fields" | "addButtonCaption" | "tableColumns">,
    UseControllerProps {
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
  entity: Entity;
  collection: string;
}

const RHFWorkdaysTable = ({
  onChangeCapture,
  entity,
  collection,
  ...props
}: PropsWithChildren<RHFWorkdaysTableProps>) => {
  const {
    field: { value, onChange }
  } = useController(props);

  const demographics = useMemo(
    function () {
      if (value == null || value.length == 0) {
        return [];
      } else return value[0].demographics;
    },
    [value]
  );

  const updateDemographics = useCallback(
    (updatedDemographics: Demographic[]) => {
      onChange([{ ...value[0], collection, demographics: updatedDemographics }]);
    },
    [value]
  );

  return (
    <WorkdayCollapseGrid
      title={props.label ?? ""}
      demographics={demographics}
      variant={GRID_VARIANT_GREEN}
      onChange={updateDemographics}
    />
  );
};

export default RHFWorkdaysTable;
