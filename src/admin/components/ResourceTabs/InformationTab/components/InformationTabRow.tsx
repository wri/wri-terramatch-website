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

const asSupportedEntity = (v: unknown): SupportedEntity | undefined =>
  typeof v === "string" ? (v as SupportedEntity) : undefined;
const asString = (v: unknown): string | undefined => (typeof v === "string" ? v : undefined);

const InformationTabRow = ({ index, type, entity, ...props }: FormSummaryRowProps) => {
  const entries = useGetFormEntries({ ...props, type, entity });
  // Default to safe empty strings when undefined to satisfy types; early return covers rendering
  const entityName = (asSupportedEntity(entity?.entityName) ?? "projects") as SupportedEntity;
  const entityUuid = asString(entity?.entityUUID) ?? "";
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
