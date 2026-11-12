import { Flex } from "@chakra-ui/react";
import { Combobox as WriCombobox, Tag } from "@worldresources/wri-design-systems";
import type { ComponentProps } from "react";
import { FC } from "react";

type ComboboxProps = ComponentProps<typeof WriCombobox>;

const Combobox: FC<ComboboxProps> = props => {
  const { disabled = false, showSelectedItems = false, value, defaultValue, items, initialItems } = props;
  if (!disabled || !showSelectedItems) return <WriCombobox {...props} />;

  const options = items ?? initialItems ?? [];
  const selected = (value ?? defaultValue ?? []).map(selectedValue => ({
    value: selectedValue,
    label: options.find(option => option.value === selectedValue)?.label ?? selectedValue
  }));

  return (
    <>
      <WriCombobox {...props} showSelectedItems={false} />
      {selected.length > 0 && (
        <Flex width="100%" wrap="wrap" align="flex-start" gap={1} paddingTop={1}>
          {selected.map(({ value, label }) => (
            <Tag key={value} label={label} variant="info-white" disabled />
          ))}
        </Flex>
      )}
    </>
  );
};

export default Combobox;
