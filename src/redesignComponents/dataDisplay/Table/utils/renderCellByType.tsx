import { ButtonsCell, DataCell, LinkCell, MiscellaneousCell, ProfileCell, TextCell } from "../components";
import { CellType, ColumnOption } from "../Table";

export const renderCellByType = (
  cellType: CellType | undefined,
  cellValue: any,
  row: any,
  index: number,
  column: ColumnOption
): React.ReactNode => {
  const options = column.cellOptions || {};

  switch (cellType) {
    case "buttons":
      return (
        <ButtonsCell
          labels={options.buttonLabels || ["Label"]}
          onButtonClick={options.onButtonClick}
          row={row}
          index={index}
        />
      );

    case "data":
      // Support multiple data items with icons
      if (Array.isArray(cellValue)) {
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {cellValue.map((item: any, idx: number) => (
              <DataCell key={idx} value={item.value || "XXXXX"} icon={item.icon || options.dataIcon} />
            ))}
          </div>
        );
      }
      return <DataCell value={cellValue || "XXXXX"} icon={options.dataIcon} />;

    case "link":
      return (
        <LinkCell
          value={cellValue || "-"}
          href={options.linkHref ? options.linkHref(cellValue, row) : undefined}
          truncate={options.truncate !== false}
          widthLinkCell={options.widthLinkCell}
        />
      );

    case "profile":
      return (
        <ProfileCell
          value={cellValue || "-"}
          profileImage={options.profileImage ? options.profileImage(cellValue, row) : undefined}
        />
      );

    case "miscellaneous":
      return <MiscellaneousCell title={options.title} description={options.description} />;

    case "text":
      return <TextCell value={cellValue || "Label"} />;

    default:
      return cellValue;
  }
};
