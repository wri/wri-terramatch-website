import { yupResolver } from "@hookform/resolvers/yup";
import { useT } from "@transifex/react";
import { memo, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { When } from "react-if";

import Tabs, { TabItem } from "@/components/elements/Tabs/Default/Tabs";
import { FormStep } from "@/components/extensive/WizardForm/FormStep";
import { FormStepSchema } from "@/components/extensive/WizardForm/types";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import { useModalContext } from "@/context/modal.provider";
import { ErrorWrapper } from "@/generated/apiFetcher";
import { useDebounce } from "@/hooks/useDebounce";

import { FormFooter } from "./FormFooter";
import { WizardFormHeader } from "./FormHeader";
import FormSummary, { FormSummaryOptions } from "./FormSummary";
import SaveAndCloseModal from "./modals/SaveAndCloseModal";
import { downloadAnswersCSV, getSchema, getStepIndexByValues } from "./utils";

export interface WizardFormProps {
  steps: FormStepSchema[];
  defaultValues?: any;
  onStepChange?: (values: any, step: FormStepSchema) => void;
  onChange?: (values: any) => void;
  onSubmit?: (values: any) => void;
  onBackFirstStep: () => void;
  onCloseForm?: () => void;

  formStatus?: "saving" | "saved";
  title?: string;
  errors?: ErrorWrapper<null>;
  summaryOptions?: FormSummaryOptions & {
    downloadButtonText?: string;
  };

  header?: {
    hide?: boolean;
  };

  // Footer
  nextButtonText?: string;
  submitButtonText?: string;
  submitButtonDisable?: boolean;
  backButtonText?: string;
  hideBackButton?: boolean;
  hideSaveAndCloseButton?: boolean;

  tabOptions?: {
    vertical?: boolean;
    disableFutureTabs?: boolean;
    markDone?: boolean;
  };

  disableAutoProgress?: boolean;
  disableInitialAutoProgress?: boolean;

  initialStepIndex?: number;
}

function WizardForm(props: WizardFormProps) {
  const t = useT();
  const modal = useModalContext();

  const [selectedStepIndex, setSelectedStepIndex] = useState(props.initialStepIndex || 0);
  const selectedStep = props.steps?.[selectedStepIndex];
  const selectedValidationSchema = selectedStep ? getSchema(selectedStep.fields) : undefined;
  const lastIndex = props.summaryOptions ? props.steps.length : props.steps.length - 1;

  const formHook = useForm(
    selectedValidationSchema
      ? {
          resolver: yupResolver(selectedValidationSchema),
          defaultValues: props.defaultValues,
          mode: "onTouched"
        }
      : { mode: "onTouched" }
  );

  if (process.env.NODE_ENV === "development") {
    console.log("Form Steps", props.steps);
    console.log("Form Values", formHook.watch());
    console.log("Form Errors", formHook.formState.errors);
  }

  const onChange = useDebounce(() => props.onChange && props.onChange(formHook.getValues()));

  const onSubmitStep = (data: any) => {
    if (selectedStepIndex < lastIndex) {
      //Step changes through 0 - last step
      if (!props.disableAutoProgress) {
        //Disable auto step progress if disableAutoProgress was passed
        setSelectedStepIndex(n => n + 1);
      }
      props.onStepChange?.(data, selectedStep);
    } else {
      //Step changes on last step
      if (!props.onSubmit) return props.onStepChange?.(data, selectedStep);
      props.onSubmit?.(data);
    }
  };

  const onClickSaveAndClose = () => {
    modal.openModal(<SaveAndCloseModal onConfirm={props.onCloseForm || props.onBackFirstStep} />);
  };

  useEffect(() => {
    if (props.errors) {
      formHook.clearErrors();
      props.errors.errors?.forEach(error => {
        formHook.setError(error.source, {
          message: error.detail,
          type: error.code
        });
      });
    }
  }, [formHook, props.errors]);

  const initialStepIndex = useMemo(() => {
    return getStepIndexByValues(props.defaultValues, props.steps);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.defaultValues, props.steps]);

  useEffect(() => {
    if (!props.disableAutoProgress && !props.disableInitialAutoProgress) setSelectedStepIndex(initialStepIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (props.defaultValues) {
      for (const [key, value] of Object.entries(props.defaultValues)) {
        formHook.setValue(key, value);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.defaultValues]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [selectedStepIndex]);

  const stepTabItems = props.steps.map((step, index) => ({
    title: step.tabTitle || t(`Step {number}<br/> {title}`, { number: index + 1, title: step.title }),
    done: props.tabOptions?.markDone && index < selectedStepIndex,
    disabled: props.tabOptions?.disableFutureTabs && index > selectedStepIndex,
    body: (
      <FormStep
        formHook={formHook}
        fields={step.fields}
        title={step.title}
        subtitle={step.subtitle}
        onChange={onChange}
      >
        <FormFooter
          className="mt-12"
          backButtonProps={
            !props.hideBackButton
              ? {
                  children: props.backButtonText || t("Back"),
                  onClick: () => {
                    if (selectedStepIndex > 0) {
                      setSelectedStepIndex(n => n - 1);
                    } else {
                      props.onBackFirstStep();
                    }
                  }
                }
              : undefined
          }
          submitButtonProps={{
            children:
              selectedStepIndex < lastIndex
                ? props.nextButtonText || t("Save and continue")
                : props.submitButtonText || t("Submit"),
            onClick: formHook.handleSubmit(onSubmitStep),
            disabled:
              (selectedStepIndex === lastIndex && props.submitButtonDisable) ||
              Object.keys(formHook.formState.errors).length > 0
          }}
        />
      </FormStep>
    )
  }));

  const summaryItem = {
    title: t(`Step {number}<br/> {title}`, { number: lastIndex + 1, title: props.summaryOptions?.title }),
    done: props.tabOptions?.markDone && props.steps.length < selectedStepIndex,
    disabled: props.tabOptions?.disableFutureTabs && props.steps.length > selectedStepIndex,
    body: (
      <FormStep
        formHook={formHook}
        title={props.summaryOptions?.title!}
        subtitle={props.summaryOptions?.subtitle}
        onChange={onChange}
        actionButtonProps={
          props.summaryOptions?.downloadButtonText
            ? {
                children: props.summaryOptions?.downloadButtonText,
                onClick: () => downloadAnswersCSV(props.steps, formHook.getValues())
              }
            : undefined
        }
      >
        <FormSummary values={formHook.getValues()} steps={props.steps} onEdit={setSelectedStepIndex} />
        <FormFooter
          className="mt-14"
          backButtonProps={{
            children: t("Back"),
            onClick: () => setSelectedStepIndex(n => n - 1)
          }}
          submitButtonProps={{
            children: t("Submit"),
            onClick: formHook.handleSubmit(onSubmitStep),
            disabled: props.submitButtonDisable
          }}
        />
      </FormStep>
    )
  };

  const tebItems: TabItem[] = props.summaryOptions ? [...stepTabItems, summaryItem] : stepTabItems;

  const TabWrapper = props.tabOptions?.vertical ? "div" : ContentLayout;

  return (
    <div>
      <When condition={!props.header?.hide}>
        <WizardFormHeader
          currentStep={selectedStepIndex + 1}
          numberOfSteps={tebItems.length}
          formStatus={props.formStatus}
          errorMessage={props.errors && t("Something went wrong")}
          onClickSaveAndCloseButton={!props.hideSaveAndCloseButton ? onClickSaveAndClose : undefined}
          title={props.title}
        />
      </When>
      <TabWrapper className="mt-0">
        <Tabs
          onChangeSelected={setSelectedStepIndex}
          selectedIndex={selectedStepIndex}
          tabItems={tebItems}
          vertical={props.tabOptions?.vertical}
          itemOption={{
            textVariant: !props.tabOptions?.vertical ? "text-body-500" : "text-heading-300"
          }}
          carouselOptions={{
            slidesPerView: 3
          }}
          sticky={!props.tabOptions?.vertical}
        />
      </TabWrapper>
    </div>
  );
}

export default memo(WizardForm);
