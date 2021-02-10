import { parseTeamMembers } from './pitch';

export const parseOfferDraft = (draft) => {
  let model = draft.data.offer;

  let childModels = {
    offer_contacts: parseTeamMembers(draft.data.offer_contacts)
  };

  return { model, childModels }
};
