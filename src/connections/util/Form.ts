import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook } from "@/connections/util/connectionShortcuts";
import { optionLabelsIndex } from "@/generated/v3/entityService/entityServiceComponents";
import { OptionLabelDto } from "@/generated/v3/entityService/entityServiceSchemas";

export const useOptionLabels = connectionHook(
  v3Resource("optionLabels", optionLabelsIndex).multipleResources<OptionLabelDto>().buildConnection()
);
