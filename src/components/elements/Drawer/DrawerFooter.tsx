import Button from "../Button/Button";
interface DrawerFooterPolygonProps {
  onDelete: () => void;
  onCreate: () => void;
}
export const DrawerFooterPolygon = (props: DrawerFooterPolygonProps) => {
  const { onDelete, onCreate } = props;
  return (
    <div className="mt-auto flex items-center justify-end gap-5">
      <Button variant="semiRed" onClick={onDelete}>
        Delete
      </Button>
      <Button variant="semiBlack" onClick={onCreate}>
        Create
      </Button>
    </div>
  );
};
