import { green, red } from "@mui/material/colors";
import { Change, diffWords } from "diff";
import { FC, ReactNode, useMemo } from "react";

import ChangeBox from "@/admin/components/ResourceTabs/ChangeRequestsTab/ChangeBox";
import { FieldInputType } from "@/components/extensive/WizardForm/types";

type FinancialVisualDiffProps = {
  currentValue: ReactNode;
  newValue: ReactNode;
  inputType: FieldInputType;
};

const getStyle = (change: Change) => ({
  color: change.added ? green[800] : change.removed ? red[800] : undefined,
  textDecoration: change.removed ? "line-through" : undefined
});

const FinancialVisualDiff: FC<FinancialVisualDiffProps> = ({ currentValue, newValue, inputType }) => {
  const { oldView, newView } = useMemo(() => {
    if (typeof currentValue !== "string" || typeof newValue !== "string") {
      return { oldView: currentValue, newView: newValue };
    }

    const normalizedCurrentValue = (currentValue ?? "").trim() === "-" ? "" : currentValue ?? "";
    const normalizedNewValue = (newValue ?? "").trim() === "-" ? "" : newValue ?? "";

    const diff = diffWords(normalizedCurrentValue, normalizedNewValue);

    const oldView = diff
      .filter(change => !change.added)
      .map((change, index) => {
        const style = getStyle(change);
        return `<span style="color: ${style.color || "inherit"}; text-decoration: ${style.textDecoration || "none"};">${
          change.value
        }</span>`;
      })
      .join("");

    const newView = diff
      .filter(change => !change.removed)
      .map((change, index) => {
        const style = getStyle(change);
        return `<span style="color: ${style.color || "inherit"}; text-decoration: ${style.textDecoration || "none"};">${
          change.value
        }</span>`;
      })
      .join("");

    return { oldView, newView };
  }, [currentValue, newValue]);

  return <ChangeBox oldView={oldView} newView={newView} inputType={inputType} />;
};

export default FinancialVisualDiff;
