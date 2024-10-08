import { getCountriesOptions } from "@/constants/options/countries";

export const userPrimaryRoleChoices = [
  {
    id: "admin-ppc",
    name: "PPC Admin"
  },
  {
    id: "admin-terrafund",
    name: "TerraFund Admin"
  },
  {
    id: "admin-hbf",
    name: "HBF Admin"
  },
  {
    id: "admin-super",
    name: "Super Admin"
  },
  {
    id: "project-developer",
    name: "Project Developer"
  },
  {
    id: "project-manager",
    name: "Project Manager"
  },
  {
    id: "funder",
    name: "Funder"
  },
  {
    id: "government",
    name: "Government"
  }
];

export const countriesChoices = getCountriesOptions().map(item => ({
  id: item.value,
  name: item.title
}));

export const frameworkChoices = [
  {
    id: "ppc",
    name: "PPC"
  },
  {
    id: "terrafund",
    name: "TerraFund"
  }
];
