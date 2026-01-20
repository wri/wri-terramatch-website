import { useT } from "@transifex/react";

interface TextCellProps {
  value: string;
}

export const TextCell = ({ value }: TextCellProps) => {
  const t = useT();
  return <p className="text-theme-neutral-800">{t(value || "-")}</p>;
};
