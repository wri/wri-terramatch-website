import { ReactNode } from "react";
import { AutocompleteInput } from "react-admin";

import Text from "@/components/elements/Text/Text";

export interface StyledReferenceInputProps {
  label: string;
  children: ReactNode;
}

export const StyledAutocompleteInput = (props: any) => (
  <AutocompleteInput
    {...props}
    className="text-14-light"
    sx={{
      "& .MuiInputBase-root": {
        backgroundColor: "white",
        borderRadius: "0.375rem",
        border: "1px solid #E3E3E3",
        padding: "0.5rem 1rem",
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
        "&:hover": {
          borderColor: "#D1D5DB"
        },
        "&.Mui-focused": {
          borderColor: "#3B82F6",
          boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)"
        }
      },
      "& .MuiInputLabel-root": {
        fontSize: "0.875rem",
        fontWeight: "bold",
        color: "#111827",
        textTransform: "capitalize"
      },
      "& .MuiAutocomplete-endAdornment": {
        right: "0.5rem"
      }
    }}
  />
);

export const StyledReferenceInput: React.FC<StyledReferenceInputProps> = ({ label, children }) => (
  <div className="flex w-1/2 flex-col gap-y-1 pr-2">
    <Text variant="text-14-bold" className="capitalize">
      {label}
    </Text>
    {children}
  </div>
);
