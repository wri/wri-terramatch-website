import { Typography } from "@mui/material";
import classNames from "classnames";
import { FC } from "react";
import { LabeledClasses } from "react-admin";

import { formatEntryValue } from "@/admin/apiProvider/utils/entryFormat";
import DisturbanceReport from "@/admin/modules/disturbanceReport/components/DisturbanceReport";
import Text from "@/components/elements/Text/Text";
import List from "@/components/extensive/List/List";
import { FormSummaryRowProps, useGetFormEntries } from "@/components/extensive/WizardForm/FormSummaryRow";
import { useFieldsProvider } from "@/context/wizardForm.provider";

type InformationTabRowProps = Omit<FormSummaryRowProps, "index">;

const InformationTabRow: FC<InformationTabRowProps> = props => {
  const entries = useGetFormEntries(props);
  const title = useFieldsProvider().step(props.stepId)?.title;
  return (
    <>
      <Text variant="text-16-semibold" className="text-darkCustom">
        {title}
      </Text>
      <List
        className={classNames("mt-4 gap-4", {
          "grid grid-cols-3": props.type === "sites",
          "flex flex-col": props.type !== "sites"
        })}
        items={entries}
        render={entry => {
          return entry.inputType === "disturbanceReportEntries" ? (
            <DisturbanceReport values={props?.values} />
          ) : (
            <div>
              <Typography className={LabeledClasses.label}>
                <Text as="span" variant="text-14-light" className="capitalize text-grey-700">
                  {entry.title === "Upload Site Boundary" ? "Site Boundary" : entry.title}
                </Text>
              </Typography>
              {typeof entry.value === "string" || typeof entry.value === "number" ? (
                <Text
                  variant="text-14-semibold"
                  className="text-darkCustom"
                  dangerouslySetInnerHTML={{ __html: formatEntryValue(entry.value) }}
                />
              ) : (
                formatEntryValue(entry.value)
              )}
            </div>
          );
        }}
      />
    </>
  );
};

export default InformationTabRow;
