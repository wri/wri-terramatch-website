import { Box, FormHelperText, styled } from "@mui/material";
import classNames from "classnames";
import React, { FC, useEffect, useLayoutEffect, useRef } from "react";
import { InputProps, useInput } from "react-admin";

const Quill = typeof window === "undefined" ? undefined : require("quill").default;
if (Quill != null) {
  require("quill/dist/quill.snow.css");
}

type SemanticHtmlInputProps = {
  source: string;
  label: string;
  validate: InputProps["validate"];
  helperText?: string;
};

const StyledFieldset = styled(Box)(({ theme }) => ({
  border: `1px solid rgba(0, 0, 0, 0.25)`,
  borderRadius: theme.shape.borderRadius,
  "&:hover": {
    border: `1px solid rgb(0 0 0)`
  },
  ".error &": {
    border: `1px solid rgb(255, 0, 0)`
  },
  "& legend": {
    margin: theme.spacing(0, 0.75),
    padding: theme.spacing(0, 1),
    color: theme.palette.text.secondary,
    fontSize: "0.8rem",
    fontWeight: 500
  }
}));

// A different approach from `QuillEditor.tsx` for editing HTML input. In this case we keep a
// tighter handle on the generated HTML and get the semantic HTML (as simple as possible) so that
// it's easier to translate cleanly on Transifex.
const SemanticHtmlInput: FC<SemanticHtmlInputProps> = ({ label, source, validate, helperText }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { field, fieldState, isRequired } = useInput({ source, validate });
  const fieldRef = useRef(field);

  useLayoutEffect(() => {
    fieldRef.current = field;
  });

  useEffect(() => {
    const container = containerRef.current as HTMLDivElement;
    const editorDiv = container.appendChild(container.ownerDocument.createElement("div"));
    if (fieldRef.current.value != null) {
      editorDiv.innerHTML = fieldRef.current.value;
    }

    const quill = new Quill(editorDiv, {
      theme: "snow",
      modules: {
        toolbar: ["bold", { list: "bullet" }]
      },
      bounds: document.body
    });

    quill.on("text-change", () => {
      if (fieldRef.current != null) {
        const content = quill.getSemanticHTML().replaceAll("&nbsp;", " ");
        // represent empty content accurately
        fieldRef.current.onChange(content === "<p></p>" ? "" : content);
      }
    });

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
    <div className={classNames("quill-wrapper pb-2", { error: fieldState.invalid })}>
      <style>{`
        .quill-wrapper .ql-container { 
          border: none;
        }
        
        .quill-wrapper .ql-toolbar {
          border-top: none;
          border-left: none;
          border-right: none;
          padding-top: 2px;
        }
        
        .quill-wrapper .ql-editor ol {
          padding-left: 0;
        }
      `}</style>
      <StyledFieldset component="fieldset">
        <legend>{`${label}${isRequired ? " *" : ""}`}</legend>
        <div ref={containerRef}></div>
      </StyledFieldset>
      <FormHelperText className="pl-4" error={fieldState.invalid}>
        {fieldState.error?.message ?? helperText ?? " "}
      </FormHelperText>
    </div>
  );
};

export default SemanticHtmlInput;
