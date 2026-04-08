import { Text } from "@chakra-ui/react";
import { FC } from "react";

import { formatEntryValue } from "@/admin/apiProvider/utils/entryFormat";
import { FormEntry } from "@/components/extensive/WizardForm/FormSummaryRow/types";

type EntryDefaultValueRendererProps = {
  entry: FormEntry;
};

export const EntryDefaultValueRenderer: FC<EntryDefaultValueRendererProps> = ({ entry }) => {
  const rawValue = entry.value ?? "-";

  if (typeof rawValue === "string" || typeof rawValue === "number") {
    return (
      <Text textStyle="400" color="neutral.900" dangerouslySetInnerHTML={{ __html: formatEntryValue(rawValue) }} />
    );
  }

  return (
    <Text textStyle="400" color="neutral.900">
      {formatEntryValue(rawValue)}
    </Text>
  );
};

export default EntryDefaultValueRenderer;
