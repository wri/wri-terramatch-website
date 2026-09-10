import { useRecordContext } from "react-admin";

import { PushTranslationsButton } from "@/admin/components/PushTranslationsButton";
import { pushFormTranslation } from "@/connections/Form";

import { FormBuilderData } from "./FormBuilder/types";

export const TranslateButton = () => {
  const record = useRecordContext<FormBuilderData>();

  return <PushTranslationsButton uuid={record?.uuid} push={pushFormTranslation} />;
};
