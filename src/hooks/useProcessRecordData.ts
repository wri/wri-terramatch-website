import { useMemo } from "react";

import { GetV2FormsENTITYUUIDResponse, useGetV2FormsENTITYUUID } from "@/generated/apiComponents";

export function useProcessRecordData(modelUUID: string, modelName: string, inputType: string) {
  const { data: record } = useGetV2FormsENTITYUUID<{ data: GetV2FormsENTITYUUIDResponse }>({
    pathParams: {
      uuid: modelUUID,
      entity: modelName
    }
  });

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
  }, [record, inputType, modelUUID, modelName]);
}
