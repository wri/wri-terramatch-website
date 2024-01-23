import { Divider, Typography } from "@mui/material";
import { LabeledClasses } from "react-admin";
import { Else, If, Then, When } from "react-if";

import List from "@/components/extensive/List/List";
import { FormSummaryRowProps, useGetFormEntries } from "@/components/extensive/WizardForm/FormSummaryRow";

const InformationTabRow = ({ index, ...props }: FormSummaryRowProps) => {
  const entries = useGetFormEntries(props);

  const formatDateString = (inputDateString: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(inputDateString)) {
      return "Invalid Date";
    }

    const [year, month, day] = inputDateString.split("-");
    const dateObject = new Date(Number(year), Number(month) - 1, Number(day));

    const formattedDay = dateObject.getDate().toString().padStart(2, "0");
    const formattedMonth = (dateObject.getMonth() + 1).toString().padStart(2, "0");
    const formattedYear = dateObject.getFullYear();

    const formattedDate = `${formattedDay}/${formattedMonth}/${formattedYear}`;

    return formattedDate;
  };

  function isDateStringValid(dateString: string): boolean {
    if (!isNaN(Number(dateString))) {
      return false;
    }
    const timestamp = Date.parse(dateString);
    return !isNaN(timestamp);
  }

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
