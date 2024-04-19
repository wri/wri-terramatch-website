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
    <div onClick={onClick} className={MenuItemVariant}>
      {render()}
    </div>
  );
};
