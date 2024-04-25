import { getCountriesOptions } from "@/constants/options/countries";

export const userTypesChoices = [
  { name: "Admin", id: "admin" },
  { name: "User", id: "user" }
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
    id: "project-developer",
    name: "Project Developer"
  }
];

export const countriesChoices = getCountriesOptions().map(item => ({
  id: item.value,
  name: item.title
}));

export const frameworkChoices = [
  {
    id: "1",
    name: "PPC"
  },
  {
    id: "2",
    name: "TerraFund"
  }
];
