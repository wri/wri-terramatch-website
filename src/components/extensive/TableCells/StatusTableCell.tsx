import StatusTag, { StatusTagProps } from "@/components/elements/StatusTag/StatusTag";

interface StatusTableCellProps {
  status?: string | null;
  size?: "small" | "default";
  variant?: StatusTagProps["variant"];
}

export const StatusTableCell = ({ status, size = "small", variant }: StatusTableCellProps) => {
  if (status == null || status === "") return null;

  return <StatusTag status={status} size={size} variant={variant} />;
};
