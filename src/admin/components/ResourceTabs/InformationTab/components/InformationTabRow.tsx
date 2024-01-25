import { Divider, Typography } from "@mui/material";
import { LabeledClasses } from "react-admin";
import { Else, If, Then, When } from "react-if";

import List from "@/components/extensive/List/List";
import { FormSummaryRowProps, useGetFormEntries } from "@/components/extensive/WizardForm/FormSummaryRow";
import { useVerifyDate } from "@/hooks/useVerifyDate";

const InformationTabRow = ({ index, ...props }: FormSummaryRowProps) => {
  const entries = useGetFormEntries(props);
  const { formatDateString, isDateStringValid } = useVerifyDate();

  return (
    <>
      <When condition={index}>
        <Divider sx={{ marginRight: -16, marginLeft: -16 }} />
      </When>
      <Typography variant="h6" component="h3" marginTop={index !== 0 ? 2 : 0} className="capitalize">
        {props.step.title}
      </Typography>
      <List
        className="mt-4 flex flex-col gap-4"
        items={entries}
        render={entry => (
          <div>
            <Typography className={LabeledClasses.label}>
              <span className="capitalize">{entry.title}</span>
            </Typography>
            <If condition={typeof entry.value === "string" || typeof entry.value === "number"}>
              <Then>
                <If condition={isDateStringValid(entry.value)}>
                  <Then>{formatDateString(entry.value)}</Then>
                  <Else>
                    <Typography variant="body2" dangerouslySetInnerHTML={{ __html: entry.value }} />
                  </Else>
                </If>
              </Then>
              <Else>{entry.value}</Else>
            </If>
          </div>
        )}
      />
    </>
  );
};

export default InformationTabRow;
