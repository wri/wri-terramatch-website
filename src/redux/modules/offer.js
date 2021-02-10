import { createAsyncAction } from "../conditionalActions";
import apiPromiseWrapper, { paginatedApiWrapper } from '../services/apiClientPromiseWrapper';
import { convertReduxFiltersToApiFormat } from '../../helpers';

import {
  OfferCreate,
  OfferUpdate,
  OffersApi,
  OfferContactsApi,
  OfferReadAll
} from 'wrm-api';

export const CREATE_OFFER = 'offers/CREATE_OFFER';
export const CREATE_OFFER_CONTACTS = 'offers/CREATE_OFFER_CONTACTS';
export const GET_OFFER_CONTACTS = 'offers/GET_OFFER_CONTACTS';
export const DELETE_OFFER_CONTACT = 'offers/DELETE_OFFER_CONTACT';
export const PATCH_OFFER = 'offers/PATCH_OFFER';
export const GET_ORGANISATION_OFFERS = 'offers/GET_ORGANISATION_OFFERS';
export const GET_ORGANISATION_OFFERS_INSPECT = 'offers/GET_ORGANISATION_OFFERS_INSPECT';
export const GET_OFFER = 'offers/GET_OFFER';
export const GET_OFFERS = 'offers/GET_OFFERS';
export const ARCHIVE_OFFER = 'offers/ARCHIVE_OFFER';
export const UPDATE_OFFER_VISIBILITY = 'offers/UPDATE_PITCH_VISIBILITY';

// Action Creators
export function createOffer(model) {
  return (dispatch, getState) => {
    const data = OfferCreate.constructFromObject(model);
    data.video = null;
    if (!data.land_country) {
      data.land_country = null;
    }

    if (data.funding_amount === undefined) {
      data.funding_amount = null;
    }

    if (data.sustainable_development_goals === undefined) {
      data.sustainable_development_goals = [];
    }

    const token = getState().auth.login.data.token;

    const action = createAsyncAction({
      type: CREATE_OFFER,
      payload: {
        promise: new apiPromiseWrapper(new OffersApi(), 'offersPost', data, token)
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
};

export function getOrganisationOffers(organisationId) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: GET_ORGANISATION_OFFERS,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(new OffersApi(), 'organisationsIDOffersGet', null, token, organisationId).then(
            (resp) => {
              resolve(resp);
            }
          ).catch(reject)
        })
      }
    });

    dispatch(action);
    return action.payload.promise;
  };
};

export function getOrganisationOffersInspect(organisationId) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: GET_ORGANISATION_OFFERS_INSPECT,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(new OffersApi(), 'organisationsIDOffersInspectGet', null, token, organisationId).then(
            (resp) => {
              resolve(resp);
            }
          ).catch(reject)
        })
      }
    });

    dispatch(action);
    return action.payload.promise;
  };
};

export function createOfferContacts(teamMembers, offerId) {
  return (dispatch, getState) => {
    const promises = [];
    const token = getState().auth.login.data.token;

    teamMembers.forEach(tm => {
      tm.offer_id = offerId;
      promises.push(new apiPromiseWrapper(new OfferContactsApi(), 'offerContactsPost', tm, token))
    });

    const action = createAsyncAction({
      type: CREATE_OFFER_CONTACTS,
      payload: {
        promise: Promise.all(promises)
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
};

export function deleteOfferContact(contactId) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;

    const action = createAsyncAction({
      type: DELETE_OFFER_CONTACT,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(new OfferContactsApi(), 'offerContactsIDDelete', null, token, contactId)
          .then(resp => {
            resolve(resp);
          }).catch(err => {
            reject(err);
          })
        })
      }
    });

    dispatch(action);
    return action.payload.promise;
  }
}

export function getOfferContacts(offerId) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;

    const action = createAsyncAction({
      type: GET_OFFER_CONTACTS,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(new OfferContactsApi(), 'offersIDOfferContactsGet', null, token, offerId)
          .then(resp => {
            resolve(resp);
          }).catch(err => {
            reject(err);
          })
        })
      }
    });

    dispatch(action);

    return action.payload.promise;
  }
}

export function patchOffer(offer, id) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;

    const body = OfferUpdate.constructFromObject(offer);

    // remove media fields
    delete body.cover_photo;
    delete body.video;

    const action = createAsyncAction({
      type: PATCH_OFFER,
      payload: {
        promise: new apiPromiseWrapper(new OffersApi(), 'offersIDPatch', body, token, id)
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
}

export function archiveOffer(id) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: ARCHIVE_OFFER,
      payload: {
        promise: new apiPromiseWrapper(new OffersApi(), 'offersIDCompletePatch', { successful: false }, token, id)
      }
    });

    dispatch(action);
    return action.payload.promise;
  };
}

export function updateOfferVisibility(id, visibility) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: UPDATE_OFFER_VISIBILITY,
      payload: {
        promise: new apiPromiseWrapper(new OffersApi(), 'offersIDVisibilityPatch', { visibility: visibility }, token, id)
      }
    });

    dispatch(action);
    return action.payload.promise;
  }
}

export function getOffer(id) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: GET_OFFER,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(new OffersApi(), 'offersIDGet', null, token, id).then(
            (resp) => {
              resolve(resp);
          }).catch(err => {
            reject(err);
          });
        })
      }
    });

    dispatch(action);

    return action.payload.promise;
  }
};

export function getOffers() {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const filters = getState().filters;
    const sort = getState().sort;
    const { sortDirection, sortAttribute, page } = sort;

    const apiFilters = convertReduxFiltersToApiFormat(filters, true);

    const body = {
      sortAttribute,
      sortDirection,
      page,
      filters: apiFilters
    }

    const action = createAsyncAction({
      type: GET_OFFERS,
      payload: {
        promise: new Promise((resolve, reject) => {
          new paginatedApiWrapper(new OffersApi(), 'offersSearchPost', body, token)
            .then(resp => {
              resolve(OfferReadAll.constructFromObject(resp, []));
            })
            .catch(err => {
              reject(err);
            });
        })
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
}

export function clearGetOrganisationOffers() {
  return {
    type: GET_ORGANISATION_OFFERS + '_clear'
  };
};

export function clearGetOrganisationOffersInspect() {
  return {
    type: GET_ORGANISATION_OFFERS_INSPECT + '_clear'
  };
};

export function clearCreateOffer() {
  return {
    type: CREATE_OFFER + '_clear'
  };
};

export function clearPatchOffer() {
  return {
    type: PATCH_OFFER + '_clear'
  };
};

export function clearGetOffer() {
  return {
    type: GET_OFFER + '_clear'
  };
};

export function clearGetOffers() {
  return {
    type: GET_OFFERS + '_clear'
  };
};

export function clearCreateOfferContacts() {
  return {
    type: CREATE_OFFER_CONTACTS + '_clear'
  };
};

export function clearArchiveOffer() {
  return {
    type: ARCHIVE_OFFER + '_clear'
  };
};

export function clearGetOfferContacts() {
  return {
    type: GET_OFFER_CONTACTS + '_clear'
  };
};

export function clearDeleteOfferContact() {
  return {
    type: DELETE_OFFER_CONTACT + '_clear'
  };
};

export function clearUpdateOfferVisibility() {
  return {
    type: UPDATE_OFFER_VISIBILITY + '_clear'
  };
};