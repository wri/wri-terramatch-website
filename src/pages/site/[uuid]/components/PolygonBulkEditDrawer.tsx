import { Box, Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { cloneElement, FC, isValidElement, ReactElement, useState } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import IconButton from "@/redesignComponents/actions/Buttons/IconButton/IconButton";
import Drawer from "@/redesignComponents/containers/Drawer/Drawer";
import FilterPanel from "@/redesignComponents/containers/FilterPanel/FilterPanel";
import DatePickerInput from "@/redesignComponents/Forms/Inputs/DateInputs/DatePickerInput/DatePickerInput";
import SelectInput from "@/redesignComponents/Forms/Inputs/SelectInput";
import TextInput from "@/redesignComponents/Forms/Inputs/TextInput";
import { EditIcon } from "@/redesignComponents/foundations/Icons/Function/EditIcon";

interface PolygonBulkEditDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const mockedOptions = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" }
];

type EditableInputProps = { disabled?: boolean };

const EditWrapper: FC<{ children: ReactElement<EditableInputProps> }> = ({ children }) => {
  const [isEditing, setIsEditing] = useState(false);
  const t = useT();

  const input = isValidElement(children)
    ? cloneElement(children, {
        disabled: !isEditing || children.props.disabled === true
      })
    : children;

  return (
    <Flex className="items-center gap-4">
      {input}
      {isEditing ? (
        <Flex className="mt-auto h-[2.5rem] items-center gap-2">
          <Button variant="borderless" size="small" onClick={() => setIsEditing(false)}>
            {t("Cancel")}
          </Button>
          <Button variant="secondary" size="small" onClick={() => setIsEditing(false)}>
            {t("Save")}
          </Button>
        </Flex>
      ) : (
        <Box className="mt-auto flex h-[2.5rem] items-center justify-center">
          <IconButton icon={<EditIcon color="neutral.800" boxSize={4} />} onClick={() => setIsEditing(true)} />
        </Box>
      )}
    </Flex>
  );
};

const PolygonBulkEditDrawer: FC<PolygonBulkEditDrawerProps> = ({ open, onOpenChange }) => {
  const t = useT();

  return (
    <Drawer placement="start" defaultOpen={false} open={open} onOpenChange={onOpenChange} size="md">
      {({ onClose }) => (
        <FilterPanel
          title={t("Edit Details")}
          variant="fixed"
          onClose={onClose}
          className="h-screen w-full"
          content={
            <Flex className="flex-1 flex-col gap-4">
              <EditWrapper>
                <DatePickerInput label={t("Plant Start Date")} className="w-[13.5rem]" />
              </EditWrapper>
              <EditWrapper>
                <SelectInput items={mockedOptions} label={t("Restoration Practice")} placeholder="Multiple" />
              </EditWrapper>
              <EditWrapper>
                <SelectInput items={mockedOptions} label={t("Target Land Use")} placeholder="Multiple" />
              </EditWrapper>
              <EditWrapper>
                <SelectInput items={mockedOptions} label={t("Tree Distribution")} placeholder="Multiple" />
              </EditWrapper>
              <EditWrapper>
                <TextInput width="12.75rem" label={t("Trees Planted")} />
              </EditWrapper>
            </Flex>
          }
          footer={
            <ButtonGroup
              buttons={[
                {
                  children: t("Cancel"),
                  variant: "secondary",
                  onClick: onClose
                },
                {
                  children: t("Save"),
                  variant: "primary",
                  onClick: onClose
                }
              ]}
            />
          }
        />
      )}
    </Drawer>
  );
};

export default PolygonBulkEditDrawer;
