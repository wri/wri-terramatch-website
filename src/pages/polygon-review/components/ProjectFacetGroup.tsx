import { Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import FilterCard from "@/redesignComponents/containers/FilterPanel/FilterPanelElements/FilterCards";
import Checkbox from "@/redesignComponents/Forms/Actions/Checkbox/Checkbox";

import { FacetOption } from "../utils/projectContextFilter";

type ProjectFacetGroupProps = {
  label: string;
  options: FacetOption[];
  selected: string[];
  disabled: boolean;
  getLabel: (value: string) => string;
  onToggle: (value: string, checked: boolean) => void;
};

const ProjectFacetGroup: FC<ProjectFacetGroupProps> = ({ label, options, selected, disabled, getLabel, onToggle }) => {
  const t = useT();

  return (
    <FilterCard label={label}>
      {options.length === 0 ? (
        <Text textStyle="300" color="neutral.700">
          {t("No options available")}
        </Text>
      ) : (
        options.map(({ value, count }) => (
          <Checkbox
            key={value}
            name={`project-context-${value}`}
            value={value}
            checked={selected.includes(value)}
            disabled={disabled}
            onCheckedChange={({ checked }) => onToggle(value, checked)}
          >
            {`${getLabel(value)} (${count})`}
          </Checkbox>
        ))
      )}
    </FilterCard>
  );
};

export default ProjectFacetGroup;
