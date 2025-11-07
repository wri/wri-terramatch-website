import { Dictionary, isObject, isString } from "lodash";
import { Fragment } from "react";

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

const List = <T, U>({
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
      {startListElement ? <ItemComponent>{startListElement}</ItemComponent> : null}
      {items.map((item, i, array) => {
        const key = isString(item)
          ? `${item}-${i}`
          : isObject(item) && uniqueId != null
          ? `${(item as Dictionary<any>)[uniqueId]}-${i}`
          : i;
        return (
          <Fragment key={key}>
            <ItemComponent {...listItemComponentClassnames}>{render(item, i, array)}</ItemComponent>
            {i === items.length - 1 ? null : dividerComponent}
          </Fragment>
        );
      })}
      {endListElement != null ? <ItemComponent>{endListElement}</ItemComponent> : null}
    </ListComponent>
  );
};

export default List;
