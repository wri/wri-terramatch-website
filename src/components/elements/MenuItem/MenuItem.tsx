import { MutableRefObject, ReactNode } from "react";

export interface MenuItemProps {
  render: () => ReactNode;
  MenuItemVariant?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  ref?: MutableRefObject<HTMLDivElement | null>;
}
export const MenuItem = (props: MenuItemProps) => {
  const { MenuItemVariant, onClick, render } = props;
  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-2 rounded-lg p-2 leading-normal  ${MenuItemVariant} `}
    >
      {render()}
    </div>
  );
};
