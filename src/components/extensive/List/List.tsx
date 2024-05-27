import { Fragment } from "react";
import { When } from "react-if";

export type ListProps<T, U> = U & {
  uniqueId?: string;
  items: T[];
  render: (item: T, index: number, array: T[]) => JSX.Element | null;
  loading?: boolean;
  className?: string;
  itemClassName?: string;
  dividerComponent?: React.ReactNode;
  startListElement?: React.ReactNode;
  endListElement?: React.ReactNode;
  as?: React.ElementType;
  itemAs?: React.ElementType;
};

const List = <T extends Record<any, any>, U>({
  uniqueId,
  items,
  render,
  className,
  itemClassName,
  dividerComponent,
  startListElement,
  endListElement,
  as = "ul",
  itemAs = "li"
}: ListProps<T, U>) => {
  const ListComponent = as;
  const ItemComponent = itemAs;

  // If using Fragment as ListComponent then it does not accept className prop and throws annoying warning
  const listComponentClassnames = typeof ListComponent === "symbol" ? {} : { className };
  const listItemComponentClassnames = typeof ItemComponent === "symbol" ? {} : { className: itemClassName };

  return (
    <ListComponent {...listComponentClassnames}>
      {startListElement ? <ItemComponent>{startListElement}</ItemComponent> : <></>}
      {items.map((item, i, array) => (
        <Fragment key={uniqueId ? `${item[uniqueId]}-${i}` : i}>
          <ItemComponent {...listItemComponentClassnames}>{render(item, i, array)}</ItemComponent>
          <When condition={i < items.length - 1}>{dividerComponent}</When>
        </Fragment>
      ))}
      {endListElement ? <ItemComponent>{endListElement}</ItemComponent> : <></>}
    </ListComponent>
  );
};

export default List;
