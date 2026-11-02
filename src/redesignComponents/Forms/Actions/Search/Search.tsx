import { Box } from "@chakra-ui/react";
import { Search as WriSearch } from "@worldresources/wri-design-systems";
import type { ComponentProps } from "react";
import { FC } from "react";

const TRUNCATE_PLACEHOLDER_CSS = {
  "& input:placeholder-shown, & input::placeholder": {
    overflow: "hidden !important",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }
};

const Search: FC<ComponentProps<typeof WriSearch>> = props => (
  <Box css={TRUNCATE_PLACEHOLDER_CSS}>
    <WriSearch {...props} />
  </Box>
);

export default Search;
