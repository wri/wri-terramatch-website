import { useT } from "@transifex/react";
import { isEqual } from "lodash";
import { useCallback, useEffect, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";

import { FormEntity, useEntityFormData } from "@/connections/Form";
import { useSubmission } from "@/connections/FormSubmission";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { StoreFormDataAttributes, UpdateSubmissionAttributes } from "@/generated/v3/entityService/entityServiceSchemas";
import { useValueChanged } from "@/hooks/useValueChanged";
import Log from "@/utils/log";

type FormBody = StoreFormDataAttributes | UpdateSubmissionAttributes;

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
 *  2) Blocks attempts to do two updates at the same time.
 */
export const useFormUpdate = (entity?: FormEntity, uuid?: string) => {
  const enabled = entity != null && uuid != null;
  const [, { update, isUpdating, updateFailure }] = useEntityFormData({ entity, uuid, enabled });
  const t = useT();

  const { openToast } = useToastContext();
  useValueChanged(updateFailure, () => {
    if (updateFailure != null) {
      Log.error("Form data save failed", updateFailure);
      openToast(t("Form data save failed"), ToastType.ERROR);
    }
  });

  const updateEntityAnswers = useFormReducer(
    useCallback(
      (body: StoreFormDataAttributes) => {
        if (enabled) {
          update(body);
        } else {
          Log.error("Asked to update form data, but entity or uuid not provided", { entity, uuid });
        }
      },
      [enabled, entity, update, uuid]
    ),
    isUpdating
  );

  return { updateEntityAnswers, entityAnswersUpdating: isUpdating };
};

export const useSubmissionUpdate = (submissionUUID?: string) => {
  const enabled = submissionUUID != null;
  const [, { update, isUpdating, updateFailure }] = useSubmission({ id: submissionUUID, enabled });
  const t = useT();

  const { openToast } = useToastContext();
  useValueChanged(updateFailure, () => {
    if (updateFailure != null) {
      Log.error("Form submission save failed", updateFailure);
      openToast(t("Application save failed"), ToastType.ERROR);
    }
  });

  const updateSubmission = useFormReducer(
    useCallback(
      (body: UpdateSubmissionAttributes) => {
        if (enabled) update(body);
        else {
          Log.error("Asked to update submission data uuid not provided");
        }
      },
      [enabled, update]
    ),
    isUpdating
  );

  return { updateSubmission, submissionUpdating: isUpdating };
};
