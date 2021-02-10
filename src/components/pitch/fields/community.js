import FORM_TYPES from "../../formInput/FormInputTypes";
import { numberOnlyKeyDown } from '../../../helpers';
export default [
  {
    modelKey: "local_community_involvement",
    label: "createPitch.details.localCommunityInvolvement",
    type: FORM_TYPES.checkbox,
    required: false
  },
  {
    modelKey: "training_type",
    label: "createPitch.details.trainingType",
    type: FORM_TYPES.textarea,
    required: false
  },
  {
    modelKey: "training_amount_people",
    label: "createPitch.details.trainingAmountPeople",
    type: FORM_TYPES.number,
    required: false,
    min: "0",
    onKeyDown: numberOnlyKeyDown
  },
  {
    modelKey: "people_working_in",
    label: "createPitch.details.peopleWorkingIn",
    type: FORM_TYPES.textarea,
    required: true
  },
  {
    modelKey: "people_amount_nearby",
    label: "createPitch.details.peopleAmountNearby",
    type: FORM_TYPES.number,
    required: true,
    min: "0",
    onKeyDown: numberOnlyKeyDown
  },
  {
    modelKey: "people_amount_abroad",
    label: "createPitch.details.peopleAmountAbroad",
    type: FORM_TYPES.number,
    required: true,
    min: "0",
    onKeyDown: numberOnlyKeyDown
  },
  {
    modelKey: "people_amount_employees",
    label: "createPitch.details.peopleAmountEmployees",
    type: FORM_TYPES.number,
    required: true,
    min: "0",
    onKeyDown: numberOnlyKeyDown
  },
  {
    modelKey: "people_amount_volunteers",
    label: "createPitch.details.peopleAmountVolunteers",
    type: FORM_TYPES.number,
    required: true,
    min: "0",
    onKeyDown: numberOnlyKeyDown
  },
  {
    modelKey: "benefited_people",
    label: "createPitch.details.benefitedPeople",
    type: FORM_TYPES.number,
    required: true,
    min: "0",
    onKeyDown: numberOnlyKeyDown
  }
];
