/**
 * This file is an extension of SimpleFormIteratorItem
 */
import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import clsx from "clsx";
import { RaRecord } from "ra-core";
import * as React from "react";
import { Children, cloneElement, isValidElement, ReactElement, useMemo } from "react";
import {
  ArrayInputContextValue,
  SimpleFormIteratorClasses,
  SimpleFormIteratorItemContext,
  SimpleFormIteratorItemContextValue,
  SimpleFormIteratorItemProps,
  useSimpleFormIterator
} from "react-admin";

export const AccordionFormIteratorItem = React.forwardRef((props: AccordionFormIteratorItemProps, ref: any) => {
  const {
    children,
    disabled,
    disableReordering,
    disableRemove,
    getItemLabel,
    index,
    inline = false,
    member,
    record,
    removeButton,
    reOrderButtons,
    resource,
    source,
    summaryChildren
  } = props;

  const { total, reOrder, remove } = useSimpleFormIterator();
  const [expandAccordion, setExpandAccordion] = React.useState(false);
  // Returns a boolean to indicate whether to disable the remove button for certain fields.
  // If disableRemove is a function, then call the function with the current record to
  // determining if the button should be disabled. Otherwise, use a boolean property that
  // enables or disables the button for all of the fields.
  const disableRemoveField = (record: RaRecord) => {
    if (typeof disableRemove === "boolean") {
      return disableRemove;
    }
    return disableRemove && disableRemove(record);
  };

  const context = useMemo<SimpleFormIteratorItemContextValue>(
    () => ({
      index,
      total,
      reOrder: newIndex => reOrder(index, newIndex),
      remove: () => remove(index)
    }),
    [index, total, reOrder, remove]
  );

  const label = typeof getItemLabel === "function" ? getItemLabel(index) : getItemLabel;

  return (
    <SimpleFormIteratorItemContext.Provider value={context}>
      <Accordion className="w-full" expanded={expandAccordion}>
        <AccordionSummary expandIcon={<ExpandMore onClick={() => setExpandAccordion(e => !e)} />}>
          <button
            className="flex-1 line-clamp-1"
            title={props.summaryTitle}
            type="button"
            onClick={() => setExpandAccordion(e => !e)}
          >
            {props.summaryTitle}
          </button>
          {summaryChildren}
          {reOrderButtons &&
            !disableReordering &&
            cloneElement(reOrderButtons, {
              index,
              max: total,
              reOrder,
              className: clsx("button-reorder", `button-reorder-${source}-${index}`)
            })}
        </AccordionSummary>
        <AccordionDetails>
          <li className={SimpleFormIteratorClasses.line} ref={ref}>
            {label && (
              <Typography variant="body2" className={SimpleFormIteratorClasses.index}>
                {label}
              </Typography>
            )}
            <section
              className={clsx(SimpleFormIteratorClasses.form, inline && SimpleFormIteratorClasses.inline, "space-y-6")}
            >
              {
                //@ts-ignore
                Children.map(children, (input: ReactElement, index2) => {
                  if (!isValidElement<any>(input)) {
                    return null;
                  }
                  const { source, ...inputProps } = input.props;
                  return cloneElement(input, {
                    source: source ? `${member}.${source}` : member,
                    index: source ? undefined : index2,
                    resource,
                    disabled,
                    ...inputProps
                  });
                })
              }
            </section>
            {!disabled && (
              <span className={SimpleFormIteratorClasses.action}>
                {removeButton &&
                  !disableRemoveField(record) &&
                  cloneElement(removeButton, {
                    className: clsx("button-remove", `button-remove-${source}-${index}`)
                  })}
              </span>
            )}
          </li>
        </AccordionDetails>
      </Accordion>
    </SimpleFormIteratorItemContext.Provider>
  );
});

export interface AccordionFormIteratorItemProps extends SimpleFormIteratorItemProps, Partial<ArrayInputContextValue> {
  summaryTitle: string;
  summaryChildren?: React.ReactNode;
}
