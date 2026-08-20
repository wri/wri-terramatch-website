import StatusTag from "@/components/elements/StatusTag/StatusTag";

interface StatusTableCellProps {
  status?: string | null;
  size?: "small" | "default";
}

export const StatusTableCell = ({ status, size = "small" }: StatusTableCellProps) => {
  if (status == null || status === "") return null;

  return <StatusTag status={status} size={size} />;
};
