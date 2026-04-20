import { FC, useMemo } from "react";

import { TreeSpeciesValue } from "@/components/elements/Inputs/TreeSpeciesInput/TreeSpeciesInput";
import PlantTableEntryRenderer from "@/components/extensive/PageElements/PageContent/components/PlantTableEntryRenderer";
import { PlantData } from "@/components/extensive/Tables/TreeSpeciesTable";
import { FieldDefinition } from "@/components/extensive/WizardForm/types";
import { getAnswer } from "@/components/extensive/WizardForm/utils";
import { FormFieldsProvider } from "@/context/wizardForm.provider";

type TreeSpeciesEntryProps = {
  field: FieldDefinition;
  values: any;
  fieldsProvider: FormFieldsProvider;
};

const TreeSpeciesEntryValue: FC<TreeSpeciesEntryProps> = ({ field, values, fieldsProvider }) => {
  const plants = useMemo(
    () =>
      ((getAnswer(field, values, fieldsProvider) ?? []) as TreeSpeciesValue[]).map(
        ({ name, amount, taxonId }) =>
          ({
            name,
            amount,
            // ?? null is important here for the isEqual check in useFormChanges. The v3 API always
            // returns null, so if taxon_id is undefined here, we want it to be explicitly null
            // for comparison.
            taxonId: taxonId ?? null
          } as PlantData)
      ),
    [field, fieldsProvider, values]
  );

  const tableType = field.additionalProps?.with_numbers !== true ? "noCount" : "noGoal";
  return plants.length === 0 ? null : <PlantTableEntryRenderer {...{ tableType, plants }} />;
};

export default TreeSpeciesEntryValue;
