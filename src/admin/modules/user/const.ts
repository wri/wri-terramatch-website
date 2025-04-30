import { Framework } from "@/context/framework.provider";

export const frameworkAdminPrimaryRoleChoices = [
  {
    id: "project-developer",
    name: "Project Developer"
  },
  {
    id: "project-manager",
    name: "Project Manager"
  }
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
    id: "admin-hbf",
    name: "HBF Admin"
  },
  {
    id: "admin-epa-ghana-pilot",
    name: "EPA Ghana Pilot Admin"
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

export const directFrameworkChoices = Object.values(Framework)
  .filter(slug => slug !== "undefined")
  .map(slug => ({ id: slug, name: slug }));
