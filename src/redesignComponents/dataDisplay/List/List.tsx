import { Box } from "@chakra-ui/react";
import { List as WriList } from "@worldresources/wri-design-systems";
import { FC, ReactElement, ReactNode } from "react";

type ListItemVariant = "data" | "navigation" | "select";
interface ListItemProps {
  id?: string;
  label: string;
  caption?: string;
  icon?: ReactElement;
  value?: ReactNode;
  variant?: ListItemVariant;
  isExpanded?: boolean;
  onItemClick?: () => void;
  ariaLabel?: string;
  disabled?: boolean;
  isHighlighted?: boolean;
}
export interface ListProps {
  items: ListItemProps[];
  noBorder?: boolean;
  highlightedIndex?: number;
}

const List: FC<ListProps> = ({ items, noBorder, highlightedIndex }) => {
  return (
    <Box>
      <WriList items={items} noBorder={noBorder} highlightedIndex={highlightedIndex} />
    </Box>
  );
};

export default List;
