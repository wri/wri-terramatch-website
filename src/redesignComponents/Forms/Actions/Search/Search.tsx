import { Search as WriSearch } from "@worldresources/wri-design-systems";
import type { ComponentProps } from "react";
import { FC } from "react";

const Search: FC<ComponentProps<typeof WriSearch>> = props => <WriSearch {...props} />;

export default Search;
