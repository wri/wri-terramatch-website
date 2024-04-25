import { MutableRefObject } from "react";
export interface MenuItemProps {
  render: string;
  MenuItemVariant?: string;
  onClick?: () => void;
  ref?: MutableRefObject<HTMLDivElement | null>;
}
export const MenuItem = (props: MenuItemProps) => {
  const { MenuItemVariant, onClick, render } = props;
  return (
    <button onClick={onClick} className={MenuItemVariant}>
      {render}
    </button>
  );
};
