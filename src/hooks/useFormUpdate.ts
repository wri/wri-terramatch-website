import { isEqual } from "lodash";
import { useEffect, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";

import {
  PutV2FormsENTITYUUIDRequestBody,
  PutV2FormsENTITYUUIDResponse,
  usePutV2FormsENTITYUUID
} from "@/generated/apiComponents";
import { EntityName } from "@/types/common";
import Log from "@/utils/log";

type FormUpdateState = {
  id: string;
  started: boolean;
  body: PutV2FormsENTITYUUIDRequestBody;
}[];
type AddUpdateAction = {
  type: "addUpdate";
  body: PutV2FormsENTITYUUIDRequestBody;
};
type UpdateStartedAction = {
  type: "updateStarted";
  id: string;
};
type FormUpdateAction = AddUpdateAction | UpdateStartedAction;

function reducer(state: FormUpdateState, action: FormUpdateAction): FormUpdateState {
  if (action.type === "addUpdate") {
    // If the body is the same as the front of the queue, ignore this update. The front of the
    // queue is either the update in progress, or the update most recently sent.
    if (isEqual(state[0]?.body, action.body)) return state;
    return [{ id: uuidv4(), started: false, body: action.body }, ...state];
  } else if (action.type === "updateStarted") {
    const idx = state.findIndex(({ id }) => id === action.id);
    if (idx < 0) {
      Log.error("Update not found in reducer state", { action, state });
      return state;
    }

    // If we just started one, we no longer care about the rest of the queue.
    return [...state.slice(0, idx), { ...state[idx], started: true }];
  }

  Log.warn("Unrecognized action", { action });
  return state;
}

/**
 * A hook to make calling the form update endpoint cleaner. Two factors are important that this fixes:
 *  1) The WizardForm calls onChange really aggressively, and sometimes with the same data multiple times in a row.
 *  2) When using usePutV2FormsENTITTYUUID directly in the form edit components, it was easily possible to issue
 *     multiple update requests to the BE in parallel, which has some hard to diagnose downstream effects (like
 *     duplicate Workdays getting created on reports) when the BE processes two identical updates at the same
 *     time from different threads. As such, this hook prevents two update requests from happening at the same time.
 */
export const useFormUpdate = (entityName: EntityName, entityUUID: string) => {
  const { mutate, error, isSuccess, isLoading: isUpdating } = usePutV2FormsENTITYUUID({});
  const [updateState, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    if (isUpdating || updateState.length === 0 || updateState[0].started) return;

    // Pull the update from the front of the queue and send it.
    const { id, body } = updateState[0];
    dispatch({ type: "updateStarted", id });
    mutate({
      pathParams: { uuid: entityUUID, entity: entityName },
      body
    });
  }, [entityName, entityUUID, isUpdating, mutate, updateState]);

  const updateEntity = (body: PutV2FormsENTITYUUIDResponse) => {
    dispatch({ type: "addUpdate", body });
  };

  return { updateEntity, error, isSuccess, isUpdating };
};
