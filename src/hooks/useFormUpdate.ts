import { isEqual } from "lodash";
import { useCallback, useEffect, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";

import { pruneEntityCache } from "@/connections/Entity";
import {
  PatchV2FormsSubmissionsUUIDRequestBody,
  PutV2FormsENTITYUUIDRequestBody,
  usePatchV2FormsSubmissionsUUID,
  usePutV2FormsENTITYUUID
} from "@/generated/apiComponents";
import { EntityName } from "@/types/common";
import Log from "@/utils/log";

type FormBody = PutV2FormsENTITYUUIDRequestBody | PatchV2FormsSubmissionsUUIDRequestBody;

type FormUpdateState<T extends FormBody> = {
  id: string;
  started: boolean;
  body: T;
}[];
type AddUpdateAction<T extends FormBody> = {
  type: "addUpdate";
  body: T;
};
type UpdateStartedAction = {
  type: "updateStarted";
  id: string;
};
type FormUpdateAction<T extends FormBody> = AddUpdateAction<T> | UpdateStartedAction;

function reducer<T extends FormBody>(state: FormUpdateState<T>, action: FormUpdateAction<T>): FormUpdateState<T> {
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

const useFormReducer = <T extends FormBody>(update: (body: T) => void, isUpdating: boolean) => {
  const [updateState, dispatch] = useReducer(reducer<T>, []);

  useEffect(() => {
    if (isUpdating || updateState.length === 0 || updateState[0].started) return;

    // Pull the update from the front of the queue and send it.
    const { id, body } = updateState[0];
    dispatch({ type: "updateStarted", id });
    update(body);
  }, [isUpdating, update, updateState]);

  return useCallback((body: T) => {
    dispatch({ type: "addUpdate", body });
  }, []);
};

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

  const updateEntity = useFormReducer(
    useCallback(
      (body: PutV2FormsENTITYUUIDRequestBody) => {
        mutate({
          pathParams: { uuid: entityUUID, entity: entityName },
          body
        });
        // When an entity is updated via form, we want to forget the cached copy we might have from v3
        // so it gets re-fetched when a component needs it.
        // TODO TM-2581 Remove once we get the real update from v3.
        pruneEntityCache(entityName, entityUUID);
      },
      [entityName, entityUUID, mutate]
    ),
    isUpdating
  );

  return { updateEntity, error, isSuccess, isUpdating };
};

export const useSubmissionUpdate = (submissionUUID: string) => {
  const { mutate, error, isSuccess, isLoading: isUpdating } = usePatchV2FormsSubmissionsUUID({});

  const updateSubmission = useFormReducer(
    useCallback(
      (body: PatchV2FormsSubmissionsUUIDRequestBody) => {
        mutate({
          pathParams: { uuid: submissionUUID },
          body
        });
      },
      [mutate, submissionUUID]
    ),
    isUpdating
  );

  return { updateSubmission, error, isSuccess, isUpdating };
};
