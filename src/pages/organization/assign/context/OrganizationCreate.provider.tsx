import { yupResolver } from "@hookform/resolvers/yup";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import * as yup from "yup";

import { V2GenericList } from "@/generated/apiSchemas";

const OrganizationCreateFormDataSchema = yup.object({
  name: yup.string().required()
});

export type OrganizationCreateFormData = yup.InferType<typeof OrganizationCreateFormDataSchema>;

export type OrganizationCreateType = "join" | "create";

interface IOrganizationCreateContext {
  type: OrganizationCreateType | null;
  setType: Dispatch<SetStateAction<OrganizationCreateType | null>>;
  selectedOrganization?: V2GenericList;
  setSelectedOrganization: Dispatch<SetStateAction<V2GenericList | undefined>>;
  form: UseFormReturn<OrganizationCreateFormData>;
}

/* eslint-disable */
export const OrganizationCreateContext = createContext<IOrganizationCreateContext>({
  type: null,
  setType: () => {},
  selectedOrganization: undefined,
  setSelectedOrganization: () => {},
  form: {} as any
});

type OrganizationAssignProviderProps = { children: React.ReactNode };
const OrganizationAssignProvider = ({ children }: OrganizationAssignProviderProps) => {
  const [type, setType] = useState<OrganizationCreateType | null>(null);
  const [selectedOrganization, setSelectedOrganization] = useState<V2GenericList>();

  const form = useForm<OrganizationCreateFormData>({
    resolver: yupResolver(OrganizationCreateFormDataSchema)
  });

  const searchedTerm = form.watch("name");

  useEffect(() => {
    if (type) {
      setSelectedOrganization(undefined);
      setType(null);
    }
  }, [searchedTerm]);

  useEffect(() => {
    if (selectedOrganization) setType("join");
  }, [selectedOrganization]);

  return (
    <OrganizationCreateContext.Provider
      value={{
        type,
        setType,
        selectedOrganization,
        setSelectedOrganization,
        form
      }}
    >
      {children}
    </OrganizationCreateContext.Provider>
  );
};

export const useOrganizationCreateContext = () => useContext(OrganizationCreateContext);

export default OrganizationAssignProvider;
