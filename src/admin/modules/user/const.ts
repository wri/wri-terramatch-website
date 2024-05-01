import { getCountriesOptions } from "@/constants/options/countries";

export const userTypesChoices = [
  { name: "Admin", id: "admin" },
  { name: "User", id: "user" },
  { name: "Project Developer", id: "project_developer" },
  { name: "Government", id: "government" },
  { name: "Funder", id: "funder" }
];

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
    id: "admin-super",
    name: "Super Admin"
  },
  {
    id: "project_developer",
    name: "Project Developer"
  },
  {
    id: "government",
    name: "Government Official"
  },
  {
    id: "funder",
    name: "Funder/Investor"
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
