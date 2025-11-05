import { Typography } from "@mui/material";
import classNames from "classnames";
import { LabeledClasses } from "react-admin";

import { formatEntryValue } from "@/admin/apiProvider/utils/entryFormat";
import DisturbanceReport from "@/admin/modules/disturbanceReport/components/DisturbanceReport";
import Text from "@/components/elements/Text/Text";
import List from "@/components/extensive/List/List";
import { usePlantTotalCount } from "@/components/extensive/Tables/TreeSpeciesTable/hooks";
import { FormSummaryRowProps, useGetFormEntries } from "@/components/extensive/WizardForm/FormSummaryRow";
import { FieldType } from "@/components/extensive/WizardForm/types";
import { usePlants } from "@/connections/EntityAssociation";
import { SupportedEntity } from "@/connections/EntityAssociation";

const InformationTabRow = ({ index, type, entity, ...props }: FormSummaryRowProps) => {
  const entries = useGetFormEntries({ ...props, type, entity });
  const entityName = entity?.entityName as unknown as SupportedEntity;
  const entityUuid = entity?.entityUUID as string;
  const [, { data: nurseryPlants }] = usePlants({
    entity: entityName,
    uuid: entityUuid,
    collection: "nursery-seedling"
  });
  const nurseryTotalFallback = (nurseryPlants ?? []).map(p => p?.amount ?? 0).reduce((sum, v) => sum + v, 0);
  const totalTreePlanted = usePlantTotalCount({ entity: entityName, entityUuid, collection: "tree-planted" });
  return (
    <>
      <Text variant="text-16-semibold" className="text-darkCustom">
        {props.step.title}
      </Text>
      <List
        className={classNames("mt-4 gap-4", {
          "grid grid-cols-3": type === "sites",
          "flex flex-col": type !== "sites"
        })}
        items={entries}
        render={entry => {
          return entry.type === "disturbanceReportEntries" ? (
            <DisturbanceReport values={props?.values} formSteps={props.steps} />
          ) : (
            <div>
              {(type === "nurseries" || type === "nursery-reports") && entry.type === FieldType.TreeSpecies ? (
                <>
                  {(() => {
                    const allFields = (props.steps ?? []).flatMap(step => step?.fields ?? []);
                    // Prefer the TreeSpecies field whose answer collection is "nursery-seedling"
                    const nurserySpeciesField = allFields.find((f: any) => {
                      if (f?.type !== FieldType.TreeSpecies) return false;
                      const fieldValues = (props.values as any)?.[f?.name];
                      const first = Array.isArray(fieldValues) ? fieldValues[0] : undefined;
                      return first?.collection === "nursery-seedling";
                    }) as any;
                    const currentField =
                      nurserySpeciesField ||
                      (allFields.find(
                        (f: any) => f?.label === entry.title && f?.type === FieldType.TreeSpecies
                      ) as any);
                    const question = currentField?.label;
                    return (
                      <>
                        {question ? (
                          <Text variant="text-14-light" className="mb-2 text-grey-700" containHtml>
                            {question}
                          </Text>
                        ) : null}
                      </>
                    );
                  })()}
                  <Typography className={LabeledClasses.label}>
                    <div className="flex items-center gap-2 py-1">
                      <Text as="span" variant="text-16-bold" className="capitalize text-darkCustom">
                        {"Saplings to be Grown"}
                      </Text>
                      <Text variant="text-18-semibold" className="capitalize text-primary" as="span">
                        {(type === "nurseries" ? nurseryTotalFallback : totalTreePlanted)?.toLocaleString?.() ?? 0}
                      </Text>
                    </div>
                  </Typography>
                  {formatEntryValue(entry.value)}
                </>
              ) : (
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
              )}
            </div>
          );
        }}
      />
    </>
  );
};

export default InformationTabRow;
