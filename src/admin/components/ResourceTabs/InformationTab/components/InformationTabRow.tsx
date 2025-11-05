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

// Typed helpers para evitar any-casts y centralizar la lógica
type SupportedCollection = "nursery-seedling" | "tree-planted" | "non-tree" | "seeds" | "replanting";

interface FieldBase {
  name: string;
  label: string;
  type: FieldType;
  fieldProps?: {
    description?: string;
    subtitle?: string;
    helperText?: string;
  };
}

type FormStep = { fields: FieldBase[] };
type FormValues = Record<string, unknown>;

type TreeSpeciesValue = {
  name?: string | null;
  amount?: number | null;
  taxon_id?: string | null;
  collection?: SupportedCollection;
};

const getTreeSpeciesValues = (values: FormValues, field: FieldBase): TreeSpeciesValue[] => {
  const raw = values?.[field?.name];
  return Array.isArray(raw) ? (raw as TreeSpeciesValue[]) : [];
};

const findNurserySpeciesField = (steps: FormStep[], values: FormValues): FieldBase | undefined => {
  for (const step of steps) {
    for (const field of step?.fields ?? []) {
      if (field?.type !== FieldType.TreeSpecies) continue;
      const vals = getTreeSpeciesValues(values, field);
      if (vals[0]?.collection === "nursery-seedling") return field;
    }
  }
  return undefined;
};

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
                  {(() => {
                    const steps = (props.steps as unknown as FormStep[]) ?? [];
                    const values = (props.values as unknown as FormValues) ?? {};
                    const nurseryField = findNurserySpeciesField(steps, values);
                    const currentField =
                      nurseryField ?? steps.flatMap(s => s.fields).find(f => f.label === entry.title);
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
