import { Typography } from "@mui/material";
import { LabeledClasses } from "react-admin";
import { Else, If, Then } from "react-if";

import { formatEntryValue } from "@/admin/apiProvider/utils/entryFormat";
import Text from "@/components/elements/Text/Text";
import List from "@/components/extensive/List/List";
import { FormSummaryRowProps, useGetFormEntries } from "@/components/extensive/WizardForm/FormSummaryRow";

const InformationTabRow = ({ index, ...props }: FormSummaryRowProps) => {
  const entries = useGetFormEntries(props);
  return (
    <>
      <Text variant="text-16-semibold" className="text-darkCustom">
        {props.step.title}
      </Text>
      <List
        items={entries}
        render={entry => (
          <div>
            <Typography className={LabeledClasses.label}>
              <Text variant="text-14-light" className="capitalize text-grey-700">
                {entry.title}
              </Text>
            </Typography>
            <If condition={typeof entry.value === "string" || typeof entry.value === "number"}>
              <Then>
                <Text
                  variant="text-14-semibold"
                  className="text-darkCustom"
                  dangerouslySetInnerHTML={{ __html: formatEntryValue(entry.value) }}
                />
              </Then>
              <Else>{formatEntryValue(entry.value)}</Else>
            </If>
          </div>
        )}
      />
    </>
  );
};

export default InformationTabRow;
