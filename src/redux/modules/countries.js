import { CountriesApi, CountryReadAll } from 'wrm-api';
import apiPromiseWrapper from '../services/apiClientPromiseWrapper';
import { createAsyncAction } from "../conditionalActions";

export const GET_COUNTRIES = 'countries/GET_COUNTRIES';

// Action Creators
export function getCountries() {
  return (dispatch, getState) => {
    const action = createAsyncAction({
      type: GET_COUNTRIES,
      payload: {
        promise: new Promise((resolve, reject) => {
          new apiPromiseWrapper(new CountriesApi(), 'countriesGet').then(
            (resp) => {
              resolve(CountryReadAll.constructFromObject(resp, []));
            }
          ).catch(reject)
        })
      }
    });

    dispatch(action);
    return action.payload.promise;
  };
};
