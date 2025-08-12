import { DemographicDto } from "@/generated/v3/entityService/entityServiceSchemas";

import { BeneficiaryData, EmploymentDemographicData } from "../types";

export const processDemographicData = (demographics: DemographicDto[]): EmploymentDemographicData => {
  const result: EmploymentDemographicData = {
    fullTimeJobs: { total: 0, male: 0, female: 0, youth: 0, nonYouth: 0 },
    partTimeJobs: { total: 0, male: 0, female: 0, youth: 0, nonYouth: 0 },
    volunteers: { total: 0, male: 0, female: 0, youth: 0, nonYouth: 0 }
  };
  demographics.forEach(demographic => {
    if (demographic.type === "jobs" || demographic.type === "volunteers") {
      let targetCategory: keyof EmploymentDemographicData;

      if (demographic.type === "jobs") {
        if (demographic.collection === "full-time") {
          targetCategory = "fullTimeJobs";
        } else if (demographic.collection === "part-time") {
          targetCategory = "partTimeJobs";
        } else {
          return;
        }
      } else {
        targetCategory = "volunteers";
      }

      const genderEntries = demographic.entries.filter(entry => entry.type === "gender");
      const maleEntry = genderEntries.find(entry => entry.subtype === "male");
      const femaleEntry = genderEntries.find(entry => entry.subtype === "female");
      const ageEntries = demographic.entries.filter(entry => entry.type === "age");
      const youthEntry = ageEntries.find(entry => entry.subtype === "youth");
      const nonYouthEntry = ageEntries.find(entry => entry.subtype === "non-youth");

      const genderTotal = genderEntries.reduce((sum, entry) => sum + entry.amount, 0);

      result[targetCategory].male += maleEntry?.amount ?? 0;
      result[targetCategory].female += femaleEntry?.amount ?? 0;
      result[targetCategory].youth += youthEntry?.amount ?? 0;
      result[targetCategory].total += genderTotal;
      result[targetCategory].nonYouth += nonYouthEntry?.amount ?? 0;
    }
  });

  return result;
};

export const processBeneficiaryData = (demographics: DemographicDto[]): BeneficiaryData => {
  const result: BeneficiaryData = {
    beneficiaries: 0,
    farmers: 0
  };

  const beneficiaryDemographics = demographics.filter(d => d.type === "all-beneficiaries" && d.collection === "all");

  beneficiaryDemographics.forEach(demographic => {
    const genderEntries = demographic.entries.filter(entry => entry.type === "gender");
    result.beneficiaries += genderEntries.reduce((sum, entry) => sum + entry.amount, 0);

    const smallholderEntries = demographic.entries.filter(
      entry => entry.type === "farmer" && entry.subtype === "smallholder"
    );
    result.farmers += smallholderEntries.reduce((sum, entry) => sum + entry.amount, 0);
  });

  return result;
};
