import { FieldInputType, FormFieldFactory } from "@/components/extensive/WizardForm/types";

import { BooleanField } from "./boolean.field";
import { ConditionalField } from "./conditional.field";
import { DateField } from "./date.field";
import { DemographicField } from "./demographic.field";
import { DisturbancesField } from "./disturbances.field";
import { EmptyField } from "./empty.field";
import { FileField } from "./file.field";
import { FinancialIndicatorsField } from "./financial-indicators.field";
import { FundingTypeField } from "./funding-type.field";
import { InvasiveField } from "./invasive.field";
import { LeadershipsField } from "./leaderships.field";
import { LongTextField } from "./long-text.field";
import { MapInputField } from "./map-input.field";
import { NumberField } from "./number.field";
import { NumberPercentageField } from "./number-percentage.field";
import { OwnershipStakeField } from "./ownership-stake.field";
import { RadioField } from "./radio.field";
import { SeedingsField } from "./seedings.field";
import { SelectField } from "./select.field";
import { SelectImageField } from "./select-image.field";
import { StratasField } from "./stratas.field";
import { StrategyAreaField } from "./strategy-area.field";
import { TableInputField } from "./table-input.field";
import { TelephoneField } from "./telephone.field";
import { TextField } from "./text.field";
import { TreeSpeciesField } from "./tree-species.field";
import { UrlField } from "./url.field";

export const FormFieldFactories: Record<FieldInputType, FormFieldFactory> = {
  conditional: ConditionalField,
  boolean: BooleanField,
  text: TextField,
  date: DateField,
  "long-text": LongTextField,
  number: NumberField,
  "number-percentage": NumberPercentageField,
  url: UrlField,
  tel: TelephoneField,
  leaderships: LeadershipsField,
  ownershipStake: OwnershipStakeField,
  stratas: StratasField,
  disturbances: DisturbancesField,
  invasive: InvasiveField,
  seedings: SeedingsField,
  fundingType: FundingTypeField,
  radio: RadioField,
  select: SelectField,
  "select-image": SelectImageField,
  file: FileField,
  treeSpecies: TreeSpeciesField,
  tableInput: TableInputField,
  mapInput: MapInputField,
  "strategy-area": StrategyAreaField,
  financialIndicators: FinancialIndicatorsField,

  workdays: DemographicField,
  restorationPartners: DemographicField,
  jobs: DemographicField,
  employees: DemographicField,
  volunteers: DemographicField,
  allBeneficiaries: DemographicField,
  trainingBeneficiaries: DemographicField,
  indirectBeneficiaries: DemographicField,
  associates: DemographicField,

  empty: EmptyField
};
