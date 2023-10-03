/**
 * This file is an extension of SimpleFormIterator
 */
import { Accordion, AccordionSummary, styled } from "@mui/material";
import clsx from "clsx";
import get from "lodash/get";
import { useRecordContext } from "ra-core";
import * as React from "react";
import { Children, cloneElement, MouseEvent, MouseEventHandler, useCallback, useMemo, useRef } from "react";
import {
  AddItemButton as DefaultAddItemButton,
  FormDataConsumer,
  ReOrderButtons as DefaultReOrderButtons,
  SimpleFormIteratorClasses,
  SimpleFormIteratorContext,
  SimpleFormIteratorPrefix,
  SimpleFormIteratorProps,
  useArrayInput
} from "react-admin";
import { UseFieldArrayReturn } from "react-hook-form";

import { AccordionFormIteratorItem } from "@/admin/components/AccordionFormIterator/AccordionFormIteratorItem";

export const AccordionFormIterator = (props: AccordionFormIteratorProps) => {
  const {
    addButton = <DefaultAddItemButton />,
    removeButton,
    reOrderButtons = <DefaultReOrderButtons />,
    children,
    className,
    resource,
    source,
    disabled,
    disableAdd,
    disableRemove,
    disableReordering,
    inline,
    getItemLabel = false,
    fullWidth,
    sx,
    defaultExpanded,
    summaryChildren
  } = props;

  const { append, fields, move, remove } = useArrayInput(props);

  const record = useRecordContext(props);
  const initialDefaultValue = useRef<any>({});

  const removeField = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove]
  );

  if (fields.length > 0) {
    // eslint-disable-next-line no-unused-vars
    const { id, ...rest } = fields[0];
    initialDefaultValue.current = rest;

    for (const k in initialDefaultValue.current) initialDefaultValue.current[k] = "";
  }

  const addField = useCallback(
    (item: any = undefined) => {
      let defaultValue = item;
      if (item == null) {
        defaultValue = initialDefaultValue.current;
        if (
          Children.count(children) === 1 &&
          React.isValidElement(Children.only(children)) &&
          // @ts-ignore
          !Children.only(children).props.source
        ) {
          // ArrayInput used for an array of scalar values
          // (e.g. tags: ['foo', 'bar'])
          defaultValue = "";
        } else {
          // ArrayInput used for an array of objects
          // (e.g. authors: [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Doe' }])
          defaultValue = defaultValue || ({} as Record<string, unknown>);
          Children.forEach(children, input => {
            if (React.isValidElement(input) && input.type !== FormDataConsumer && input.props.source) {
              defaultValue[input.props.source] = input.props.defaultValue ?? "";
            }
          });
        }
      }
      append(defaultValue);
    },
    [append, children]
  );

  // add field and call the onClick event of the button passed as addButton prop
  const handleAddButtonClick = (originalOnClickHandler: MouseEventHandler) => (event: MouseEvent) => {
    addField();
    if (originalOnClickHandler) {
      originalOnClickHandler(event);
    }
  };

  const handleReorder = useCallback(
    (origin: number, destination: number) => {
      move(origin, destination);
    },
    [move]
  );

  const records = get(record, source!);

  const context = useMemo(
    () => ({
      total: fields.length,
      add: addField,
      remove: removeField,
      reOrder: handleReorder,
      source
    }),
    [addField, fields.length, handleReorder, removeField, source]
  );
  return fields ? (
    //@ts-ignore
    <SimpleFormIteratorContext.Provider value={context}>
      <Root className={clsx(className, fullWidth && "fullwidth", disabled && "disabled")} sx={sx}>
        <ul className={SimpleFormIteratorClasses.list}>
          {fields.map((member, index, array) => (
            <AccordionFormIteratorItem
              key={member.id}
              summaryTitle={props.accordionSummaryTitle(index, array)}
              disabled={disabled}
              disableRemove={disableRemove}
              disableReordering={disableReordering}
              fields={fields}
              getItemLabel={getItemLabel}
              index={index}
              member={`${source}.${index}`}
              onRemoveField={removeField}
              onReorder={handleReorder}
              record={(records && records[index]) || {}}
              removeButton={removeButton}
              reOrderButtons={reOrderButtons}
              resource={resource!}
              source={source!}
              inline={inline}
              defaultExpanded={defaultExpanded}
              summaryChildren={summaryChildren}
            >
              {children}
            </AccordionFormIteratorItem>
          ))}
          {!disableAdd && (
            <Accordion className={SimpleFormIteratorClasses.add} expanded={false}>
              <AccordionSummary>
                {cloneElement(addButton, {
                  className: clsx("button-add", `button-add-${source}`),
                  onClick: handleAddButtonClick(addButton.props.onClick)
                })}
              </AccordionSummary>
            </Accordion>
          )}
        </ul>
      </Root>
    </SimpleFormIteratorContext.Provider>
  ) : null;
};

export interface AccordionFormIteratorProps extends SimpleFormIteratorProps, Partial<UseFieldArrayReturn> {
  accordionSummaryTitle: (index: number, fields: any[]) => string;
  defaultExpanded?: boolean;
  summaryChildren?: React.ReactNode;
}

const Root = styled("div", {
  name: SimpleFormIteratorPrefix,
  overridesResolver: (props, styles) => styles.root
})(({ theme }) => ({
  "&": {
    marginTop: theme.spacing(3)
  },
  "& > ul": {
    padding: 0,
    marginTop: 0,
    marginBottom: 0
  },
  "& > ul > li:last-child": {
    // hide the last separator
    borderBottom: "none"
  },
  [`& .${SimpleFormIteratorClasses.line}`]: {
    display: "flex",
    flexDirection: "column",
    listStyleType: "none",
    [theme.breakpoints.down("sm")]: { display: "block" }
  },
  [`& .${SimpleFormIteratorClasses.index}`]: {
    display: "flex",
    alignItems: "top",
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
    [theme.breakpoints.down("md")]: { display: "none" }
  },
  [`& .${SimpleFormIteratorClasses.form}`]: {
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column"
  },
  [`&.fullwidth > ul > li > .${SimpleFormIteratorClasses.form}`]: {
    flex: 2
  },
  [`& .${SimpleFormIteratorClasses.inline}`]: {
    flexDirection: "row",
    columnGap: "1em",
    flexWrap: "wrap"
  },
  [`& .${SimpleFormIteratorClasses.action}`]: {
    display: "flex",
    justifyContent: "end",
    marginTop: theme.spacing(3),
    paddingTop: theme.spacing(3),
    borderTop: `solid 1px ${theme.palette.divider}`
  },
  [`& .${SimpleFormIteratorClasses.buttons}`]: {
    display: "flex",
    justifyContent: "center",
    marginTop: "2rem"
  },
  [`& .${SimpleFormIteratorClasses.add}`]: {
    borderBottom: "none",
    "& .button-add": {
      margin: "auto"
    }
  },
  [`& .${SimpleFormIteratorClasses.clear}`]: {
    borderBottom: "none"
  },
  [`& .${SimpleFormIteratorClasses.line}:hover > .${SimpleFormIteratorClasses.action}`]: {
    visibility: "visible"
  }
}));
