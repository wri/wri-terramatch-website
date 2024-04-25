import { MutableRefObject, ReactNode } from "react";

export interface MenuItemProps {
  render: () => ReactNode;
  MenuItemVariant?: string;
  onClick?: () => void;
  ref?: MutableRefObject<HTMLDivElement | null>;
}
export const MenuItem = (props: MenuItemProps) => {
  const { MenuItemVariant, onClick, render } = props;
  return (
    <button onClick={onClick} className={MenuItemVariant}>
      {render()}
    </button>
  );
};
