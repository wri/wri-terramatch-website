import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import AccordionHeader from "@/redesignComponents/containers/Accordion/AccordionHeader";
import SelectInput from "@/redesignComponents/Forms/Inputs/SelectInput";

import type { CustomAttributeFormValues, PolygonAttributeDefinitionDto } from "./types";

type OptionalAttributesAccordionProps = {
  definitions: PolygonAttributeDefinitionDto[];
  values: CustomAttributeFormValues;
  onChange: (key: string, value: string[]) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instanceKey: string;
};

const OptionalAttributesAccordion: FC<OptionalAttributesAccordionProps> = ({
  definitions,
  values,
  onChange,
  open,
  onOpenChange,
  instanceKey
}) => {
  const t = useT();

  if (definitions.length === 0) return null;

  return (
    <Accordion
      header={<AccordionHeader title={t("Optional Attributes")} badge={t("Optional")} />}
      open={open}
      onOpenChange={onOpenChange}
    >
      <Flex className="mb-4 flex-1 flex-col gap-4">
        {definitions.map(definition => {
          const items = definition.options
            .slice()
            .sort((left, right) => left.order - right.order)
            .map(option => ({ value: option.value, label: option.label }));
          const value = values[definition.key] ?? [];

          return (
            <SelectInput
              key={`custom-attribute-${definition.key}-${instanceKey}-${value.join("|")}`}
              items={items}
              label={definition.label}
              defaultValue={value}
              onChange={selected =>
                onChange(definition.key, definition.inputType === "single_select" ? selected.slice(0, 1) : selected)
              }
              placeholder={t("Select...")}
              multiple={definition.inputType === "multi_select"}
            />
          );
        })}
      </Flex>
    </Accordion>
  );
};

export default OptionalAttributesAccordion;
