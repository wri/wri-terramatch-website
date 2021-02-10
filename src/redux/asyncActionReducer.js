import reduxConstants from "./reduxConstants";
import { ACTION_TYPE_CLEAR_TRANSIENT_STATE } from "./configureStore";

import PropTypes from "prop-types";

/**
 * A standard state structure for asynchronously retrieved data.
 */
export const initialAsyncState = Object.freeze({
  /**
   * Whether or not the async action is currently in progress (awaiting data)
   */
  isFetching: false,

  /**
   * The last time the action was initiated
   */
  lastFetchTime: 0,

  /**
   * The last time the action succeeded
   */
  lastSuccessTime: 0,

  /**
   * The metadata associated with the async action. This is applied locally and includes e.g. a timestamp and a requestId
   */
  meta: null,

  /**
   * The data retrieved last time this async action was successfully performed.
   */
  data: null,

  /**
   * If any metadata was included in the payload of the SUCCESS action, then it will be included here instead of in the main data section, for clarity.
   */
  responseMeta: null,

  /**
   * The error received last time this async action failed.
   */
  error: null,

  /**
   * Whether or not the data retrieved last time this async action was successfully performed is now marked as
   * invalid or out-of-date.
   */
  isInvalidated: false,

  /**
   * How many times consecutively this action has failed. (Reset upon success).
   *
   * This is used by {@code shouldPerformAsyncAction} to ensure the same action does not occur too many times in
   * quick succession.
   */
  consecutiveFailureCount: 0
});

/**
 * Defines the expected shape of the asynchronous state object outlined above so React components can correctly represent it in their {@code propTypes}
 * definition.
 * @const
 */
export const initialAsyncStatePropType = PropTypes.shape({
  isFetching: PropTypes.bool.isRequired,
  lastFetchTime: PropTypes.number.isRequired,
  lastSuccessTime: PropTypes.number.isRequired,
  data: PropTypes.any,
  responseMeta: PropTypes.any,
  meta: PropTypes.shape({
    timestamp: PropTypes.number,
    requestId: PropTypes.number
  }),
  error: PropTypes.any,
  isInvalidated: PropTypes.bool.isRequired,
  consecutiveFailureCount: PropTypes.number.isRequired
});

/**
 * Defines a react propType of async redux state,
 *  with an array of other propTypes as it's data source
 */
export const asyncStatePropType = {
  of: (dataPropType = PropTypes.any) => {
    return PropTypes.shape({
      isFetching: PropTypes.bool.isRequired,
      lastFetchTime: PropTypes.number.isRequired,
      lastSuccessTime: PropTypes.number.isRequired,
      data: dataPropType,
      responseMeta: PropTypes.any,
      meta: PropTypes.shape({
        timestamp: PropTypes.number,
        requestId: PropTypes.number
      }),
      error: PropTypes.any,
      isInvalidated: PropTypes.bool.isRequired,
      consecutiveFailureCount: PropTypes.number.isRequired
    });
  }
};

/**
 * A standard reducer to handle async actions
 *
 * @param {String} handledAction - The action name for the action that is handled by this reducer
 * @param {string} [dataParameter="data"] - The field to pull the data out of from action.payload
 * @param {Object} [state=initialAsyncState] - The pre-existing state to be mutated by this reducer
 * @param {Object} action - The action that this reducer must mutate state in response to
 * @param {String} action.type - The type of the action
 * @param {Object} action.payload - The payload of the action
 *
 * @returns {Object} The new state
 */
export function asyncActionReducer(handledAction, dataParameter, state = initialAsyncState, action) {
  switch (action.type) {
    case handledAction + "_" + reduxConstants.PENDING_SUFFIX:
      return {
        ...state,
        meta: action.meta,
        isFetching: true,
        lastFetchTime: action.meta.timestamp
      };
    case handledAction + "_" + reduxConstants.SUCCESS_SUFFIX:
      // Ignore stale requests
      if (!state.meta || state.meta.requestId !== action.meta.requestId) {
        return state;
      }

      return {
        ...state,
        isFetching: false,
        data: action.payload && action.payload[dataParameter] ? action.payload[dataParameter] : action.payload,
        responseMeta: action.payload ? action.payload.meta : null,
        error: null,
        isInvalidated: false,
        consecutiveFailureCount: 0,
        lastSuccessTime: action.meta.timestamp
      };
    case handledAction + "_" + reduxConstants.FAILURE_SUFFIX:
      // Ignore stale requests
      if (!state.meta || state.meta.requestId !== action.meta.requestId) {
        return state;
      }

      return {
        ...state,
        isFetching: false,
        error: action.payload,
        consecutiveFailureCount: state.consecutiveFailureCount + 1
      };
    case handledAction + "_" + reduxConstants.INVALIDATE_SUFFIX:
      return {
        ...state,
        isInvalidated: true
      };
    case handledAction + "_" + reduxConstants.CLEAR_SUFFIX:
      return {
        ...state,
        ...initialAsyncState
      };
    case ACTION_TYPE_CLEAR_TRANSIENT_STATE:
      // Clear transient properties when requested (usually on app startup)
      return {
        ...state,
        isFetching: false,
        isInvalidated: true
      };
    default: {
      return state
    }
  }
}

/**
 * Generic reducer for state that maps a key extracted from the meta block of each action to async state concerning that key.
 *
 * For instance, it could be used to maintain a map from "business IDs" to async state about each of those businesses.
 *
 * @param {Object} settings - Configuration for this reducer
 * @param {string} settings.handledAction - The name of the action to handle
 * @param {string} settings.mappingKeyExtractor - Function that extracts the name of the key to use in order to map actions to the correct nested reducer
 * @param {func} settings.nestedReducer - A reducer to handle each mapped key
 * @param {Object} [state={}] The previous chunk of state, in the form of a map from IDs to async state.
 * @param {Object} action - The redux standard action used to update state
 * @returns {Object} The updated chunk of state
 */
export function mappingReducer(settings, state = {}, action) {
  const { handledAction, mappingKeyExtractor, nestedReducer } = settings;

  if (action.type.startsWith(handledAction)) {
    const mappingKey = mappingKeyExtractor(action);
    if (mappingKey === undefined) {
      if (action.type.endsWith(reduxConstants.CLEAR_SUFFIX)) {
        return {};
      } else {
        console.warn(`${handledAction} without a mapping key`, action);
      }
    } else {
      const previousState = state[mappingKey] || undefined;
      return {
        ...state,
        [mappingKey]: nestedReducer(previousState, action)
      };
    }
  }

  return state;
}

export const initialPaginatedState = Object.freeze({
  ...initialAsyncState,
  pagination: null
});

/**
 * A standard reducer to handle async actions that refer to paginatable states
 *
 * @param {string} handledAction - The action name for the action that is handled by this reducer
 * @param {Object} [state=initialPaginatedState] - The pre-existing state to be mutated by this reducer
 * @param {string} [dataParameter="data"] - The field to pull the data out of from action.payload
 * @param {Object} action - The action that this reducer must mutate state in response to
 * @param {string} action.type - The type of the action
 * @param {Object} action.payload - The payload of the action
 * @param {Object} [action.payload.meta] - The meta of the original action
 * @param {Object} [action.payload.meta.pagination] - The pagination object of the action
 * @param {Object} action.payload[dataParameter] - The data to be saved/appended into state
 *
 * @returns {Object} The new state
 */
export function asyncPaginatedActionReducer(
  handledAction,
  dataParameter = "data",
  state = initialPaginatedState,
  action
) {
  dataParameter = "data";
  
  switch (action.type) {
    case handledAction + "_" + reduxConstants.PENDING_SUFFIX:
      return {
        ...state,
        meta: action.meta,
        isFetching: true,
        lastFetchTime: action.meta.timestamp
      };
    case handledAction + "_" + reduxConstants.SUCCESS_SUFFIX: {
      // Ignore stale requests
      if (!state.meta || state.meta.requestId !== action.meta.requestId) {
        return state;
      }

      let data = {};
      const pagination = action.payload.Pagination !== undefined ? action.payload.Pagination : undefined;
      data = action.payload[dataParameter];

      return {
        ...state,
        isFetching: false,
        data: data,
        pagination: pagination,
        error: null,
        isInvalidated: false,
        consecutiveFailureCount: 0,
        lastSuccessTime: action.meta.timestamp
      };
    }
    case handledAction + "_" + reduxConstants.FAILURE_SUFFIX:
      // Ignore stale requests
      if (!state.meta || state.meta.requestId !== action.meta.requestId) {
        return state;
      }

      return {
        ...state,
        isFetching: false,
        error: action.payload,
        consecutiveFailureCount: state.consecutiveFailureCount + 1
      };
    case handledAction + "_" + reduxConstants.INVALIDATE_SUFFIX:
      return {
        ...state,
        pagination: null,
        isInvalidated: true
      };
    case handledAction + "_" + reduxConstants.CLEAR_SUFFIX:
      return {
        ...state,
        ...initialPaginatedState
      };
    case ACTION_TYPE_CLEAR_TRANSIENT_STATE:
      // Clear transient properties when requested (usually on app startup)
      return {
        ...state,
        isFetching: false
      };
    default:
      return state;
  }
}
