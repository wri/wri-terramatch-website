import { isEmpty } from "lodash";
import { FC } from "react";
import { FormDataConsumerRenderParams, useInput } from "react-admin";

import { FormQuestionField } from "@/admin/modules/form/components/FormBuilder/QuestionArrayInput";
import { useOptionList } from "@/connections/Form";
import { useValueChanged } from "@/hooks/useValueChanged";

type DefaultOptionsSetterProps = {
  field: FormQuestionField;
  getSource: NonNullable<FormDataConsumerRenderParams["getSource"]>;
};

// A component to ensure that the options associated with a linked field get copied over as options
// to the field definition when the linked field key is selected in the form builder.
export const DefaultOptionsSetter: FC<DefaultOptionsSetterProps> = ({ field, getSource }) => {
  const { field: formField } = useInput({ source: getSource("options") });
  const [optionsLoaded, { data: options }] = useOptionList({
    listKey: field.optionListKey,
    enabled: field.optionListKey != null && !field.optionListKey.startsWith("gadm-level-")
  });
  useValueChanged(optionsLoaded, () => {
    if (optionsLoaded && options != null && isEmpty(formField.value)) {
      formField.onChange(options);
    }
  });

  // This one doesn't render anything.
  return null;
};
