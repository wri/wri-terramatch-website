import { createAsyncAction } from "../conditionalActions";
import apiPromiseWrapper from '../services/apiClientPromiseWrapper';
import {
  RestorationMethodMetricsApi,
  RestorationMethodMetricUpdate,
  RestorationMethodMetricCreate
} from 'wrm-api';

export const CREATE_METRICS = 'metrics/CREATE_METRICS'
export const GET_METRICS = 'metrics/GET_METRICS';
export const GET_METRICS_INSPECT = 'metrics/GET_METRICS_INSPECT';
export const PATCH_METRICS = 'metrics/PATCH_METRICS';
export const DELETE_METRIC = 'metrics/DELETE_METRIC';

export function createMetrics(metricArray, pitchId) {
  return (dispatch, getState) => {
    const promises = [];
    const token = getState().auth.login.data.token;

    metricArray.forEach(metric => {
      metric.pitch_id = pitchId;
      if (!metric.species_impacted) {
        metric.species_impacted = [];
      }

      if (typeof metric.carbon_impact === "undefined") {
        metric.carbon_impact = null;
      }

      if (typeof metric.biomass_per_hectare === "undefined") {
        metric.biomass_per_hectare = null;
      }
      const data = RestorationMethodMetricCreate.constructFromObject(metric);

      promises.push(new apiPromiseWrapper(new RestorationMethodMetricsApi(), 'restorationMethodMetricsPost', data, token))
    });

    const action = createAsyncAction({
      type: CREATE_METRICS,
      payload: {
        promise: Promise.all(promises)
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
};

export function getMetrics(pitchId) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: GET_METRICS,
      payload: {
        promise: new Promise(async (resolve, reject) => {
          try {
            const metrics = await new apiPromiseWrapper(new RestorationMethodMetricsApi(),
              'pitchesIDRestorationMethodMetricsGet', null, token, pitchId);
            resolve(metrics);
          } catch(err) {
            reject(err);
          }
        })
      }
    });
    dispatch(action);
    return action.payload.promise;
  }
};

export function getMetricsInspect(pitchId) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;
    const action = createAsyncAction({
      type: GET_METRICS_INSPECT,
      payload: {
        promise: new Promise(async (resolve, reject) => {
          try {
            const metrics = await new apiPromiseWrapper(new RestorationMethodMetricsApi(),
              'pitchesIDRestorationMethodMetricsInspectGet', null, token, pitchId);
            resolve(metrics);
          } catch(err) {
            reject(err);
          }
        })
      }
    });
    dispatch(action);
    return action.payload.promise;
  }
};

export function patchMetrics(metricArray) {
  return (dispatch, getState) => {
    const promises = [];
    const token = getState().auth.login.data.token;

    metricArray.forEach(metric => {
      const metricId = metric.id;
      const data = RestorationMethodMetricUpdate.constructFromObject(metric);

      promises.push(new apiPromiseWrapper(new RestorationMethodMetricsApi(),
        'restorationMethodMetricsIDPatch', data, token, metricId))
    });

    const action = createAsyncAction({
      type: PATCH_METRICS,
      payload: {
        promise: Promise.all(promises)
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
};

export function deleteMetric(metricId) {
  return (dispatch, getState) => {
    const token = getState().auth.login.data.token;

    const action = createAsyncAction({
      type: DELETE_METRIC,
      payload: {
        promise: new apiPromiseWrapper(new RestorationMethodMetricsApi(), 'restorationMethodMetricsIDDelete', null, token, metricId)
      }
    });

    dispatch(action);

    return action.payload.promise;
  }
}

export function clearCreateMetrics() {
  return {
    type: CREATE_METRICS + '_clear'
  };
}

export function clearPatchMetrics() {
  return {
    type: PATCH_METRICS + '_clear'
  }
};

export function clearDeleteMetric() {
  return {
    type: DELETE_METRIC + '_clear'
  }
};

export function clearGetMetrics() {
  return {
    type: GET_METRICS + '_clear'
  };
};

export function clearGetMetricsInspect() {
  return {
    type: GET_METRICS_INSPECT + '_clear'
  };
};
