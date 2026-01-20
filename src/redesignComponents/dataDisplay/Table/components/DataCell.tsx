import { IconNames } from "@/components/extensive/Icon/Icon";
import { Jobs, Tree } from "@/redesignComponents/foundations/Icons";

interface DataCellProps {
  value: string;
  icon?: "tree" | "jobs" | IconNames;
}

export const DataCell = ({ value, icon }: DataCellProps) => {
  return (
    <div className="flex items-center gap-2  px-2 py-1.5">
      {icon && icon === "tree" && (
        <div className="flex items-center justify-center rounded-full bg-theme-secondary-300 p-1">
          <Tree className="h-4 w-4 text-theme-secondary-800" />
        </div>
      )}
      {icon && icon === "jobs" && (
        <div className="flex items-center justify-center rounded-full bg-theme-primary-300 p-1">
          <Jobs className="h-4 w-4 text-theme-primary-800" />
        </div>
      )}
      <span className="text-theme-neutral-800">{value}</span>
    </div>
  );
};
