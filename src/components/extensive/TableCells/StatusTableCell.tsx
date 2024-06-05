import StatusPill from "@/components/elements/StatusPill/StatusPill";
import Text from "@/components/elements/Text/Text";
import { Status } from "@/types/common";

interface StatusTableCellProps {
  statusProps: { status: Status; statusText: string };
}

export const StatusTableCell = ({ statusProps }: StatusTableCellProps) => {
  if (!statusProps) return null;

  return (
    <StatusPill status={statusProps.status!} className="w-fit">
      <Text variant="text-12-semibold">{statusProps.statusText}</Text>
    </StatusPill>
  );
};
