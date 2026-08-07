import { FC } from "react";

import AutocompleteHighLevelSelector from "./AutocompleteHighLevelSelector";
import { HighLevelSelectorProps } from "./HighLevelSelector.types";
import StandardHighLevelSelector from "./StandardHighLevelSelector";

const HighLevelSelector: FC<HighLevelSelectorProps> = ({ autocomplete = false, ...props }) =>
  autocomplete ? <AutocompleteHighLevelSelector {...props} /> : <StandardHighLevelSelector {...props} />;

export default HighLevelSelector;
