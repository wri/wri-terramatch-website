import { isFunction } from "lodash";
import { ReadonlyURLSearchParams, usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { SetStateAction, useCallback, useRef } from "react";

import { FormFieldsProvider } from "@/context/wizardForm.provider";
import Log from "@/utils/log";

export const STEP_QUERY_PARAM = "formStepId";
const SUMMARY_ID = "summary";

type NavigationContext = {
  pathname: string;
  searchParams: ReadonlyURLSearchParams;
  stepIds: string[];
  selectedStepIndex: number;
};

export const useFormNavigation = (fieldsProvider: FormFieldsProvider) => {
  const router = useRouter();

  // Use a ref to store several things to prevent them from causing the useCallback below to
  // recalculate every time the URL changes so that it can be a stable function to pass around
  // in component props.
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentStepId = searchParams.get(STEP_QUERY_PARAM);
  const stepIds = fieldsProvider.stepIds();
  const selectedStepIndex =
    currentStepId === SUMMARY_ID ? stepIds.length : stepIds.findIndex(stepId => stepId === currentStepId);
  const navContext = { pathname, searchParams, stepIds, selectedStepIndex };
  const context = useRef<NavigationContext>(navContext);
  context.current = navContext;

  const setSelectedStepIndex = useCallback(
    (value: SetStateAction<number>) => {
      const { stepIds, selectedStepIndex, searchParams, pathname } = context.current;

      const stepIndex = isFunction(value) ? value(selectedStepIndex) : value;
      if (stepIndex === selectedStepIndex) return;

      const params = new URLSearchParams(searchParams.toString());
      if (stepIndex < 0 || stepIndex > stepIds.length) {
        params.delete(STEP_QUERY_PARAM);
      } else {
        params.set(STEP_QUERY_PARAM, stepIndex === stepIds.length ? SUMMARY_ID : stepIds[stepIndex]);
      }

      const path = `${pathname}?${params}`;
      const promise = selectedStepIndex < 0 ? router.replace(path) : router.push(path);
      promise.catch(error => {
        Log.error("Navigating to form step failed", error);
      });
    },
    [router]
  );

  return { selectedStepIndex, setSelectedStepIndex };
};
