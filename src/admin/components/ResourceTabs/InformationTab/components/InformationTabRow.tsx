import { Divider, Typography } from "@mui/material";
import { LabeledClasses } from "react-admin";
import { When } from "react-if";

import { convertDateformat } from "@/admin/apiProvider/utils/dateFormat";
import List from "@/components/extensive/List/List";
import { FormSummaryRowProps, useGetFormEntries } from "@/components/extensive/WizardForm/FormSummaryRow";

const InformationTabRow = ({ index, ...props }: FormSummaryRowProps) => {
  const entries = useGetFormEntries(props);

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
            <Typography variant="body2" dangerouslySetInnerHTML={{ __html: convertDateformat(entry.value) }} />
          </div>
        )}
      />
    </>
  );
};

export default InformationTabRow;
