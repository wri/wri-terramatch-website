import { previewKeyFromLabel } from "./mappers";
import { LocalAttribute } from "./types";

export const validateAttributes = (attributes: LocalAttribute[]): string | null => {
  const invalid = attributes.find(
    attribute => attribute.label.trim() === "" || attribute.options.some(option => option.label.trim() === "")
  );
  if (invalid != null) {
    return "Please fill in all attribute labels and option labels before saving.";
  }

  const emptyOptions = attributes.find(attribute => attribute.options.length === 0);
  if (emptyOptions != null) {
    return "Every attribute must have at least one option.";
  }

  const usedKeys = new Set<string>();
  for (const attribute of attributes) {
    const key = attribute.key ?? previewKeyFromLabel(attribute.label);
    if (key === "Generated from label") {
      return "Please fill in all attribute labels and option labels before saving.";
    }
    if (usedKeys.has(key)) {
      return `Attribute key "${key}" must be unique within a framework.`;
    }
    usedKeys.add(key);
  }

  return null;
};
