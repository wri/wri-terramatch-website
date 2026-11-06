import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, ReactNode, useCallback, useMemo } from "react";

import ModalDelete, { type ModalDeleteProps } from "@/redesignComponents/containers/Modal/ModalDelete";
import { LABEL_COLUMN_KEY } from "@/redesignComponents/containers/Modal/ModalSelection";

import type { PolygonTableRow } from "../PolygonTableRow";

const MAX_LISTED_POLYGONS = 10;
const COLLAPSED_POLYGON_COUNT = 3;

export interface DeletePolygonProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  polygons: PolygonTableRow[];
  onDelete?: () => void | Promise<void>;
  modal?: boolean;
  restoreFocus?: boolean;
  view?: "list" | "table";
  width?: ModalDeleteProps["width"];
  footnote?: ReactNode;
}

const DeletePolygon: FC<DeletePolygonProps> = ({
  open,
  onOpenChange,
  polygons,
  onDelete,
  modal = true,
  restoreFocus = true,
  view = "list",
  width,
  footnote
}) => {
  const t = useT();

  const handleDelete = useCallback(() => {
    void onDelete?.();
    onOpenChange(false);
  }, [onDelete, onOpenChange]);

  const visiblePolygons = useMemo(
    () => (polygons.length > MAX_LISTED_POLYGONS ? polygons.slice(0, COLLAPSED_POLYGON_COUNT) : polygons),
    [polygons]
  );
  const hiddenPolygonCount = polygons.length - visiblePolygons.length;

  const items = useMemo(
    () =>
      visiblePolygons.map(({ id, polygonName, entity }) => ({
        id,
        label: polygonName,
        cells: { siteName: entity?.siteName ?? null, projectName: entity?.projectName ?? null }
      })),
    [visiblePolygons]
  );

  const columns = useMemo(
    () => [
      { key: LABEL_COLUMN_KEY, label: t("Polygon Name") },
      { key: "siteName", label: t("Site") },
      { key: "projectName", label: t("Project") }
    ],
    [t]
  );

  const singleSiteName = view === "table" && polygons.length === 1 ? polygons[0].entity?.siteName : undefined;

  return (
    <ModalDelete
      modal={modal}
      restoreFocus={restoreFocus}
      open={open}
      onOpenChange={onOpenChange}
      items={items}
      view={view}
      columns={columns}
      width={width}
      singular={{
        title: t("Delete polygon?"),
        description:
          singleSiteName != null
            ? t("will be permanently removed from {siteName}.", { siteName: singleSiteName })
            : t("will be permanently removed from this site.")
      }}
      plural={{
        title: t("Delete polygons?"),
        description: t("The following polygons will be permanently removed.")
      }}
      footnote={
        hiddenPolygonCount > 0 || footnote != null ? (
          <Flex className="mt-3 flex-col gap-3">
            {hiddenPolygonCount > 0 && (
              <Text textStyle="300" color="neutral.800">
                {t("and {count} more polygons", { count: hiddenPolygonCount.toLocaleString() })}
              </Text>
            )}
            {footnote}
          </Flex>
        ) : undefined
      }
      onConfirm={handleDelete}
    />
  );
};

export default DeletePolygon;
