import { ColumnDef } from "@tanstack/react-table";

export const ColumnsTableFinancialMetrics: ColumnDef<any>[] = [
  {
    id: "financialMetrics",
    accessorKey: "financialMetrics",
    header: "Financial Metrics",
    enableSorting: false,
    meta: {
      width: "12.75rem",
      sticky: true,
      align: "left",
      style: {
        width: "11.75rem",
        minWidth: "11.75rem",
        maxWidth: "11.75rem",
        position: "sticky",
        left: "0",
        zIndex: "10"
      }
    }
  },
  {
    id: "2020",
    accessorKey: "2020",
    header: "2020",
    enableSorting: false,
    meta: {
      width: "6.75rem"
    }
  },
  {
    id: "2021",
    accessorKey: "2021",
    header: "2021",
    enableSorting: false
  },
  {
    id: "2022",
    accessorKey: "2022",
    header: "2022",
    enableSorting: false
  },
  {
    id: "2023",
    accessorKey: "2023",
    header: "2023",
    enableSorting: false
  },
  {
    id: "2024",
    accessorKey: "2024",
    header: "2024",
    enableSorting: false
  },
  {
    id: "2025",
    accessorKey: "2025",
    header: "2025",
    enableSorting: false
  },
  {
    id: "2026",
    accessorKey: "2026",
    header: "2026",
    enableSorting: false
  }
];
