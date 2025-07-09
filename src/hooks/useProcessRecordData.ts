import { useMemo } from "react";

import { useEntityForm } from "@/hooks/useFormGet";

export function useProcessRecordData(modelUUID: string, modelName: string, inputType: string) {
  const { formData: record } = useEntityForm(modelName, modelUUID);

  return useMemo(() => {
    if (record?.data?.form == null) return false;

    for (const section of record.data.form.form_sections) {
      for (const question of section.form_questions) {
        for (const child of question.children ?? []) {
          if (child.input_type == inputType) {
            // Only hide the data if the answer is an explicit false in order to not break the UI
            // for reports that are older than the current version of the form.
            return record.data.answers![child.parent_id] !== false;
          }
        }
      }
    }

    return true;
  }, [record, inputType]);
}
