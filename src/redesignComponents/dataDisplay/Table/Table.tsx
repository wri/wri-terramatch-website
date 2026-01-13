import { Table as TableComponent } from "@worldresources/wri-design-systems";
import React, { useState } from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

export type CellType =
  | "checkbox"
  | "checkbox-header"
  | "buttons"
  | "data"
  | "header"
  | "link"
  | "miscellaneous"
  | "profile"
  | "text";

export interface ColumnOption {
  key: string;
  label: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  cellClassName?: string;
  cellStyle?: React.CSSProperties;
  renderCell?: (value: any, row: any, index: number) => React.ReactNode;
  width?: string | number;
  sticky?: boolean;
  cellType?: CellType;
  // Cell type specific options
  cellOptions?: {
    // For buttons
    buttonLabels?: string[];
    onButtonClick?: (buttonIndex: number, row: any, index: number) => void;
    // For data
    dataIcon?: "tree" | "profile" | IconNames;
    // For link
    linkHref?: (value: any, row: any) => string;
    truncate?: boolean;
    // For profile
    profileImage?: (value: any, row: any) => string | React.ReactNode;
    // For miscellaneous
    placeholder?: string;
    // For checkbox
    checked?: (row: any, index: number) => boolean;
    onCheckChange?: (checked: boolean, row: any, index: number) => void;
  };
}

interface TableProps {
  columns: ColumnOption[];
  data: any[];
}

// Cell Type Components
const CheckboxCell = ({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={e => {
        onChange(e.target.checked);
      }}
      style={{
        width: "16px",
        height: "16px",
        cursor: "pointer"
      }}
    />
  );
};

const ButtonsCell = ({
  labels,
  onButtonClick,
  row,
  index
}: {
  labels: string[];
  onButtonClick?: (buttonIndex: number, row: any, index: number) => void;
  row: any;
  index: number;
}) => {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      {labels.map((label, buttonIndex) => (
        <button
          key={buttonIndex}
          onClick={() => onButtonClick?.(buttonIndex, row, index)}
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            border: "1px solid #e5e7eb",
            backgroundColor: "#f9fafb",
            color: "#374151",
            fontSize: "14px",
            cursor: "pointer",
            transition: "background-color 0.2s"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = "#f3f4f6";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = "#f9fafb";
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

const DataCell = ({ value, icon }: { value: string; icon?: "tree" | "profile" | IconNames }) => {
  const [isHovered, setIsHovered] = useState(false);
  const getIconName = (): IconNames => {
    if (icon === "tree") return IconNames.TREE;
    if (icon === "profile") return IconNames.PROFILE;
    if (typeof icon === "string") return icon as IconNames;
    return IconNames.TREE;
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "4px 8px",
        borderRadius: "4px",
        backgroundColor: isHovered ? "#f3f4f6" : "transparent",
        transition: "background-color 0.2s"
      }}
    >
      {icon && (
        <Icon
          name={getIconName()}
          width={16}
          height={16}
          style={{
            color: icon === "tree" ? (isHovered ? "#059669" : "#10b981") : isHovered ? "#4b5563" : "#6b7280"
          }}
        />
      )}
      <span style={{ color: isHovered ? "#111827" : "#374151", fontWeight: isHovered ? 500 : 400 }}>{value}</span>
    </div>
  );
};

const LinkCell = ({ value, href, truncate }: { value: string; href?: string; truncate?: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: "4px 8px",
        borderRadius: "4px",
        backgroundColor: isHovered ? "#f3f4f6" : "transparent",
        transition: "background-color 0.2s"
      }}
    >
      <a
        href={href || "#"}
        style={{
          color: "#374151",
          textDecoration: isHovered ? "underline" : "none",
          textDecorationStyle: isHovered ? "solid" : "dotted",
          textDecorationColor: "#9ca3af",
          overflow: truncate ? "hidden" : "visible",
          textOverflow: truncate ? "ellipsis" : "clip",
          whiteSpace: truncate ? "nowrap" : "normal",
          display: "block",
          maxWidth: truncate ? "200px" : "none"
        }}
      >
        {value}
      </a>
    </div>
  );
};

const ProfileCell = ({ value, profileImage }: { value: string; profileImage?: string | React.ReactNode }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: "4px 8px",
        borderRadius: "4px",
        backgroundColor: isHovered ? "#f3f4f6" : "transparent",
        transition: "background-color 0.2s",
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          border: "1px solid #e5e7eb",
          backgroundColor: "#f9fafb",
          color: "#374151",
          fontSize: "12px"
        }}
      >
        {profileImage ? (
          typeof profileImage === "string" ? (
            <img src={profileImage} alt={value} style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
          ) : (
            profileImage
          )
        ) : (
          value
        )}
      </div>
      <span style={{ color: "#374151" }}>{value}</span>
    </div>
  );
};

const MiscellaneousCell = ({ placeholder }: { placeholder?: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        border: "1px dashed #d1d5db",
        borderRadius: "4px",
        padding: "8px",
        backgroundColor: isHovered ? "#f3f4f6" : "#f9fafb",
        color: "#374151",
        fontSize: "14px",
        minHeight: "40px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        transition: "background-color 0.2s"
      }}
    >
      <span>{placeholder || "Slot one"}</span>
      <span style={{ fontSize: "12px" }}>Add button or input</span>
    </div>
  );
};

const HeaderCell = ({ value }: { value: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        padding: "4px 8px",
        borderRadius: "4px",
        backgroundColor: isHovered ? "#f3f4f6" : "transparent",
        transition: "background-color 0.2s",
        position: "relative",
        borderBottom: isHovered ? "1px solid #d1d5db" : "none"
      }}
    >
      <span style={{ color: "#374151" }}>{value || "Label"}</span>
      <Icon name={IconNames.SORT_UP} width={12} height={12} style={{ color: "#9ca3af" }} />
    </div>
  );
};

const TextCell = ({ value }: { value: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: "4px 8px",
        borderRadius: "4px",
        backgroundColor: isHovered ? "#f3f4f6" : "#f9fafb",
        color: "#374151",
        transition: "background-color 0.2s"
      }}
    >
      {value || "Label"}
    </div>
  );
};

const renderCellByType = (
  cellType: CellType | undefined,
  cellValue: any,
  row: any,
  index: number,
  column: ColumnOption
): React.ReactNode => {
  const options = column.cellOptions || {};

  switch (cellType) {
    case "checkbox":
      return (
        <CheckboxCell
          checked={options.checked ? options.checked(row, index) : false}
          onChange={checked => {
            options.onCheckChange?.(checked, row, index);
          }}
        />
      );

    case "checkbox-header":
      return (
        <CheckboxCell
          checked={options.checked ? options.checked(row, index) : false}
          onChange={checked => {
            options.onCheckChange?.(checked, row, index);
          }}
        />
      );

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

    case "header":
      return <HeaderCell value={cellValue || "Label"} />;

    case "link":
      return (
        <LinkCell
          value={cellValue || "Label should truncate ..."}
          href={options.linkHref ? options.linkHref(cellValue, row) : undefined}
          truncate={options.truncate !== false}
        />
      );

    case "profile":
      return (
        <ProfileCell
          value={cellValue || "Label"}
          profileImage={options.profileImage ? options.profileImage(cellValue, row) : undefined}
        />
      );

    case "miscellaneous":
      return <MiscellaneousCell placeholder={options.placeholder} />;

    case "text":
      return <TextCell value={cellValue || "Label"} />;

    default:
      return cellValue;
  }
};

const Table = ({ columns, data }: TableProps) => {
  return (
    <div
      style={{
        width: "900px"
      }}
    >
      <TableComponent
        columns={columns}
        data={data}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        onSortColumn={() => {}}
        pagination={{
          currentPage: 1,
          pageSize: 10,
          showItemCount: true,
          totalItems: data.length
        }}
        renderRow={(row: any, index: number) => {
          return (
            <tr key={index}>
              {columns.map((column: ColumnOption) => {
                const cellValue = row[column.key];
                let cellContent: React.ReactNode;

                if (column.renderCell) {
                  cellContent = column.renderCell(cellValue, row, index);
                } else if (column.cellType) {
                  cellContent = renderCellByType(column.cellType, cellValue, row, index, column);
                } else {
                  cellContent = cellValue;
                }

                return (
                  <td
                    key={column.key}
                    align={column.align || "left"}
                    className={column.cellClassName}
                    style={{
                      ...column.cellStyle,
                      ...(column.sticky && { position: "sticky", zIndex: 1 }),
                      ...(column.width && { width: column.width }),
                      padding: "8px"
                    }}
                  >
                    {cellContent}
                  </td>
                );
              })}
            </tr>
          );
        }}
      />
    </div>
  );
};

export default Table;
