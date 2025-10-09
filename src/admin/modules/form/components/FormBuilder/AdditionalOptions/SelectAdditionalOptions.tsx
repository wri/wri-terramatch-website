import { Button } from "@mui/material";
import { FC, Fragment, useMemo, useState } from "react";
import { BooleanInput, FormDataConsumerRenderParams, minLength } from "react-admin";

import { OptionArrayInput } from "@/admin/modules/form/components/FormBuilder/OptionArrayInput";
import { FormQuestionField } from "@/admin/modules/form/components/FormBuilder/QuestionArrayInput";
import { Choice } from "@/admin/types/common";
import { noDuplication, noEmptyElement } from "@/admin/utils/forms";
import { useOptionList } from "@/connections/util/Form";

type SelectAdditionalOptionsProps = {
  field: FormQuestionField;
  getSource: NonNullable<FormDataConsumerRenderParams["getSource"]>;
};

const SelectAdditionalOptions: FC<SelectAdditionalOptionsProps> = ({ field, getSource }) => {
  const allowCreate = useMemo(() => {
    if (field.id === "org-type") return false;
    if (field.optionListKey != null && ["countries", "months"].includes(field.optionListKey)) return false;
    if (field.optionListKey?.startsWith("gadm-level-")) return false;
    return true;
  }, [field]);
  const allowEditOptions = useMemo(() => {
    if (field.optionListKey?.startsWith("gadm-level-")) return false;
    return true;
  }, [field]);
  const [editOptions, setEditOptions] = useState(false);
  const [, { data: defaultOptions }] = useOptionList({
    listKey: field.optionListKey,
    enabled: field.optionListKey != null && !field.optionListKey.startsWith("gadm-level-")
  });

  return (
    <>
      {!editOptions ? (
        allowEditOptions && (
          <Button onClick={() => setEditOptions(true)} variant="contained" sx={{ marginX: "auto", marginY: 2 }}>
            {"Edit options"}
          </Button>
        )
      ) : (
        <OptionArrayInput
          label="Options"
          source={getSource("form_question_options")}
          //@ts-ignore
          defaultValue={defaultOptions}
          dropDownOptions={
            defaultOptions?.map(option => ({
              ...option,
              id: option.altValue ?? option.slug,
              name: option.label
            })) as Choice[]
          }
          allowCreate={allowCreate}
          allowImages={field.inputType === "select-image"}
          validate={[noEmptyElement("label"), noDuplication("label"), minLength(1, "At least one Option is required")]}
        />
      )}
      {allowCreate && field.inputType === "select" && (
        <BooleanInput
          source={getSource("options_other")}
          label="Has Other"
          helperText="Enable this option to let users provide a response when they choose 'Other' as an option."
          defaultValue={false}
        />
      )}
    </>
  );
};

export default SelectAdditionalOptions;
