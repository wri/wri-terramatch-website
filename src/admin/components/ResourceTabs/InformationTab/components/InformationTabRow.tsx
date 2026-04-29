import { Typography } from "@mui/material";
import classNames from "classnames";
import { camelCase } from "lodash";
import { FC } from "react";
import { LabeledClasses, useShowContext } from "react-admin";

import { formatEntryValue } from "@/admin/apiProvider/utils/entryFormat";
import DisturbanceReport from "@/admin/modules/disturbanceReport/components/DisturbanceReport";
import Text from "@/components/elements/Text/Text";
import List from "@/components/extensive/List/List";
import { usePlantTotalCount } from "@/components/extensive/Tables/TreeSpeciesTable/hooks";
import { FormSummaryRowProps } from "@/components/extensive/WizardForm/FormSummaryRow";
import { useGetFormEntries } from "@/components/extensive/WizardForm/FormSummaryRow/getFormEntries";
import { SupportedEntity } from "@/connections/EntityAssociation";
import { Framework, useFrameworkContext } from "@/context/framework.provider";
import { type FormFieldsProvider, useFieldsProvider, useFormEntities } from "@/context/wizardForm.provider";

type InformationTabRowProps = Omit<FormSummaryRowProps, "index" | "type">;

const InformationTabRow: FC<InformationTabRowProps> = props => {
  const entity = useFormEntities()[0];
  const entityName = camelCase(entity?.entityName ?? "projects") as SupportedEntity;
  const entityUuid = entity?.entityUUID ?? "";
  const entries = useGetFormEntries({ ...props, entity });
  const { record } = useShowContext();
  // usePlantTotalCount already combines plants and reportCounts, filtering duplicates for nurseries
  const nurseryTotalFallback = usePlantTotalCount({ entity: entityName, entityUuid, collection: "nursery-seedling" });
  const totalTreePlanted = usePlantTotalCount({ entity: entityName, entityUuid, collection: "tree-planted" });
  const fieldsProvider = useFieldsProvider();
  const { framework } = useFrameworkContext();
  const title = fieldsProvider.step(props.stepId)?.title;
  const showTreesToBeRestored =
    entityName === "projects" &&
    framework === Framework.TF_3 &&
    stepIncludesTreesGoalField(fieldsProvider, props.stepId);
  return (
    <>
      <Text variant="text-16-semibold" className="text-darkCustom">
        {entityName != "financialReports" && title}
      </Text>
      <List
        className={classNames("mt-4 gap-4", {
          "grid grid-cols-3": entityName === "sites",
          "flex flex-col": entityName !== "sites",
          "grid grid-cols-2": entityName === "financialReports"
        })}
        items={entries}
        render={entry => {
          return entry.inputType === "disturbanceReportEntries" ? (
            <DisturbanceReport values={props?.values} />
          ) : (
            <div>
              {(entityName === "nurseries" || entityName === "nurseryReports") && entry.inputType === "treeSpecies" ? (
                <>
                  {entry.title ? (
                    <Text variant="text-14-light" className="mb-2 text-grey-700" containHtml>
                      {entry.title}
                    </Text>
                  ) : null}
                  <Typography className={LabeledClasses.label}>
                    <div className="flex items-center gap-2 py-1">
                      <Text as="span" variant="text-16-bold" className="capitalize text-darkCustom">
                        {"Saplings to be Grown"}
                      </Text>
                      <Text variant="text-18-semibold" className="capitalize text-primary" as="span">
                        {(entityName === "nurseries" ? nurseryTotalFallback : totalTreePlanted)?.toLocaleString?.() ??
                          0}
                      </Text>
                    </div>
                  </Typography>
                  {formatEntryValue(entry.value)}
                </>
              ) : entityName != "financialReports" ? (
                <>
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
                </>
              ) : (
                entityName == "financialReports" &&
                entry.inputType == "select" && (
                  <>
                    <Text variant="text-14-light" className="text-darkCustom-300">
                      {entry.title}
                    </Text>
                    {typeof entry.value === "string" || typeof entry.value === "number" ? (
                      <Text
                        variant="text-14-semibold"
                        className="text-darkCustom"
                        dangerouslySetInnerHTML={{
                          __html: formatEntryValue(entry.value)
                        }}
                      />
                    ) : (
                      formatEntryValue(entry.value)
                    )}
                  </>
                )
              )}
            </div>
          );
        }}
      />
      {showTreesToBeRestored ? (
        <Typography className={LabeledClasses.label}>
          <div className="mt-4 flex items-center gap-2 py-1">
            <Text as="span" variant="text-16-bold" className="capitalize text-darkCustom">
              Trees to be Restored:
            </Text>
            <Text variant="text-18-semibold" className="capitalize text-primary" as="span">
              {(record?.treesToBeRestoredGoal ?? 0).toLocaleString()}
            </Text>
          </div>
        </Typography>
      ) : null}
    </>
  );
};

function stepIncludesTreesGoalField(fieldsProvider: FormFieldsProvider, stepId: string): boolean {
  const visit = (fieldName: string): boolean => {
    const field = fieldsProvider.fieldByName(fieldName);
    if (field?.inputType === "treesGoal") return true;
    return fieldsProvider.childNames(fieldName).some(child => visit(child));
  };
  return fieldsProvider.fieldNames(stepId).some(visit);
}

export default InformationTabRow;
